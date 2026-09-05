/**
 * @fileoverview ASHENRITUAL Architecture
 * @module BeyondHero.tsx
 */
'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export function BeyondHero() {
  const container = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ['start start', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const text = "BEYOND".split("");

  return (
    <section ref={container} className="relative h-screen w-full overflow-hidden flex items-center justify-center">
      <motion.div 
        style={{ y, opacity }} 
        className="absolute inset-0 z-0 bg-[#0E0E0E]"
      >
        <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none" 
             style={{ backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")' }}></div>
      </motion.div>

      <div className="relative z-10 text-center flex flex-col items-center">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="font-heading text-[10px] uppercase tracking-[0.4em] text-[#8D8D8D] mb-6"
        >
          Beyond the garments lies the world of ASHENRITUAL
        </motion.p>
        
        <h1 className="font-heading text-5xl md:text-8xl font-medium tracking-[0.1em] text-[#FDFCFB] flex overflow-hidden">
          {text.map((char, index) => (
            <motion.span
              key={index}
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              transition={{
                duration: 0.8,
                delay: 0.4 + index * 0.05,
                ease: [0.33, 1, 0.68, 1],
              }}
              className="inline-block"
            >
              {char}
            </motion.span>
          ))}
        </h1>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="mt-16 w-[1px] h-16 bg-gradient-to-b from-[#8D8D8D] to-transparent"
        />
      </div>
    </section>
  );
}
