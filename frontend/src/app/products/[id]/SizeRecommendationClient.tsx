'use client';

import { useSizeStore } from '@/store/size.store';
import { Ruler, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function SizeRecommendationClient() {
  const { profile } = useSizeStore();

  if (!profile) return null;

  // Extremely rudimentary local logic to mimic size mapping for the frontend
  // In a real app, we would query the backend based on product type
  let recommendedSize = 'M';
  if (profile.measurements.shoulderWidthCm > 48) recommendedSize = 'L';
  if (profile.measurements.shoulderWidthCm > 52) recommendedSize = 'XL';
  if (profile.measurements.shoulderWidthCm < 43) recommendedSize = 'S';

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="my-8 bg-[#0A0A0A] border border-[#202020] p-6 relative overflow-hidden group"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-[#111] to-transparent pointer-events-none" />
        
        <div className="relative z-10 flex items-start gap-4">
          <div className="p-3 bg-[#111] border border-[#333] rounded-sm shrink-0">
            <Ruler className="w-4 h-4 text-[#FDFCFB]" />
          </div>
          
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[9px] uppercase tracking-[0.3em] text-[#8D8D8D]">Vesper Size Intelligence</span>
              <span className="text-[9px] uppercase tracking-widest text-[#4A4A4A] flex items-center gap-1">
                <Check className="w-3 h-3 text-green-500/70" /> {profile.confidenceScore}% Match
              </span>
            </div>
            
            <p className="font-heading text-lg text-[#E8E8E8] mb-1">
              Recommended: <span className="text-[#FDFCFB]">SIZE {recommendedSize}</span>
            </p>
            
            <p className="text-[11px] text-[#8D8D8D] leading-relaxed italic border-l border-[#333] pl-3 mt-3">
              &quot;Based on your {profile.bodyType} profile, this garment will provide an ideal shoulder fit with a {profile.preferredFit === 'Slim' ? 'tapered' : 'slightly relaxed'} chest.&quot;
            </p>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
