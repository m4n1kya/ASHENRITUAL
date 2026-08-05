'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useSizeStore } from '@/store/size.store';
import { ArrowRight, Ruler } from 'lucide-react';
import { useAuthStore } from '@/store/auth.store';

export default function VesperDashboardPage() {
  const { profile } = useSizeStore();
  const { user } = useAuthStore();

  return (
    <div className="h-full w-full flex flex-col justify-center px-12 lg:px-24 relative">
      {/* Background Glow */}
      <div className="absolute inset-0 bg-gradient-to-tr from-[#0A0A0A] to-transparent pointer-events-none opacity-50" />

      <motion.div
        initial={{ opacity: 0, scale: 0.97, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1] }}
        className="max-w-2xl relative z-10"
      >
        <p className="font-heading text-[10px] uppercase tracking-[0.4em] text-[#8D8D8D] mb-6">
          Intelligence Dashboard
        </p>
        <h1 className="font-heading text-5xl md:text-7xl uppercase tracking-widest text-[#FDFCFB] leading-tight">
          Good Evening
        </h1>
        <p className="mt-6 text-lg text-[#8D8D8D] font-light tracking-wide">
          Ready to discover your perfect fit. The intelligence layer is standing by.
        </p>

        <div className="mt-16 flex flex-col sm:flex-row gap-6">
          <Link
            href="/vesper/size"
            className="group relative flex items-center justify-between bg-[#FDFCFB] text-[#0A0A0A] px-8 py-5 rounded-full overflow-hidden transition-transform duration-[1200ms] ease-[cubic-bezier(0.4,0,0.2,1)] hover:scale-[1.04]"
          >
            <div className="absolute inset-0 bg-[#E8E8E8] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
            <span className="relative z-10 font-medium uppercase tracking-widest text-[11px]">
              {profile ? 'Re-Analyze Proportions' : 'Begin Size Analysis'}
            </span>
            <ArrowRight className="relative z-10 w-4 h-4 ml-8 transition-transform duration-500 group-hover:translate-x-2" />
          </Link>

          <Link
            href="/vesper/chat"
            className="group flex items-center justify-between border border-[#333] hover:border-[#666] text-[#FDFCFB] px-8 py-5 rounded-full transition-all duration-[1200ms] ease-[cubic-bezier(0.4,0,0.2,1)] hover:scale-[1.04]"
          >
            <span className="font-medium uppercase tracking-widest text-[11px]">
              Continue Conversation
            </span>
          </Link>
        </div>
      </motion.div>

      {/* Recent Analysis Section */}
      <motion.div
        initial={{ opacity: 0, scale: 0.97, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 1.2, delay: 0.2, ease: [0.4, 0, 0.2, 1] }}
        className="absolute bottom-12 left-12 lg:left-24 z-10"
      >
        <div className="flex items-center gap-4 text-[#8D8D8D]">
          <div className="w-10 h-[1px] bg-[#333]" />
          <span className="text-[9px] uppercase tracking-widest font-medium">Recent Analysis</span>
        </div>
        
        {profile ? (
          <div className="mt-6 p-6 border border-[#202020] bg-[#0A0A0A]/50 backdrop-blur-md rounded-[24px] flex items-start gap-6 max-w-sm">
            <div className="p-3 bg-[#111] rounded-full shrink-0">
              <Ruler className="w-5 h-5 text-[#FDFCFB]" />
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-widest text-[#FDFCFB] mb-2">{profile.bodyType}</p>
              <p className="text-xs text-[#8D8D8D] leading-relaxed line-clamp-3">
                Height: {profile.measurements.heightCm}cm | Chest: {profile.measurements.chestCircumferenceCm}cm
              </p>
              <Link href="/vesper/measurements" className="inline-block mt-4 text-[10px] uppercase tracking-widest text-[#4A4A4A] hover:text-[#FDFCFB] transition-colors">
                View Profile &rarr;
              </Link>
            </div>
          </div>
        ) : (
          <p className="mt-6 text-[11px] tracking-widest text-[#4A4A4A] uppercase ml-14">
            No previous measurements.
          </p>
        )}
      </motion.div>

      {/* ── Right side: Subtle Tailor's Tape (The Measuring Scale) ── */}
      <div
        className="absolute right-0 top-0 z-0 flex h-full w-16 items-center justify-end pointer-events-none"
        aria-hidden="true"
      >
        <div className="relative h-full w-full border-l border-[rgba(255,255,255,0.04)] overflow-hidden">
          <motion.div
            animate={{ y: ['-50%', '0%'] }}
            transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
            className="flex w-full flex-col pt-10"
          >
            {[0, 1].map((loopIdx) => (
              <div key={loopIdx} className="w-full">
                {[...Array(100)].map((_, i) => (
                  <div key={i} className="flex w-full items-center justify-end pr-4" style={{ height: '30px' }}>
                    {i % 10 === 0 ? (
                      <>
                        <span className="font-sans text-[10px] tracking-widest text-[#8D8D8D] mr-3 -rotate-90 origin-right translate-x-1 opacity-60">
                          {i.toString().replace(/[0-9]/g, d => '०१२३४५६७८९'[parseInt(d)])}
                        </span>
                        <div className="h-[1px] w-4 bg-[#8D8D8D]/40" />
                      </>
                    ) : i % 5 === 0 ? (
                      <div className="h-[1px] w-2.5 bg-[#8D8D8D]/30" />
                    ) : (
                      <div className="h-[1px] w-1.5 bg-[#8D8D8D]/15" />
                    )}
                  </div>
                ))}
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
