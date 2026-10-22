/**
 * @fileoverview ASHENRITUAL Vesper — White Mask Silhouette Engine
 * @module WhiteSilhouetteRenderer.ts
 *
 * Implements a pure monochrome, high-fashion architectural white mask silhouette.
 * Strictly NO color — renders crisp white outlines, frosted translucent masks,
 * and architectural seam details anchored to real-time human body landmarks.
 */

import { ComputedPoseState } from "./PoseEngine";

export type GarmentCutCategory = "jackets" | "shirts" | "tshirts" | "suits";

export interface SilhouetteRenderOptions {
  fitScale?: number;
  showSeams?: boolean;
  opacity?: number;
  verticalLiftRatio?: number;
}

/**
 * Renders an architectural white mask garment silhouette fitted to detected body landmarks.
 */
export function drawWhiteGarmentSilhouette(
  canvas: HTMLCanvasElement,
  pose: ComputedPoseState,
  category: GarmentCutCategory,
  _garmentId: string,
  options: SilhouetteRenderOptions = {}
): void {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const w = canvas.width;
  const h = canvas.height;

  // Clear previous frame
  ctx.clearRect(0, 0, w, h);

  if (!pose.shouldersDetected) return;

  const fitScale = options.fitScale ?? 1.0;
  const showSeams = options.showSeams ?? true;
  const baseOpacity = options.opacity ?? 1.0;

  // Midpoint between shoulders (neck base) in canvas pixels
  const neckX = pose.shoulderMidpoint.x * w;
  const neckY = pose.shoulderMidpoint.y * h;

  // Euclidean shoulder span in pixels
  const span = Math.max(pose.shoulderWidthNorm * w, 40);

  // Roll angle (tilt between shoulders) normalized to human upright posture [-pi/2, pi/2]
  let rollAngle = pose.rollAngle;
  while (rollAngle > Math.PI / 2) rollAngle -= Math.PI;
  while (rollAngle < -Math.PI / 2) rollAngle += Math.PI;

  // Proportions relative to span
  const halfSpan = (span / 2) * fitScale;

  // Tailored dimensions per category
  let torsoLen: number;
  let sleeveLen: number;
  let collarDrop: number;
  let waistSuppress: number;

  switch (category) {
    case "jackets": // Outerwear / Biker / Bomber / Shell
      torsoLen = span * 1.55 * fitScale;
      sleeveLen = span * 1.25 * fitScale;
      collarDrop = span * 0.16;
      waistSuppress = halfSpan * 0.88;
      break;

    case "suits": // Heavy structured overcoats & tailored suits
      torsoLen = span * 2.1 * fitScale;
      sleeveLen = span * 1.35 * fitScale;
      collarDrop = span * 0.24;
      waistSuppress = halfSpan * 0.84;
      break;

    case "tshirts": // Void boxy T-shirts
      torsoLen = span * 1.4 * fitScale;
      sleeveLen = span * 0.55 * fitScale; // Short sleeves
      collarDrop = span * 0.12;
      waistSuppress = halfSpan * 0.95; // Boxy straight cut
      break;

    case "shirts": // Tailored button-down shirts
    default:
      torsoLen = span * 1.5 * fitScale;
      sleeveLen = span * 1.25 * fitScale;
      collarDrop = span * 0.15;
      waistSuppress = halfSpan * 0.86;
      break;
  }

  ctx.save();
  ctx.globalAlpha = baseOpacity;

  // Proportional vertical lift to position garment naturally at the collar & shoulder crest
  // above the raw acromion detection joint pipe
  const verticalLiftRatio = options.verticalLiftRatio ?? 0.12;
  const verticalLift = span * verticalLiftRatio;

  // Transform to neck base origin, rotate with shoulders, and lift upward along the body axis
  ctx.translate(neckX, neckY);
  ctx.rotate(-rollAngle);
  ctx.translate(0, -verticalLift);

  // ─── 1. BUILD ARCHITECTURAL SILHOUETTE PATH ──────────────────────────────
  ctx.beginPath();

  // Neck notch center
  ctx.moveTo(0, collarDrop * 0.2);

  // Left neck curve to left shoulder pad
  ctx.quadraticCurveTo(
    -halfSpan * 0.35,
    -collarDrop * 0.3,
    -halfSpan * 1.08,
    0
  );

  // Left shoulder extension / cap
  ctx.lineTo(-halfSpan * 1.22, span * 0.12);

  // Left sleeve outer edge
  ctx.lineTo(-halfSpan * 1.32, sleeveLen);

  // Left sleeve cuff
  ctx.lineTo(-halfSpan * 0.98, sleeveLen);

  // Left armpit / underarm notch
  ctx.lineTo(-halfSpan * 0.88, span * 0.42);

  // Left waist curve
  ctx.quadraticCurveTo(
    -waistSuppress,
    torsoLen * 0.55,
    -halfSpan * 0.96,
    torsoLen
  );

  // Hemline across bottom to right hip
  ctx.quadraticCurveTo(0, torsoLen + span * 0.05, halfSpan * 0.96, torsoLen);

  // Right waist curve
  ctx.quadraticCurveTo(
    waistSuppress,
    torsoLen * 0.55,
    halfSpan * 0.88,
    span * 0.42
  );

  // Right armpit to right sleeve cuff
  ctx.lineTo(halfSpan * 0.98, sleeveLen);

  // Right sleeve outer edge
  ctx.lineTo(halfSpan * 1.32, sleeveLen);

  // Right shoulder extension / cap
  ctx.lineTo(halfSpan * 1.22, span * 0.12);

  // Right shoulder pad back to right neck
  ctx.lineTo(halfSpan * 1.08, 0);

  // Right neck curve back to center notch
  ctx.quadraticCurveTo(
    halfSpan * 0.35,
    -collarDrop * 0.3,
    0,
    collarDrop * 0.2
  );

  ctx.closePath();

  // ─── 2. RENDER WHITE MASK (STRICTLY MONOCHROME NO COLOR) ─────────────────
  // Translucent white frosted silhouette fill
  ctx.fillStyle = "rgba(255, 255, 255, 0.12)";
  ctx.fill();

  // Crisp white architectural outline
  ctx.shadowColor = "rgba(255, 255, 255, 0.45)";
  ctx.shadowBlur = 12;
  ctx.strokeStyle = "#FFFFFF";
  ctx.lineWidth = 2.0;
  ctx.lineJoin = "round";
  ctx.stroke();

  // Clear shadow before drawing internal seams
  ctx.shadowBlur = 0;

  // ─── 3. INTERNAL ARCHITECTURAL SEAMS & DETAILS ───────────────────────────
  if (showSeams) {
    ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
    ctx.lineWidth = 1.2;

    // A. Center placket / zip line
    ctx.beginPath();
    ctx.moveTo(0, collarDrop * 0.4);
    ctx.lineTo(0, torsoLen);
    ctx.stroke();

    // B. Category-Specific Architectural Lines
    if (category === "jackets") {
      // Asymmetric biker / bomber collar fold
      ctx.beginPath();
      ctx.moveTo(-halfSpan * 0.45, -collarDrop * 0.2);
      ctx.lineTo(-halfSpan * 0.15, collarDrop * 0.8);
      ctx.lineTo(0, collarDrop * 0.4);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(halfSpan * 0.45, -collarDrop * 0.2);
      ctx.lineTo(halfSpan * 0.15, collarDrop * 0.8);
      ctx.lineTo(0, collarDrop * 0.4);
      ctx.stroke();

      // Slanted chest zip pocket
      ctx.beginPath();
      ctx.moveTo(-halfSpan * 0.65, span * 0.35);
      ctx.lineTo(-halfSpan * 0.2, span * 0.3);
      ctx.stroke();
    } else if (category === "suits") {
      // Peak lapels & V-gorge
      ctx.beginPath();
      ctx.moveTo(-halfSpan * 0.4, -collarDrop * 0.1);
      ctx.lineTo(-halfSpan * 0.55, collarDrop * 0.6);
      ctx.lineTo(0, torsoLen * 0.45);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(halfSpan * 0.4, -collarDrop * 0.1);
      ctx.lineTo(halfSpan * 0.55, collarDrop * 0.6);
      ctx.lineTo(0, torsoLen * 0.45);
      ctx.stroke();

      // Dual welt pocket slits
      ctx.beginPath();
      ctx.moveTo(-halfSpan * 0.75, torsoLen * 0.68);
      ctx.lineTo(-halfSpan * 0.35, torsoLen * 0.68);
      ctx.moveTo(halfSpan * 0.35, torsoLen * 0.68);
      ctx.lineTo(halfSpan * 0.75, torsoLen * 0.68);
      ctx.stroke();
    } else if (category === "tshirts") {
      // Clean crew neckline ellipse
      ctx.beginPath();
      ctx.ellipse(0, collarDrop * 0.3, halfSpan * 0.35, collarDrop * 0.45, 0, 0, Math.PI);
      ctx.stroke();

      // Short sleeve drop seams
      ctx.beginPath();
      ctx.moveTo(-halfSpan * 1.05, 0);
      ctx.lineTo(-halfSpan * 0.88, span * 0.42);
      ctx.moveTo(halfSpan * 1.05, 0);
      ctx.lineTo(halfSpan * 0.88, span * 0.42);
      ctx.stroke();
    } else if (category === "shirts") {
      // Pointed architectural collar tabs
      ctx.beginPath();
      ctx.moveTo(-halfSpan * 0.32, -collarDrop * 0.25);
      ctx.lineTo(-halfSpan * 0.22, collarDrop * 0.5);
      ctx.lineTo(0, collarDrop * 0.25);
      ctx.lineTo(halfSpan * 0.22, collarDrop * 0.5);
      ctx.lineTo(halfSpan * 0.32, -collarDrop * 0.25);
      ctx.stroke();

      // Button marks
      const btnSteps = 4;
      for (let i = 1; i <= btnSteps; i++) {
        const y = collarDrop + (i * (torsoLen - collarDrop)) / (btnSteps + 1);
        ctx.beginPath();
        ctx.arc(0, y, 2, 0, 2 * Math.PI);
        ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
        ctx.fill();
      }
    }

    // C. Architectural Hem & Shoulder Seams
    ctx.beginPath();
    ctx.moveTo(-halfSpan * 0.3, -collarDrop * 0.15);
    ctx.lineTo(-halfSpan * 1.08, 0);
    ctx.moveTo(halfSpan * 0.3, -collarDrop * 0.15);
    ctx.lineTo(halfSpan * 1.08, 0);
    ctx.stroke();

    // D. Dashed hemline finish
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(-halfSpan * 0.9, torsoLen - 8);
    ctx.lineTo(halfSpan * 0.9, torsoLen - 8);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  ctx.restore();
}

/**
 * Renders an architectural white body silhouette mask for size measurement and calibration.
 * Strictly NO color — renders crisp white calipers, head oval, shoulder span, and chest guidelines.
 */
export function drawWhiteBodySilhouette(
  canvas: HTMLCanvasElement,
  landmarks: { x: number; y: number; visibility?: number }[],
  shoulderWidthCm: number,
  isLocked: boolean
): void {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const w = canvas.width;
  const h = canvas.height;

  ctx.clearRect(0, 0, w, h);

  const ls = landmarks[11];
  const rs = landmarks[12];
  const nose = landmarks[0];

  if (!ls || !rs) return;

  const lsX = ls.x * w;
  const lsY = ls.y * h;
  const rsX = rs.x * w;
  const rsY = rs.y * h;

  const midX = (lsX + rsX) / 2;
  const midY = (lsY + rsY) / 2;
  const span = Math.hypot(rsX - lsX, rsY - lsY);

  ctx.save();

  // 1. Head Contour (White Silhouette Oval)
  if (nose) {
    const headRadiusX = span * 0.22;
    const headRadiusY = span * 0.3;
    const headY = nose.y * h;

    ctx.beginPath();
    ctx.ellipse(nose.x * w, headY, headRadiusX, headRadiusY, 0, 0, 2 * Math.PI);
    ctx.fillStyle = "rgba(255, 255, 255, 0.08)";
    ctx.fill();
    ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
    ctx.lineWidth = 1.2;
    ctx.setLineDash([3, 3]);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  // 2. Torso Silhouette Mask
  const torsoH = span * 1.6;
  ctx.beginPath();
  ctx.moveTo(lsX, lsY);
  ctx.quadraticCurveTo(midX, midY - span * 0.1, rsX, rsY);
  ctx.lineTo(rsX + span * 0.08, midY + torsoH);
  ctx.lineTo(lsX - span * 0.08, midY + torsoH);
  ctx.closePath();

  ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
  ctx.fill();
  ctx.strokeStyle = "rgba(255, 255, 255, 0.5)";
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // 3. Shoulder Span Caliper Line (Pure White with End Crosshairs)
  ctx.beginPath();
  ctx.moveTo(lsX, lsY);
  ctx.lineTo(rsX, rsY);
  ctx.strokeStyle = "#FFFFFF";
  ctx.lineWidth = 2.0;
  ctx.stroke();

  // Left Crosshair
  ctx.beginPath();
  ctx.arc(lsX, lsY, 4, 0, 2 * Math.PI);
  ctx.fillStyle = "#FFFFFF";
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(lsX, lsY - 10);
  ctx.lineTo(lsX, lsY + 10);
  ctx.stroke();

  // Right Crosshair
  ctx.beginPath();
  ctx.arc(rsX, rsY, 4, 0, 2 * Math.PI);
  ctx.fillStyle = "#FFFFFF";
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(rsX, rsY - 10);
  ctx.lineTo(rsX, rsY + 10);
  ctx.stroke();

  // 4. Center Alignment Vertical Axis (Pure White Dash)
  ctx.strokeStyle = "rgba(255, 255, 255, 0.35)";
  ctx.setLineDash([4, 6]);
  ctx.lineWidth = 1.0;
  ctx.beginPath();
  ctx.moveTo(midX, midY - span * 0.6);
  ctx.lineTo(midX, midY + torsoH + span * 0.2);
  ctx.stroke();
  ctx.setLineDash([]);

  // 5. White Caliper Measurement Pill
  const labelY = midY - 20;
  const labelText = `${shoulderWidthCm} CM SPAN`;
  ctx.font = "600 10px monospace";
  const textWidth = ctx.measureText(labelText).width;
  const padX = 10;
  const padY = 5;

  ctx.fillStyle = "#0A0A0A";
  ctx.strokeStyle = "#FFFFFF";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.roundRect(
    midX - textWidth / 2 - padX,
    labelY - 12 - padY,
    textWidth + padX * 2,
    18 + padY,
    8
  );
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = "#FFFFFF";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(labelText, midX, labelY - 2);

  if (isLocked) {
    ctx.strokeStyle = "rgba(255, 255, 255, 0.9)";
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.arc(midX, midY, 6, 0, 2 * Math.PI);
    ctx.stroke();
  }

  ctx.restore();
}
