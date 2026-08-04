'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export function CalculatingBurst({ className }: { className?: string }) {
  // Generate a random-looking burst of lines
  const lines = Array.from({ length: 48 }).map((_, i) => {
    const angle = (i * 360) / 48;
    const length = 20 + Math.random() * 25; // 20 to 45
    const thickness = Math.random() > 0.8 ? 1.5 : 0.5;
    const opacity = 0.3 + Math.random() * 0.7;
    const delay = Math.random() * 2;
    
    return { angle, length, thickness, opacity, delay };
  });

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div className="relative flex h-8 w-8 items-center justify-center">
        {/* Core intense glow */}
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.8, 1, 0.8] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute h-3 w-3 rounded-full bg-white blur-[3px]" 
        />
        <div className="absolute h-1.5 w-1.5 rounded-full bg-white" />

        {/* Burst lines */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0"
        >
          <svg viewBox="0 0 100 100" className="h-full w-full mix-blend-screen">
            {lines.map((line, i) => (
              <motion.line
                key={i}
                x1="50"
                y1="50"
                x2={50 + line.length * Math.cos((line.angle * Math.PI) / 180)}
                y2={50 + line.length * Math.sin((line.angle * Math.PI) / 180)}
                stroke="white"
                strokeWidth={line.thickness}
                strokeLinecap="round"
                initial={{ opacity: line.opacity }}
                animate={{ opacity: [line.opacity * 0.3, line.opacity, line.opacity * 0.3] }}
                transition={{
                  duration: 0.5 + Math.random(),
                  repeat: Infinity,
                  delay: line.delay,
                  ease: "easeInOut"
                }}
              />
            ))}
          </svg>
        </motion.div>
        
        {/* Ambient surrounding glow */}
        <div className="absolute inset-[-10px] rounded-full bg-blue-400/10 blur-xl mix-blend-screen" />
      </div>

      <span className="font-sans text-sm text-[#8D8D8D] tracking-wide relative">
        <span className="relative z-10 bg-gradient-to-r from-white/80 to-white/40 bg-clip-text text-transparent">
          Calculating.
        </span>
      </span>
    </div>
  );
}
