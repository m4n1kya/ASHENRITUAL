/**
 * @fileoverview ASHENRITUAL Vesper Mirror — Pose Estimation & Tracking Engine
 * @module PoseEngine.ts
 */

import * as THREE from "three";

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

  // Custom tuning
  public userFitScale: number = 1.0; // 0.9 = snug, 1.0 = regular, 1.15 = relaxed
  public torsoDropFactor: number = 0.95; // distance from shoulders to garment center

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

    // Estimate shoulder width in cm (approx 45cm nominal human shoulder)
    const shoulderWidthCm = Math.round(shoulderW * 140);

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
      // Torso center is roughly 38% down from shoulders towards hips
      torsoCenterY = shoulderMidY + torsoHeightNorm * 0.42 * this.torsoDropFactor;
    } else {
      torsoHeightNorm = shoulderW * 1.35;
      torsoCenterY = shoulderMidY + shoulderW * 0.48 * this.torsoDropFactor;
    }

    // 3. Depth & 3D Position
    const vFOV = (camera.fov * Math.PI) / 180;
    const tanHalf = Math.tan(vFOV / 2);

    // Calibrated human upper-body scale: at 2.0m distance, shoulder width is ~0.24 normalized
    const nominalShoulderWidth = 0.24;
    const baseDistance = 2.0;
    const estimatedDistance = clamp(
      (nominalShoulderWidth / Math.max(shoulderW, 0.05)) * baseDistance,
      0.8,
      4.5
    );
    const depthZ = camera.position.z - estimatedDistance;

    // Project (shoulderMidX, torsoCenterY) at depthZ
    const distToCam = Math.abs(depthZ - camera.position.z);
    const planeHeight = 2 * tanHalf * distToCam;
    const planeWidth = planeHeight * camera.aspect;

    // Normalized coordinates (0..1) to scene coordinates centered at (0,0)
    // Anchored at shoulders/collar line for accurate 3D garment drape
    const targetX = (shoulderMidX - 0.5) * planeWidth;
    const targetY = -(shoulderMidY - 0.5) * planeHeight + (planeHeight * 0.03);
    this._tmp.set(targetX, targetY, depthZ);

    // 4. Orientation: Roll, Yaw, Pitch
    // Roll: 2D angle of shoulder line from screen-left to screen-right (dx > 0 so roll is centered at 0 rad)
    const rollAngle = Math.atan2(ls.y - rs.y, ls.x - rs.x);

    // Yaw: from 3D world landmarks or 2D z-disparity
    let rawYaw = 0;
    if (worldLandmarks && worldLandmarks.length > 24) {
      const wls = worldLandmarks[POSE_LANDMARKS.LEFT_SHOULDER];
      const wrs = worldLandmarks[POSE_LANDMARKS.RIGHT_SHOULDER];
      if (wls && wrs) {
        // In metric world coordinates, Z is depth relative to hips
        rawYaw = Math.atan2(wls.z - wrs.z, Math.abs(wls.x - wrs.x) + 0.001) * this.yawGain;
      }
    } else {
      // Fallback: estimate from normalized landmarks Z
      rawYaw = Math.atan2((ls.z - rs.z) * 1.5, shoulderW + 0.001) * this.yawGain;
    }
    rawYaw = clamp(rawYaw, -this.maxYaw, this.maxYaw);
    this.smoothYaw = this.yawFilter.filter(rawYaw);

    // Build combined quaternion: Yaw (around Y) * Roll (around Z)
    this._yawQuat.setFromAxisAngle(new THREE.Vector3(0, 1, 0), this.smoothYaw);
    this._rollQuat.setFromAxisAngle(new THREE.Vector3(0, 0, 1), rollAngle);
    this._targetQuat.copy(this._yawQuat).multiply(this._rollQuat);

    // 5. Garment Scale
    // Scale proportional to shoulder width and distance so garment matches human proportions
    const baseGarmentScale = (shoulderW / nominalShoulderWidth) * 1.05 * this.userFitScale;

    // 6. Smoothing & Interpolation
    if (!this.hasState) {
      this.currentPosition.copy(this._tmp);
      this.currentScale.setScalar(baseGarmentScale);
      this.currentQuaternion.copy(this._targetQuat);
      this.hasState = true;
    } else {
      this.currentPosition.lerp(this._tmp, this.positionLerp);
      this.currentScale.lerp(
        new THREE.Vector3().setScalar(baseGarmentScale),
        this.scaleLerp
      );
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
