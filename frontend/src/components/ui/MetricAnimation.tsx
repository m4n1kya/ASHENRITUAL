'use client';

import { motion } from 'framer-motion';

export function MetricAnimation() {
  return (
    <div className="pointer-events-none fixed left-0 top-1/2 -translate-y-1/2 hidden flex-col items-start lg:flex z-0 opacity-100">
      
      <motion.div 
        className="relative h-[400px] w-[600px] ml-4"
        initial={{ rotate: -20 }}
        animate={{ rotate: -20 }}
      >
        {/* We use a wider viewBox (300 200) to give the elongated rings plenty of room */}
        <svg viewBox="0 0 300 200" className="h-full w-full">
          <defs>
            <radialGradient id="planetGrad" cx="35%" cy="30%" r="65%">
              <stop offset="0%" stopColor="#555" />
              <stop offset="40%" stopColor="#1a1a1a" />
              <stop offset="80%" stopColor="#000" />
              <stop offset="100%" stopColor="#000" />
            </radialGradient>
            
            <mask id="ringMask">
              <rect x="0" y="0" width="300" height="200" fill="white" />
              {/* Planet is at cx=150, cy=100, r=40. Top half is y < 100. */}
              <path d="M 110 100 A 40 40 0 0 1 190 100 Z" fill="black" />
            </mask>
          </defs>

          {/* ── Saturn Planet ── */}
          <circle cx="150" cy="100" r="42" fill="none" stroke="#000000" strokeWidth="0.5" strokeOpacity="0.8" />
          <circle cx="150" cy="100" r="40" fill="url(#planetGrad)" />

          {/* ── Elongated Rotating Rings ── */}
          <g mask="url(#ringMask)">
            
            {/* Inner Ring */}
            <motion.ellipse 
              cx="150" cy="100" rx="90" ry="16" 
              fill="none" stroke="#000000" strokeWidth="1" strokeOpacity="0.8"
              strokeDasharray="6 8"
              animate={{ strokeDashoffset: [0, -200] }}
              transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
            />
            
            {/* Main Thick Ring */}
            <motion.ellipse 
              cx="150" cy="100" rx="110" ry="19" 
              fill="none" stroke="#000000" strokeWidth="2.5" strokeOpacity="0.7"
              strokeDasharray="40 15 8 20 80 15"
              animate={{ strokeDashoffset: [0, -300] }}
              transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
            />

            {/* Middle Thin Ring */}
            <motion.ellipse 
              cx="150" cy="100" rx="116" ry="20" 
              fill="none" stroke="#000000" strokeWidth="0.75" strokeOpacity="0.9"
              strokeDasharray="12 6"
              animate={{ strokeDashoffset: [0, -150] }}
              transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
            />

            {/* Outer Debris Ring */}
            <motion.ellipse 
              cx="150" cy="100" rx="135" ry="24" 
              fill="none" stroke="#000000" strokeWidth="0.75" strokeOpacity="0.5"
              strokeDasharray="2 12 4 16"
              animate={{ strokeDashoffset: [0, -100] }}
              transition={{ duration: 50, repeat: Infinity, ease: 'linear' }}
            />
          </g>
        </svg>
      </motion.div>
      
    </div>
  );
}
