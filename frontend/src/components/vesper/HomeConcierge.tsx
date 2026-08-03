import Link from 'next/link';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

export function HomeConcierge() {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 1, duration: 1.2, ease: [0.19, 1, 0.22, 1] }}
      className="fixed right-8 top-28 z-50 flex items-center justify-end"
    >
      <Link href="/vesper" className="group relative flex items-center justify-end">
        {/* Pulsating ethereal glow */}
        <div className="absolute inset-0 rounded-full bg-[#FDFCFB]/5 opacity-0 blur-xl transition-all duration-700 group-hover:opacity-100 group-hover:scale-150"></div>
        <div className="absolute inset-0 rounded-full bg-[#FDFCFB]/10 blur-md transition-all duration-500 group-hover:bg-[#FDFCFB]/20"></div>
        
        {/* Core Glass Bubble */}
        <div className="relative flex h-14 w-14 items-center overflow-hidden rounded-full border border-[rgba(255,255,255,0.15)] bg-[#0A0A0A]/60 backdrop-blur-2xl transition-all duration-500 group-hover:w-[200px] group-hover:border-[rgba(255,255,255,0.3)] group-hover:bg-[#0A0A0A]/90 shadow-[0_10px_40px_rgba(0,0,0,0.8)]">
          
          <div className="flex w-full items-center flex-row-reverse">
            {/* The Vesper Sparkle Icon (Anchored Right) */}
            <div className="flex h-14 w-14 shrink-0 items-center justify-center">
               <Sparkles className="h-5 w-5 text-[#FDFCFB] opacity-70 transition-all duration-500 group-hover:opacity-100 group-hover:-rotate-12" />
            </div>

            {/* Hidden Text that reveals on hover (Left of Icon) */}
            <span className="font-heading text-[10px] uppercase tracking-[0.3em] text-[#FDFCFB] transition-all duration-500 opacity-0 translate-x-2 group-hover:translate-x-0 group-hover:opacity-100 whitespace-nowrap pl-5">
              Consult Vesper
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
