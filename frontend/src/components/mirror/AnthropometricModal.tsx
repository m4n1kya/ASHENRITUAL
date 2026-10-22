/**
 * @fileoverview ASHENRITUAL Vesper Mirror — Anthropometric Fit Calibration Modal
 * @module AnthropometricModal.tsx
 *
 * Provides dual-scale (CM / FT+IN and KG / LBS) height and weight calibration
 * for high-accuracy 3D garment fitting and anatomical proportion calculation.
 */
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sliders, Check, Sparkles } from "lucide-react";
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
    onSave(defaults);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-6 select-none font-sans">
          {/* Frosted Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/85 backdrop-blur-2xl"
          />

          {/* Dialog Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 16 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 w-full max-w-xl max-h-[92vh] overflow-y-auto rounded-[28px] border border-white/15 bg-[#0C0C0E]/95 backdrop-blur-3xl p-6 sm:p-8 text-white shadow-[0_0_60px_rgba(0,0,0,0.85)] scrollbar-thin"
          >
            {/* Top Close Button */}
            <button
              onClick={onClose}
              className="absolute top-5 right-5 w-8 h-8 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-white/60 hover:text-white hover:border-white/30 transition-all"
              title="Close"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 rounded-lg border border-white/20 bg-white/5 flex items-center justify-center text-white">
                  <Sliders className="w-3.5 h-3.5" />
                </div>
                <span className="font-heading text-[10px] uppercase tracking-[0.3em] text-white/50">
                  Precision Fitting Calibration
                </span>
              </div>
              <h2 className="font-heading text-lg sm:text-xl uppercase tracking-wider text-white font-medium">
                Calibrate Body Proportions
              </h2>
              <p className="mt-1 text-white/60 text-xs font-sans leading-relaxed">
                To increase accuracy, enter your height and weight. Our ergonomic engine calculates your exact shoulder span, chest volume, and 3D architectural drape.
              </p>
            </div>

            {/* Form Controls */}
            <div className="space-y-6">
              {/* 1. HEIGHT SECTION */}
              <div className="p-4 rounded-2xl border border-white/10 bg-white/[0.02]">
                <div className="flex items-center justify-between mb-3">
                  <label className="font-heading text-[11px] uppercase tracking-[0.2em] text-white/80 font-medium">
                    Height
                  </label>
                  {/* Unit Toggle */}
                  <div className="flex items-center rounded-full border border-white/15 p-0.5 bg-black/40">
                    <button
                      type="button"
                      onClick={() => handleHeightUnitToggle("cm")}
                      className={cn(
                        "px-3 py-1 rounded-full font-mono text-[9px] uppercase font-bold transition-all",
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
                        "px-3 py-1 rounded-full font-mono text-[9px] uppercase font-bold transition-all",
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
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-2xl font-bold tracking-tight text-white">
                        {heightCm}{" "}
                        <span className="text-xs font-normal text-white/50">cm</span>
                      </span>
                      <span className="font-mono text-[11px] text-white/40">
                        ({cmToFtIn(heightCm).feet}&apos;{cmToFtIn(heightCm).inches}&quot;)
                      </span>
                    </div>
                    <input
                      type="range"
                      min={135}
                      max={220}
                      step={1}
                      value={heightCm}
                      onChange={(e) => setHeightCm(Number(e.target.value))}
                      className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-white"
                    />
                    <div className="flex justify-between font-mono text-[9px] text-white/30">
                      <span>135 cm (4&apos;5&quot;)</span>
                      <span>178 cm (5&apos;10&quot;)</span>
                      <span>220 cm (7&apos;3&quot;)</span>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <div>
                      <span className="block font-mono text-[9px] uppercase text-white/50 mb-1">
                        Feet
                      </span>
                      <select
                        value={feet}
                        onChange={(e) => setFeet(Number(e.target.value))}
                        className="w-full bg-black/60 border border-white/20 rounded-xl px-3 py-2 font-mono text-sm text-white focus:outline-none focus:border-white"
                      >
                        {[4, 5, 6, 7].map((f) => (
                          <option key={f} value={f} className="bg-[#111] text-white">
                            {f} ft
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <span className="block font-mono text-[9px] uppercase text-white/50 mb-1">
                        Inches
                      </span>
                      <select
                        value={inches}
                        onChange={(e) => setInches(Number(e.target.value))}
                        className="w-full bg-black/60 border border-white/20 rounded-xl px-3 py-2 font-mono text-sm text-white focus:outline-none focus:border-white"
                      >
                        {Array.from({ length: 12 }).map((_, i) => (
                          <option key={i} value={i} className="bg-[#111] text-white">
                            {i} in
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="col-span-2 text-right font-mono text-[10px] text-white/40">
                      Equivalent: {ftInToCm(feet, inches)} cm
                    </div>
                  </div>
                )}
              </div>

              {/* 2. WEIGHT SECTION */}
              <div className="p-4 rounded-2xl border border-white/10 bg-white/[0.02]">
                <div className="flex items-center justify-between mb-3">
                  <label className="font-heading text-[11px] uppercase tracking-[0.2em] text-white/80 font-medium">
                    Weight
                  </label>
                  {/* Unit Toggle */}
                  <div className="flex items-center rounded-full border border-white/15 p-0.5 bg-black/40">
                    <button
                      type="button"
                      onClick={() => handleWeightUnitToggle("kg")}
                      className={cn(
                        "px-3 py-1 rounded-full font-mono text-[9px] uppercase font-bold transition-all",
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
                        "px-3 py-1 rounded-full font-mono text-[9px] uppercase font-bold transition-all",
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
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-2xl font-bold tracking-tight text-white">
                        {weightKg}{" "}
                        <span className="text-xs font-normal text-white/50">kg</span>
                      </span>
                      <span className="font-mono text-[11px] text-white/40">
                        ({kgToLbs(weightKg)} lbs)
                      </span>
                    </div>
                    <input
                      type="range"
                      min={40}
                      max={150}
                      step={1}
                      value={weightKg}
                      onChange={(e) => setWeightKg(Number(e.target.value))}
                      className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-white"
                    />
                    <div className="flex justify-between font-mono text-[9px] text-white/30">
                      <span>40 kg (88 lbs)</span>
                      <span>72 kg (158 lbs)</span>
                      <span>150 kg (330 lbs)</span>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-2xl font-bold tracking-tight text-white">
                        {weightLbs}{" "}
                        <span className="text-xs font-normal text-white/50">lbs</span>
                      </span>
                      <span className="font-mono text-[11px] text-white/40">
                        ({lbsToKg(weightLbs)} kg)
                      </span>
                    </div>
                    <input
                      type="range"
                      min={85}
                      max={330}
                      step={1}
                      value={weightLbs}
                      onChange={(e) => setWeightLbs(Number(e.target.value))}
                      className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-white"
                    />
                    <div className="flex justify-between font-mono text-[9px] text-white/30">
                      <span>85 lbs (38 kg)</span>
                      <span>160 lbs (72 kg)</span>
                      <span>330 lbs (150 kg)</span>
                    </div>
                  </div>
                )}
              </div>

              {/* 3. REAL-TIME ANTHROPOMETRIC SIZING PREVIEW */}
              <div className="p-4 rounded-2xl border border-white/20 bg-white/[0.04]">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-white/70" />
                    <span className="font-heading text-[10px] uppercase tracking-widest text-white/70 font-medium">
                      Calculated Human Frame Proportions
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full border border-white/30 bg-white/10 font-mono text-[9px] uppercase font-bold text-white">
                    Rec: Size {previewMetrics.recommendedSize}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  <div className="p-2.5 rounded-xl border border-white/10 bg-black/40">
                    <span className="block font-mono text-[8px] uppercase tracking-wider text-white/40">
                      Shoulder Span
                    </span>
                    <span className="font-mono text-sm font-bold text-white">
                      {Math.round(previewMetrics.bideltoidCm)} cm
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl border border-white/10 bg-black/40">
                    <span className="block font-mono text-[8px] uppercase tracking-wider text-white/40">
                      Chest Girth
                    </span>
                    <span className="font-mono text-sm font-bold text-white">
                      {Math.round(previewMetrics.chestCircumferenceCm)} cm
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl border border-white/10 bg-black/40">
                    <span className="block font-mono text-[8px] uppercase tracking-wider text-white/40">
                      Torso Drop
                    </span>
                    <span className="font-mono text-sm font-bold text-white">
                      {Math.round(previewMetrics.torsoLengthCm)} cm
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl border border-white/10 bg-black/40">
                    <span className="block font-mono text-[8px] uppercase tracking-wider text-white/40">
                      BMI Index
                    </span>
                    <span className="font-mono text-sm font-bold text-white">
                      {previewMetrics.bmi}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row items-center gap-3">
              <button
                type="button"
                onClick={handleSave}
                className="w-full sm:flex-1 py-3.5 px-6 rounded-full bg-white text-black font-heading text-[10px] font-bold uppercase tracking-[0.25em] hover:bg-neutral-200 transition-all flex items-center justify-center gap-2 shadow-xl"
              >
                <Check className="w-3.5 h-3.5" />
                Apply Fit Calibration
              </button>

              <button
                type="button"
                onClick={handleUseDefaults}
                className="w-full sm:w-auto py-3 px-5 rounded-full border border-white/15 bg-transparent text-white/60 hover:text-white hover:border-white/30 font-heading text-[9px] uppercase tracking-widest transition-all"
              >
                Standard Defaults
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
