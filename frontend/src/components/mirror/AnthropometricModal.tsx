/**
 * @fileoverview ASHENRITUAL Vesper Mirror — Anthropometric Fit Calibration Modal
 * @module AnthropometricModal.tsx
 *
 * Provides dual-scale (CM / FT+IN and KG / LBS) height and weight calibration
 * for high-accuracy 3D garment fitting and anatomical proportion calculation.
 * Designed with a broad, sleek, zero-scroll architectural landscape layout.
 */
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check } from "lucide-react";
import {
  UserBodyMetrics,
  computeAnthropometrics,
  ftInToCm,
  cmToFtIn,
  kgToLbs,
  lbsToKg,
} from "@/lib/vto/anthropometrics";
import { cn } from "@/lib/utils";

interface AnthropometricModalProps {
  isOpen: boolean;
  currentMetrics: UserBodyMetrics;
  onSave: (metrics: UserBodyMetrics) => void;
  onClose: () => void;
}

export function AnthropometricModal({
  isOpen,
  currentMetrics,
  onSave,
  onClose,
}: AnthropometricModalProps) {
  // Height state
  const [heightUnit, setHeightUnit] = useState<"cm" | "ft">(
    currentMetrics.heightUnit || "cm"
  );
  const [heightCm, setHeightCm] = useState<number>(currentMetrics.heightCm || 178);
  const [feet, setFeet] = useState<number>(currentMetrics.heightFeet || 5);
  const [inches, setInches] = useState<number>(currentMetrics.heightInches || 10);

  // Weight state
  const [weightUnit, setWeightUnit] = useState<"kg" | "lbs">(
    currentMetrics.weightUnit || "kg"
  );
  const [weightKg, setWeightKg] = useState<number>(currentMetrics.weightKg || 72);
  const [weightLbs, setWeightLbs] = useState<number>(currentMetrics.weightLbs || 158);

  // Synchronized active height & weight in metric
  const activeHeightCm = heightUnit === "cm" ? heightCm : ftInToCm(feet, inches);
  const activeWeightKg = weightUnit === "kg" ? weightKg : lbsToKg(weightLbs);

  // Live calculated anthropometrics
  const previewMetrics = computeAnthropometrics(
    activeHeightCm,
    activeWeightKg,
    heightUnit,
    weightUnit
  );

  const handleHeightUnitToggle = (unit: "cm" | "ft") => {
    if (unit === heightUnit) return;
    if (unit === "ft") {
      const { feet: f, inches: i } = cmToFtIn(heightCm);
      setFeet(f);
      setInches(i);
    } else {
      setHeightCm(ftInToCm(feet, inches));
    }
    setHeightUnit(unit);
  };

  const handleWeightUnitToggle = (unit: "kg" | "lbs") => {
    if (unit === weightUnit) return;
    if (unit === "lbs") {
      setWeightLbs(kgToLbs(weightKg));
    } else {
      setWeightKg(lbsToKg(weightLbs));
    }
    setWeightUnit(unit);
  };

  const handleSave = () => {
    onSave(previewMetrics);
    onClose();
  };

  const handleUseDefaults = () => {
    const defaults = computeAnthropometrics(178, 72, "cm", "kg");
    setHeightCm(178);
    setHeightUnit("cm");
    setWeightKg(72);
    setWeightUnit("kg");
    onSave(defaults);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-6 select-none font-sans">
          {/* Frosted Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/85 backdrop-blur-md"
          />

          {/* Dialog Container — Broader breadth, zero-scroll layout */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 w-full max-w-2xl lg:max-w-[760px] rounded-[24px] border border-white/10 bg-[#0A0A0C]/95 backdrop-blur-2xl p-5 sm:p-6 text-white shadow-[0_24px_80px_rgba(0,0,0,0.85)] max-h-[96vh] overflow-y-auto sm:overflow-visible"
          >
            {/* Header: Clean & Uncluttered */}
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="font-heading text-sm sm:text-base font-semibold uppercase tracking-[0.2em] text-[#FDFCFB]">
                  Calibrate Body Proportions
                </h2>
                <p className="mt-0.5 text-white/50 text-[11px] font-sans">
                  Precision anatomical metrics for 3D drape & virtual sizing.
                </p>
              </div>

              {/* Close Button */}
              <button
                onClick={onClose}
                className="w-7 h-7 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all ml-3 shrink-0"
                title="Close"
                aria-label="Close modal"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Form Controls — 2-Column Side-by-Side Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
              {/* 1. HEIGHT CARD */}
              <div className="p-3.5 rounded-xl border border-white/10 bg-white/[0.02] flex flex-col justify-between">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-heading text-[10px] uppercase tracking-[0.2em] text-white/70 font-medium">
                    Height
                  </span>
                  {/* Unit Toggle */}
                  <div className="flex items-center rounded-full border border-white/15 p-0.5 bg-black/50">
                    <button
                      type="button"
                      onClick={() => handleHeightUnitToggle("cm")}
                      className={cn(
                        "px-2.5 py-0.5 rounded-full font-mono text-[8.5px] uppercase font-bold transition-all",
                        heightUnit === "cm"
                          ? "bg-white text-black shadow-sm"
                          : "text-white/50 hover:text-white"
                      )}
                    >
                      CM
                    </button>
                    <button
                      type="button"
                      onClick={() => handleHeightUnitToggle("ft")}
                      className={cn(
                        "px-2.5 py-0.5 rounded-full font-mono text-[8.5px] uppercase font-bold transition-all",
                        heightUnit === "ft"
                          ? "bg-white text-black shadow-sm"
                          : "text-white/50 hover:text-white"
                      )}
                    >
                      FT / IN
                    </button>
                  </div>
                </div>

                {heightUnit === "cm" ? (
                  <div className="space-y-2">
                    <div className="flex items-baseline justify-between">
                      <div className="flex items-baseline">
                        <span className="font-mono text-2xl font-bold tracking-tight text-white">
                          {heightCm}
                        </span>
                        <span className="text-xs font-normal text-white/50 ml-1">cm</span>
                      </div>
                      <span className="font-mono text-[11px] text-white/40">
                        {cmToFtIn(heightCm).feet}&apos;{cmToFtIn(heightCm).inches}&quot;
                      </span>
                    </div>

                    <input
                      type="range"
                      min={135}
                      max={220}
                      step={1}
                      value={heightCm}
                      onChange={(e) => setHeightCm(Number(e.target.value))}
                      className="w-full h-1 bg-white/15 rounded-lg appearance-none cursor-pointer accent-white"
                    />

                    <div className="flex justify-between font-mono text-[8.5px] text-white/30">
                      <span>135 cm</span>
                      <span>220 cm</span>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="grid grid-cols-2 gap-2 pt-0.5">
                      <div>
                        <span className="block font-mono text-[8.5px] uppercase text-white/40 mb-1">
                          Feet
                        </span>
                        <select
                          value={feet}
                          onChange={(e) => setFeet(Number(e.target.value))}
                          className="w-full bg-black/60 border border-white/20 rounded-lg px-2.5 py-1 font-mono text-xs text-white focus:outline-none focus:border-white"
                        >
                          {[4, 5, 6, 7].map((f) => (
                            <option key={f} value={f} className="bg-[#111] text-white">
                              {f} ft
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <span className="block font-mono text-[8.5px] uppercase text-white/40 mb-1">
                          Inches
                        </span>
                        <select
                          value={inches}
                          onChange={(e) => setInches(Number(e.target.value))}
                          className="w-full bg-black/60 border border-white/20 rounded-lg px-2.5 py-1 font-mono text-xs text-white focus:outline-none focus:border-white"
                        >
                          {Array.from({ length: 12 }).map((_, i) => (
                            <option key={i} value={i} className="bg-[#111] text-white">
                              {i} in
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="text-right font-mono text-[9px] text-white/40">
                      Equivalent: {ftInToCm(feet, inches)} cm
                    </div>
                  </div>
                )}
              </div>

              {/* 2. WEIGHT CARD */}
              <div className="p-3.5 rounded-xl border border-white/10 bg-white/[0.02] flex flex-col justify-between">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-heading text-[10px] uppercase tracking-[0.2em] text-white/70 font-medium">
                    Weight
                  </span>
                  {/* Unit Toggle */}
                  <div className="flex items-center rounded-full border border-white/15 p-0.5 bg-black/50">
                    <button
                      type="button"
                      onClick={() => handleWeightUnitToggle("kg")}
                      className={cn(
                        "px-2.5 py-0.5 rounded-full font-mono text-[8.5px] uppercase font-bold transition-all",
                        weightUnit === "kg"
                          ? "bg-white text-black shadow-sm"
                          : "text-white/50 hover:text-white"
                      )}
                    >
                      KG
                    </button>
                    <button
                      type="button"
                      onClick={() => handleWeightUnitToggle("lbs")}
                      className={cn(
                        "px-2.5 py-0.5 rounded-full font-mono text-[8.5px] uppercase font-bold transition-all",
                        weightUnit === "lbs"
                          ? "bg-white text-black shadow-sm"
                          : "text-white/50 hover:text-white"
                      )}
                    >
                      LBS
                    </button>
                  </div>
                </div>

                {weightUnit === "kg" ? (
                  <div className="space-y-2">
                    <div className="flex items-baseline justify-between">
                      <div className="flex items-baseline">
                        <span className="font-mono text-2xl font-bold tracking-tight text-white">
                          {weightKg}
                        </span>
                        <span className="text-xs font-normal text-white/50 ml-1">kg</span>
                      </div>
                      <span className="font-mono text-[11px] text-white/40">
                        {kgToLbs(weightKg)} lbs
                      </span>
                    </div>

                    <input
                      type="range"
                      min={40}
                      max={150}
                      step={1}
                      value={weightKg}
                      onChange={(e) => setWeightKg(Number(e.target.value))}
                      className="w-full h-1 bg-white/15 rounded-lg appearance-none cursor-pointer accent-white"
                    />

                    <div className="flex justify-between font-mono text-[8.5px] text-white/30">
                      <span>40 kg</span>
                      <span>150 kg</span>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex items-baseline justify-between">
                      <div className="flex items-baseline">
                        <span className="font-mono text-2xl font-bold tracking-tight text-white">
                          {weightLbs}
                        </span>
                        <span className="text-xs font-normal text-white/50 ml-1">lbs</span>
                      </div>
                      <span className="font-mono text-[11px] text-white/40">
                        {lbsToKg(weightLbs)} kg
                      </span>
                    </div>

                    <input
                      type="range"
                      min={85}
                      max={330}
                      step={1}
                      value={weightLbs}
                      onChange={(e) => setWeightLbs(Number(e.target.value))}
                      className="w-full h-1 bg-white/15 rounded-lg appearance-none cursor-pointer accent-white"
                    />

                    <div className="flex justify-between font-mono text-[8.5px] text-white/30">
                      <span>85 lbs</span>
                      <span>330 lbs</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* 3. CALCULATED HUMAN FRAME PROPORTIONS (Sleek horizontal ribbon) */}
            <div className="mt-3.5 p-3 rounded-xl border border-white/10 bg-white/[0.02]">
              <div className="flex items-center justify-between mb-2">
                <span className="font-heading text-[9px] uppercase tracking-[0.25em] text-white/50">
                  Calculated Frame Proportions
                </span>
                <span className="px-2 py-0.5 rounded-full border border-white/20 bg-white/10 font-mono text-[9px] uppercase font-bold text-white tracking-wider">
                  Rec: Size {previewMetrics.recommendedSize}
                </span>
              </div>

              <div className="grid grid-cols-4 gap-2">
                <div className="px-2.5 py-1.5 rounded-lg bg-black/40 border border-white/5 text-center sm:text-left">
                  <span className="block font-mono text-[7.5px] uppercase tracking-wider text-white/40 truncate">
                    Shoulder Span
                  </span>
                  <span className="font-mono text-xs sm:text-sm font-bold text-white">
                    {Math.round(previewMetrics.bideltoidCm)} cm
                  </span>
                </div>

                <div className="px-2.5 py-1.5 rounded-lg bg-black/40 border border-white/5 text-center sm:text-left">
                  <span className="block font-mono text-[7.5px] uppercase tracking-wider text-white/40 truncate">
                    Chest Girth
                  </span>
                  <span className="font-mono text-xs sm:text-sm font-bold text-white">
                    {Math.round(previewMetrics.chestCircumferenceCm)} cm
                  </span>
                </div>

                <div className="px-2.5 py-1.5 rounded-lg bg-black/40 border border-white/5 text-center sm:text-left">
                  <span className="block font-mono text-[7.5px] uppercase tracking-wider text-white/40 truncate">
                    Torso Drop
                  </span>
                  <span className="font-mono text-xs sm:text-sm font-bold text-white">
                    {Math.round(previewMetrics.torsoLengthCm)} cm
                  </span>
                </div>

                <div className="px-2.5 py-1.5 rounded-lg bg-black/40 border border-white/5 text-center sm:text-left">
                  <span className="block font-mono text-[7.5px] uppercase tracking-wider text-white/40 truncate">
                    BMI Index
                  </span>
                  <span className="font-mono text-xs sm:text-sm font-bold text-white">
                    {previewMetrics.bmi}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Row: Sleek & Compact */}
            <div className="mt-4 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={handleUseDefaults}
                className="font-heading text-[9px] uppercase tracking-[0.2em] text-white/40 hover:text-white transition-colors"
              >
                Reset Defaults
              </button>

              <button
                type="button"
                onClick={handleSave}
                className="h-9 px-6 rounded-full bg-white text-black font-heading text-[10px] font-bold uppercase tracking-[0.22em] hover:bg-[#E8E8E8] transition-all flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(255,255,255,0.15)]"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Apply Fit Calibration</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
