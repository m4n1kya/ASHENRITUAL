/**
 * @fileoverview ASHENRITUAL Vesper Mirror — Pose Estimation & Tracking Engine
 * @module PoseEngine.ts
 *
 * Implements high-precision real-time body tracking with anatomical landmark
 * anchoring, anthropometrically calibrated camera distance, and 3D garment scaling.
 */

import * as THREE from "three";
import { UserBodyMetrics, DEFAULT_BODY_METRICS } from "./anthropometrics";

export interface NormalizedLandmark {
  x: number;
  y: number;
  z: number;
  visibility?: number;
}

export interface PoseFrameData {
  landmarks: NormalizedLandmark[];
  worldLandmarks?: NormalizedLandmark[];
}

export interface ComputedPoseState {
  shouldersDetected: boolean;
  shoulderWidthNorm: number;
  shoulderWidthCm: number;
  shoulderMidpoint: { x: number; y: number };
  torsoCenter: { x: number; y: number };
  torsoHeightNorm: number;
  rollAngle: number;
  yawAngle: number;
  pitchAngle: number;
  depthMeters: number;
  confidence: number;
  position3D: THREE.Vector3;
  scale3D: THREE.Vector3;
  quaternion3D: THREE.Quaternion;
}

const POSE_LANDMARKS = {
  NOSE: 0,
  LEFT_SHOULDER: 11,
  RIGHT_SHOULDER: 12,
  LEFT_ELBOW: 13,
  RIGHT_ELBOW: 14,
  LEFT_WRIST: 15,
  RIGHT_WRIST: 16,
  LEFT_HIP: 23,
  RIGHT_HIP: 24,
};

const clamp = (v: number, min: number, max: number) =>
  Math.min(max, Math.max(min, v));

/**
 * High-performance 1-Euro style filter for landmark & transform smoothing
 */
export class LowPassFilter {
  private prevValue: number | null = null;
  private alpha: number;

  constructor(alpha: number = 0.35) {
    this.alpha = alpha;
  }

  filter(val: number): number {
    if (this.prevValue === null || Number.isNaN(this.prevValue)) {
      this.prevValue = val;
      return val;
    }
    const filtered = this.prevValue + this.alpha * (val - this.prevValue);
    this.prevValue = filtered;
    return filtered;
  }

  reset() {
    this.prevValue = null;
  }
}

export class VtoPoseEngine {
  private visibilityThreshold: number = 0.35;
  private positionLerp: number = 0.45;
  private rotationSlerp: number = 0.35;
  private scaleLerp: number = 0.3;

  public currentPosition = new THREE.Vector3();
  public currentScale = new THREE.Vector3(1, 1, 1);
  public currentQuaternion = new THREE.Quaternion();
  public hasState = false;

  private lostFrames = 0;
  private lostFrameThreshold = 18;

  // Anthropometrics Profile
  public bodyMetrics: UserBodyMetrics = DEFAULT_BODY_METRICS;

  // Custom sizing tuning
  public userFitScale: number = 1.0; // 0.88 = XS, 1.0 = M, 1.15 = XL

  // Yaw tuning
  public yawGain: number = 1.6;
  public maxYaw: number = 1.1; // ~63 degrees
  private smoothYaw = 0;
  private yawFilter = new LowPassFilter(0.25);
  private shoulderWidthFilter = new LowPassFilter(0.2);

  private _tmp = new THREE.Vector3();
  private _yawQuat = new THREE.Quaternion();
  private _rollQuat = new THREE.Quaternion();
  private _pitchQuat = new THREE.Quaternion();
  private _targetQuat = new THREE.Quaternion();

  public reset() {
    this.hasState = false;
    this.lostFrames = 0;
    this.smoothYaw = 0;
    this.yawFilter.reset();
    this.shoulderWidthFilter.reset();
  }

  public update(
    landmarks: NormalizedLandmark[] | undefined | null,
    worldLandmarks: NormalizedLandmark[] | undefined | null,
    camera: THREE.PerspectiveCamera,
    garmentGroup?: THREE.Object3D | null
  ): ComputedPoseState | null {
    if (!landmarks || landmarks.length < 25) {
      this.lostFrames++;
      if (garmentGroup) {
        garmentGroup.visible =
          this.lostFrames <= this.lostFrameThreshold && this.hasState;
      }
      return null;
    }

    const ls = landmarks[POSE_LANDMARKS.LEFT_SHOULDER];
    const rs = landmarks[POSE_LANDMARKS.RIGHT_SHOULDER];

    const lsVis = ls?.visibility ?? 1;
    const rsVis = rs?.visibility ?? 1;
    const shouldersVisible =
      ls && rs && lsVis > this.visibilityThreshold && rsVis > this.visibilityThreshold;

    if (!shouldersVisible) {
      this.lostFrames++;
      if (garmentGroup) {
        garmentGroup.visible =
          this.lostFrames <= this.lostFrameThreshold && this.hasState;
      }
      return null;
    }

    this.lostFrames = 0;
    if (garmentGroup) garmentGroup.visible = true;

    // 1. Shoulders in 2D normalized space [0..1]
    const shoulderMidX = (ls.x + rs.x) / 2;
    const shoulderMidY = (ls.y + rs.y) / 2;
    const rawShoulderW = Math.max(Math.hypot(ls.x - rs.x, ls.y - rs.y), 0.01);
    const shoulderW = this.shoulderWidthFilter.filter(rawShoulderW);

    // Dynamic calibrated shoulder span in cm based on user anthropometrics
    const shoulderWidthCm = Math.round(
      this.bodyMetrics.bideltoidCm || (shoulderW * 140)
    );

    // 2. Torso Center & Hips
    const lh = landmarks[POSE_LANDMARKS.LEFT_HIP];
    const rh = landmarks[POSE_LANDMARKS.RIGHT_HIP];
    const lhVis = lh?.visibility ?? 0;
    const rhVis = rh?.visibility ?? 0;
    const hipsVisible = lh && rh && lhVis > 0.25 && rhVis > 0.25;

    let torsoCenterY: number;
    let torsoHeightNorm: number;

    if (hipsVisible) {
      const hipMidY = (lh.y + rh.y) / 2;
      torsoHeightNorm = Math.max(hipMidY - shoulderMidY, 0.1);
      torsoCenterY = shoulderMidY + torsoHeightNorm * 0.45;
    } else {
      torsoHeightNorm = shoulderW * 1.35;
      torsoCenterY = shoulderMidY + shoulderW * 0.52;
    }

    // 3. Depth & 3D Position
    const vFOV = (camera.fov * Math.PI) / 180;
    const tanHalf = Math.tan(vFOV / 2);

    // ANTHROPOMETRIC DISTANCE CALCULATION:
    // Landmarks 11 and 12 measure biacromial diameter (bony shoulder span).
    // Using user's physical biacromial breadth in meters:
    const realBiacromialM = (this.bodyMetrics.biacromialCm || 41.5) / 100;
    const planeHeightAt1m = 2 * tanHalf;
    const planeWidthAt1m = planeHeightAt1m * camera.aspect;

    // Distance to camera where physical span matches observed screen span:
    const estimatedDistance = clamp(
      realBiacromialM / Math.max(shoulderW * planeWidthAt1m, 0.08),
      0.65,
      4.2
    );
    const depthZ = camera.position.z - estimatedDistance;

    // Projection dimensions at this specific depth
    const distToCam = Math.abs(depthZ - camera.position.z);
    const planeHeight = 2 * tanHalf * distToCam;
    const planeWidth = planeHeight * camera.aspect;

    // CRITICAL ALIGNMENT FIX:
    // The 3D garment model collar is anchored at local (0, 0, 0).
    // Therefore, the target Y MUST sit at the suprasternal notch / neck base line (shoulderMidY),
    // NOT down at torsoCenterY!
    const nose = landmarks[POSE_LANDMARKS.NOSE];
    const neckAnchorY =
      nose && (nose.visibility ?? 1) > 0.3
        ? shoulderMidY - (shoulderMidY - nose.y) * 0.15
        : shoulderMidY - Math.min(shoulderW * 0.03, 0.015);

    // Convert from normalized (0..1) coordinates to Three.js world coordinates
    const targetX = (shoulderMidX - 0.5) * planeWidth;
    const targetY = -(neckAnchorY - 0.5) * planeHeight;

    // Push slightly forward along Z to drape in front of the skeleton plane
    const targetZ = depthZ + 0.04;
    this._tmp.set(targetX, targetY, targetZ);

    // 4. Orientation: Roll, Yaw, Pitch
    // Roll: 2D angle of shoulder line
    const rollAngle = Math.atan2(ls.y - rs.y, ls.x - rs.x);

    // Yaw: from 3D world landmarks or 2D z-disparity
    let rawYaw = 0;
    if (worldLandmarks && worldLandmarks.length > 24) {
      const wls = worldLandmarks[POSE_LANDMARKS.LEFT_SHOULDER];
      const wrs = worldLandmarks[POSE_LANDMARKS.RIGHT_SHOULDER];
      if (wls && wrs) {
        rawYaw = Math.atan2(wls.z - wrs.z, Math.abs(wls.x - wrs.x) + 0.001) * this.yawGain;
      }
    } else {
      rawYaw = Math.atan2((ls.z - rs.z) * 1.5, shoulderW + 0.001) * this.yawGain;
    }
    rawYaw = clamp(rawYaw, -this.maxYaw, this.maxYaw);
    this.smoothYaw = this.yawFilter.filter(rawYaw);

    // Build combined quaternion: Yaw (around Y) * Roll (around Z)
    this._yawQuat.setFromAxisAngle(new THREE.Vector3(0, 1, 0), this.smoothYaw);
    this._rollQuat.setFromAxisAngle(new THREE.Vector3(0, 0, 1), rollAngle);
    this._targetQuat.copy(this._yawQuat).multiply(this._rollQuat);

    // 5. ANTHROPOMETRIC 3D GARMENT SCALING:
    // User's outer shoulder span (bideltoid breadth) is wider than joint distance:
    const deltoidRatio =
      this.bodyMetrics.bideltoidCm && this.bodyMetrics.biacromialCm
        ? this.bodyMetrics.bideltoidCm / this.bodyMetrics.biacromialCm
        : 1.16;

    // Target outer shoulder width in Three.js world units:
    const targetShoulderSpan3D = shoulderW * planeWidth * deltoidRatio;

    // Standard baseline garment shoulder span at 1.0 scale is ~0.48m
    const baseScaleX = (targetShoulderSpan3D / 0.48) * this.userFitScale;

    // Height scale: ensure garment reaches the waist/hip level accurately
    const targetTorsoHeight3D = torsoHeightNorm * planeHeight;
    const baseScaleY = (targetTorsoHeight3D / 0.65) * this.userFitScale;

    // Chest depth scale: volume scales with user's anthropometric chest depth
    const depthFactor = this.bodyMetrics.chestDepthCm
      ? clamp(this.bodyMetrics.chestDepthCm / 24, 0.88, 1.25)
      : 1.0;
    const baseScaleZ = baseScaleX * depthFactor;

    // Harmonized 3D scale vector
    const harmonizedScaleY = clamp(baseScaleY, baseScaleX * 0.90, baseScaleX * 1.20);
    const targetScaleVec = new THREE.Vector3(baseScaleX, harmonizedScaleY, baseScaleZ);

    // 6. Smoothing & Interpolation (One-Euro style filter for jitter-free tracking)
    if (!this.hasState) {
      this.currentPosition.copy(this._tmp);
      this.currentScale.copy(targetScaleVec);
      this.currentQuaternion.copy(this._targetQuat);
      this.hasState = true;
    } else {
      this.currentPosition.lerp(this._tmp, this.positionLerp);
      this.currentScale.lerp(targetScaleVec, this.scaleLerp);
      this.currentQuaternion.slerp(this._targetQuat, this.rotationSlerp);
    }

    if (garmentGroup) {
      garmentGroup.position.copy(this.currentPosition);
      garmentGroup.scale.copy(this.currentScale);
      garmentGroup.quaternion.copy(this.currentQuaternion);
    }

    const confidence = (lsVis + rsVis) / 2;

    return {
      shouldersDetected: true,
      shoulderWidthNorm: shoulderW,
      shoulderWidthCm,
      shoulderMidpoint: { x: shoulderMidX, y: shoulderMidY },
      torsoCenter: { x: shoulderMidX, y: torsoCenterY },
      torsoHeightNorm,
      rollAngle,
      yawAngle: this.smoothYaw,
      pitchAngle: 0,
      depthMeters: estimatedDistance,
      confidence,
      position3D: this.currentPosition.clone(),
      scale3D: this.currentScale.clone(),
      quaternion3D: this.currentQuaternion.clone(),
    };
  }
}
