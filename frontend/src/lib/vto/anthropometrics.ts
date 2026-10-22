/**
 * @fileoverview ASHENRITUAL Vesper Mirror — Anthropometric Profiling Engine
 * @module anthropometrics.ts
 *
 * Implements scientific body proportion modeling based on ANSUR II & ISO 8559
 * anthropometric datasets to estimate biacromial diameter, bideltoid shoulder span,
 * chest circumference, torso length, and optimal garment fit.
 */

export interface UserBodyMetrics {
  heightCm: number;
  weightKg: number;
  heightUnit: "cm" | "ft";
  weightUnit: "kg" | "lbs";
  heightFeet: number;
  heightInches: number;
  weightLbs: number;
  bmi: number;
  biacromialCm: number; // Landmark 11-12 bony shoulder distance
  bideltoidCm: number;  // Full shoulder width across deltoids (outer garment fit)
  chestCircumferenceCm: number;
  chestDepthCm: number;
  torsoLengthCm: number;
  recommendedSize: "XS" | "S" | "M" | "L" | "XL";
}

const STORAGE_KEY = "ashen_mirror_user_profile";

/**
 * Converts feet & inches to centimeters
 */
export function ftInToCm(feet: number, inches: number): number {
  return Math.round((feet * 12 + inches) * 2.54);
}

/**
 * Converts centimeters to feet & inches
 */
export function cmToFtIn(cm: number): { feet: number; inches: number } {
  const totalInches = cm / 2.54;
  const feet = Math.floor(totalInches / 12);
  const inches = Math.round(totalInches % 12);
  return { feet, inches };
}

/**
 * Converts kilograms to pounds
 */
export function kgToLbs(kg: number): number {
  return Math.round(kg * 2.20462);
}

/**
 * Converts pounds to kilograms
 */
export function lbsToKg(lbs: number): number {
  return Math.round(lbs / 2.20462);
}

/**
 * Compute anthropometric metrics from height (cm) and weight (kg)
 * Derived from ANSUR II regression equations
 */
export function computeAnthropometrics(
  heightCm: number,
  weightKg: number,
  heightUnit: "cm" | "ft" = "cm",
  weightUnit: "kg" | "lbs" = "kg"
): UserBodyMetrics {
  const safeH = Math.max(120, Math.min(230, heightCm));
  const safeW = Math.max(35, Math.min(180, weightKg));

  const hMeters = safeH / 100;
  const bmi = Number((safeW / (hMeters * hMeters)).toFixed(1));

  // Biacromial breadth (bony skeletal distance between acromion processes, landmarks 11 & 12)
  const biacromialCm = Number((0.14 * safeH + 0.12 * safeW + 8.5).toFixed(1));

  // Bideltoid breadth (full outer shoulder span across deltoid muscles)
  const bideltoidCm = Number((0.16 * safeH + 0.22 * safeW + 4.5).toFixed(1));

  // Chest circumference in cm
  const chestCircumferenceCm = Number((0.28 * safeH + 0.65 * safeW + 5.0).toFixed(1));

  // Torso depth (anterior-posterior thickness)
  const chestDepthCm = Number(((chestCircumferenceCm / Math.PI) * 0.72).toFixed(1));

  // Torso length (cervicale to waistline ~ 35.5% of stature)
  const torsoLengthCm = Number((0.355 * safeH).toFixed(1));

  // Recommended sizing based on chest & shoulder span
  let recommendedSize: "XS" | "S" | "M" | "L" | "XL" = "M";
  if (chestCircumferenceCm < 89) {
    recommendedSize = "XS";
  } else if (chestCircumferenceCm < 97) {
    recommendedSize = "S";
  } else if (chestCircumferenceCm < 105) {
    recommendedSize = "M";
  } else if (chestCircumferenceCm < 113) {
    recommendedSize = "L";
  } else {
    recommendedSize = "XL";
  }

  const { feet, inches } = cmToFtIn(safeH);
  const weightLbs = kgToLbs(safeW);

  return {
    heightCm: safeH,
    weightKg: safeW,
    heightUnit,
    weightUnit,
    heightFeet: feet,
    heightInches: inches,
    weightLbs,
    bmi,
    biacromialCm,
    bideltoidCm,
    chestCircumferenceCm,
    chestDepthCm,
    torsoLengthCm,
    recommendedSize,
  };
}

/**
 * Default standard body proportions (178 cm, 72 kg, Size M)
 */
export const DEFAULT_BODY_METRICS: UserBodyMetrics = computeAnthropometrics(178, 72);

/**
 * Load user body profile from localStorage
 */
export function loadUserBodyProfile(): { metrics: UserBodyMetrics; hasStoredProfile: boolean } {
  if (typeof window === "undefined") {
    return { metrics: DEFAULT_BODY_METRICS, hasStoredProfile: false };
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { metrics: DEFAULT_BODY_METRICS, hasStoredProfile: false };
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed.heightCm === "number" && typeof parsed.weightKg === "number") {
      const metrics = computeAnthropometrics(
        parsed.heightCm,
        parsed.weightKg,
        parsed.heightUnit || "cm",
        parsed.weightUnit || "kg"
      );
      return { metrics, hasStoredProfile: true };
    }
  } catch (err) {
    console.warn("Vesper Mirror: Could not parse stored body profile", err);
  }
  return { metrics: DEFAULT_BODY_METRICS, hasStoredProfile: false };
}

/**
 * Save user body profile to localStorage
 */
export function saveUserBodyProfile(metrics: UserBodyMetrics): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        heightCm: metrics.heightCm,
        weightKg: metrics.weightKg,
        heightUnit: metrics.heightUnit,
        weightUnit: metrics.weightUnit,
      })
    );
  } catch (err) {
    console.warn("Vesper Mirror: Could not persist body profile", err);
  }
}
