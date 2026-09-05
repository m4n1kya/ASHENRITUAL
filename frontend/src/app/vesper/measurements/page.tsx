/**
 * @fileoverview ASHENRITUAL Architecture
 * @module page.tsx
 */
"use client";

import {
  useSizeStore,
  BodyMeasurements,
  BodyProfile,
} from "@/store/size.store";
import { Ruler, Edit2, Save, X } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function MeasurementsPage() {
  const { profile, updateMeasurements } = useSizeStore();
  const [isEditing, setIsEditing] = useState(false);

  // Local state for edits
  const [edits, setEdits] = useState<Partial<BodyMeasurements>>({});

  const handleSave = () => {
    updateMeasurements(edits);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEdits({});
    setIsEditing(false);
  };

  const startEdit = () => {
    if (profile) {
      setEdits({ ...profile.measurements });
      setIsEditing(true);
    }
  };

  if (!profile) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-background texture-grain px-12">
        <p className="text-[11px] uppercase tracking-widest text-[#4A4A4A]">
          No architectural profile established.
        </p>
      </div>
    );
  }

  const renderField = (key: keyof BodyMeasurements, label: string) => {
    const value = isEditing ? edits[key] : profile.measurements[key];

    return (
      <div className="flex flex-col border-b border-[#202020] py-6 group">
        <label className="text-[9px] uppercase tracking-[0.3em] text-[#8D8D8D] mb-3">
          {label}
        </label>
        {isEditing ? (
          <div className="flex items-center gap-4">
            <input
              type="number"
              value={value || ""}
              onChange={(e) =>
                setEdits({ ...edits, [key]: Number(e.target.value) })
              }
              className="bg-transparent text-xl font-mono text-[#FDFCFB] border-b border-[#333] pb-1 px-0 w-32 focus:ring-0 focus:border-[#FDFCFB]"
            />
            <span className="text-[#8D8D8D] font-mono text-sm">cm</span>
          </div>
        ) : (
          <p className="text-xl font-mono text-[#E8E8E8] group-hover:text-[#FDFCFB] transition-colors">
            {value} <span className="text-[#8D8D8D] text-sm">cm</span>
          </p>
        )}
      </div>
    );
  };

  return (
    <div className="h-full w-full px-6 md:px-12 pt-32 pb-12 overflow-y-auto hide-scrollbar relative">
      <div className="max-w-4xl mx-auto min-h-full flex flex-col justify-center">
        <header className="mb-16 flex items-end justify-between border-b border-[#202020] pb-8">
          <div>
            <h1 className="font-heading text-3xl uppercase tracking-[0.2em] text-[#FDFCFB] flex items-center gap-4">
              <Ruler className="w-6 h-6 text-[#4A4A4A]" /> Body Profile
            </h1>
            <p className="text-[10px] uppercase tracking-widest text-[#8D8D8D] mt-3">
              Last updated: {new Date(profile.lastUpdated).toLocaleDateString()}
            </p>
          </div>

          <AnimatePresence mode="wait">
            {!isEditing ? (
              <motion.button
                key="edit"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={startEdit}
                className="text-[10px] uppercase tracking-widest text-[#8D8D8D] hover:text-[#FDFCFB] flex items-center gap-2 transition-colors"
              >
                <Edit2 className="w-3 h-3" /> Edit Proportions
              </motion.button>
            ) : (
              <motion.div
                key="actions"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-6"
              >
                <button
                  onClick={handleCancel}
                  className="text-[10px] uppercase tracking-widest text-[#8D8D8D] hover:text-[#E8E8E8] flex items-center gap-2 transition-colors"
                >
                  <X className="w-3 h-3" /> Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="text-[10px] uppercase tracking-widest text-[#FDFCFB] flex items-center gap-2 bg-[#1A1A1A] px-4 py-2 rounded-sm hover:bg-[#202020] transition-colors"
                >
                  <Save className="w-3 h-3" /> Save Changes
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </header>

        <div className="grid md:grid-cols-2 gap-x-24 gap-y-4">
          <div className="space-y-2">
            {renderField("heightCm", "Height")}
            {renderField("weightKg", "Weight (kg)")}
            {renderField("shoulderWidthCm", "Shoulder Width")}
            {renderField("chestCircumferenceCm", "Chest Circumference")}
          </div>
          <div className="space-y-2">
            {renderField("waistCircumferenceCm", "Waist Circumference")}
            {renderField("sleeveLengthCm", "Sleeve Length")}
            {renderField("neckCircumferenceCm", "Neck Circumference")}
          </div>
        </div>

        <div className="mt-16 bg-[#0A0A0A] border border-[#202020] p-8 flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-[#8D8D8D] mb-1">
              Architectural Identity
            </p>
            <p className="font-heading text-lg text-[#E8E8E8] uppercase tracking-widest">
              {profile.bodyType}
            </p>
          </div>
          <div className="text-right">
            <p className="text-[10px] uppercase tracking-widest text-[#8D8D8D] mb-1">
              Preferred Fit
            </p>
            <p className="font-heading text-lg text-[#E8E8E8] uppercase tracking-widest">
              {profile.preferredFit}
            </p>
          </div>
          <div className="text-right">
            <p className="text-[10px] uppercase tracking-widest text-[#8D8D8D] mb-1">
              Confidence
            </p>
            <p className="font-heading text-lg text-[#E8E8E8] uppercase tracking-widest">
              {profile.confidenceScore}%
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
