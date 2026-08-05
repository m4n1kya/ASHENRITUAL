'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSizeStore } from '@/store/size.store';
import { ArrowLeft, Check, Layers, User } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function FitPreviewPage() {
  const { profile } = useSizeStore();
  const router = useRouter();
  const [garment, setGarment] = useState<'Shirt' | 'Suit'>('Shirt');
  const [isWarping, setIsWarping] = useState(false);

  // If they somehow skip straight here without a profile
  if (!profile) {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center bg-background texture-grain p-12 text-center">
        <h2 className="font-heading text-xl uppercase tracking-[0.2em] text-[#FDFCFB] mb-4">No Profile Found</h2>
        <p className="text-sm text-[#8D8D8D] mb-8">You must complete the Size Intelligence analysis first.</p>
        <Link href="/vesper/size" className="bg-[#FDFCFB] text-[#0A0A0A] px-8 py-4 rounded-sm uppercase tracking-widest text-[11px] font-medium hover:bg-[#E8E8E8] transition-colors">
          Begin Analysis
        </Link>
      </div>
    );
  }

  // Calculate generic offsets based on profile vs "average" base mesh (M)
  // Assume Base M: Shoulders = 46, Chest = 100, Waist = 84
  const scaleXShoulders = profile.measurements.shoulderWidthCm / 46;
  const scaleXWaist = profile.measurements.waistCircumferenceCm / 84;
  const scaleXChest = profile.measurements.chestCircumferenceCm / 100;

  const handleGarmentChange = (g: 'Shirt' | 'Suit') => {
    setIsWarping(true);
    setGarment(g);
    setTimeout(() => setIsWarping(false), 800);
  };

  return (
    <div className="h-full w-full flex flex-col px-12 py-12 relative hide-scrollbar overflow-y-auto">
      <div className="max-w-6xl mx-auto w-full flex flex-col">
        <header className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="font-heading text-2xl uppercase tracking-[0.2em] text-[#FDFCFB]">
              Fit Preview
            </h1>
            <p className="text-[10px] uppercase tracking-widest text-[#8D8D8D] mt-2">
              Architectural Silhouette Simulation
            </p>
          </div>
          <button onClick={() => router.push('/vesper/size')} className="text-[10px] uppercase tracking-widest text-[#8D8D8D] hover:text-[#FDFCFB] flex items-center gap-2 transition-colors">
            <ArrowLeft className="w-3 h-3" /> Back to Scanner
          </button>
        </header>

        <div className="flex-1 flex flex-col lg:flex-row gap-12">
          
          {/* Controls & Report */}
          <div className="w-full lg:w-80 flex flex-col shrink-0">
            <h3 className="font-heading text-xs uppercase tracking-[0.2em] text-[#FDFCFB] mb-4 border-b border-[#202020] pb-2">
              Select Garment
            </h3>
            <div className="flex gap-4 mb-12">
              <button 
                onClick={() => handleGarmentChange('Shirt')}
                className={`flex-1 py-4 text-[10px] uppercase tracking-widest transition-all ${garment === 'Shirt' ? 'bg-[#FDFCFB] text-[#0A0A0A]' : 'bg-[#111] text-[#8D8D8D] hover:bg-[#1A1A1A] border border-[#202020]'}`}
              >
                White Shirt
              </button>
              <button 
                onClick={() => handleGarmentChange('Suit')}
                className={`flex-1 py-4 text-[10px] uppercase tracking-widest transition-all ${garment === 'Suit' ? 'bg-[#FDFCFB] text-[#0A0A0A]' : 'bg-[#111] text-[#8D8D8D] hover:bg-[#1A1A1A] border border-[#202020]'}`}
              >
                Black Suit
              </button>
            </div>

            <h3 className="font-heading text-xs uppercase tracking-[0.2em] text-[#FDFCFB] mb-6 border-b border-[#202020] pb-2 flex items-center gap-2">
              <Check className="w-3 h-3 text-green-500" /> Fit Report
            </h3>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center bg-[#111] p-4 border border-[#202020] rounded-sm">
                <span className="text-[10px] uppercase tracking-widest text-[#8D8D8D]">Shoulders</span>
                <span className="text-[11px] text-[#E8E8E8]">{scaleXShoulders > 1.05 ? 'Tailored (Tight)' : scaleXShoulders < 0.95 ? 'Relaxed' : 'Perfect Alignment'}</span>
              </div>
              <div className="flex justify-between items-center bg-[#111] p-4 border border-[#202020] rounded-sm">
                <span className="text-[10px] uppercase tracking-widest text-[#8D8D8D]">Chest</span>
                <span className="text-[11px] text-[#E8E8E8]">{scaleXChest > 1 ? 'Form Fitting' : 'Natural Drape'}</span>
              </div>
              <div className="flex justify-between items-center bg-[#111] p-4 border border-[#202020] rounded-sm">
                <span className="text-[10px] uppercase tracking-widest text-[#8D8D8D]">Waist</span>
                <span className="text-[11px] text-[#E8E8E8]">{scaleXWaist > 1 ? 'Structured' : 'Tapered'}</span>
              </div>
            </div>

            <div className="mt-8 bg-[#0A0A0A] p-6 border border-[#333] relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-tr from-[#111] to-transparent pointer-events-none" />
              <p className="text-[9px] uppercase tracking-widest text-[#4A4A4A] mb-2 relative z-10">AI Recommendation</p>
              <h2 className="font-heading text-2xl text-[#FDFCFB] relative z-10 mb-2">SIZE M</h2>
              <p className="text-xs text-[#8D8D8D] leading-relaxed relative z-10 italic">
                &quot;Size M offers better shoulder alignment while preserving natural drape through the torso. {profile.preferredFit === 'Slim' ? 'It provides a closer silhouette without sacrificing chest comfort.' : ''}&quot;
              </p>
            </div>
          </div>

          {/* 2D Render Canvas */}
          <div className="flex-1 bg-[#0A0A0A] border border-[#202020] rounded-sm relative min-h-[600px] flex items-center justify-center overflow-hidden">
            {/* Architectural Grid Background */}
            <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
            
            <div className="absolute top-6 left-6 text-[9px] uppercase tracking-widest text-[#4A4A4A] flex flex-col gap-2">
              <span className="flex items-center gap-2"><Layers className="w-3 h-3" /> Displacement Layer Active</span>
              <span className="flex items-center gap-2"><User className="w-3 h-3" /> Profile: {profile.bodyType}</span>
            </div>

            {/* The Warp Engine (Abstract Visual) */}
            <AnimatePresence mode="wait">
              {!isWarping && (
                <motion.div
                  key={garment}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.05 }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  className="relative w-full max-w-sm aspect-[3/4] flex items-center justify-center"
                >
                  {/* Base Body Outline */}
                  <svg viewBox="0 0 100 200" className="absolute inset-0 w-full h-full opacity-10">
                    <path d="M30,20 C40,10 60,10 70,20 L85,60 C90,80 85,120 75,180 L25,180 C15,120 10,80 15,60 Z" fill="none" stroke="white" strokeWidth="0.5" />
                  </svg>

                  {/* Garment Mesh Warped by Profile */}
                  <motion.svg 
                    viewBox="0 0 100 200" 
                    className="absolute inset-0 w-full h-full"
                    animate={{
                      // Dynamically adjust scale based on the user's proportions vs average
                      scaleX: [1, Math.min(1.15, Math.max(0.85, scaleXShoulders))]
                    }}
                    transition={{ duration: 1.5, delay: 0.2, ease: 'easeOut' }}
                  >
                    {garment === 'Shirt' ? (
                      <path 
                        d="M35,25 C45,20 55,20 65,25 L80,60 C80,80 85,110 75,140 L25,140 C15,110 20,80 20,60 Z" 
                        fill="rgba(255,255,255,0.05)" 
                        stroke="rgba(255,255,255,0.8)" 
                        strokeWidth="1" 
                      />
                    ) : (
                      <path 
                        d="M30,22 C45,18 55,18 70,22 L85,65 C85,90 85,120 75,150 L25,150 C15,120 15,90 15,65 Z" 
                        fill="rgba(255,255,255,0.02)" 
                        stroke="rgba(255,255,255,0.4)" 
                        strokeWidth="1" 
                      />
                    )}
                    
                    {/* Measurement Lines Overlay */}
                    <line x1="35" y1="35" x2="65" y2="35" stroke="rgba(255,255,255,0.3)" strokeWidth="0.5" strokeDasharray="2 2" />
                    <text x="50" y="32" fill="rgba(255,255,255,0.5)" fontSize="4" textAnchor="middle" letterSpacing="1">SHOULDERS</text>

                    <line x1="25" y1="80" x2="75" y2="80" stroke="rgba(255,255,255,0.3)" strokeWidth="0.5" strokeDasharray="2 2" />
                    <text x="50" y="77" fill="rgba(255,255,255,0.5)" fontSize="4" textAnchor="middle" letterSpacing="1">CHEST</text>

                    <line x1="28" y1="120" x2="72" y2="120" stroke="rgba(255,255,255,0.3)" strokeWidth="0.5" strokeDasharray="2 2" />
                    <text x="50" y="117" fill="rgba(255,255,255,0.5)" fontSize="4" textAnchor="middle" letterSpacing="1">WAIST</text>
                  </motion.svg>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </div>
    </div>
  );
}
