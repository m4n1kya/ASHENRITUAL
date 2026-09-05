/**
 * @fileoverview ASHENRITUAL Architecture
 * @module BeyondCommunity.tsx
 */
'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const IMAGES = [
  { src: '/images/beyond/cowboy-silhouette-with-horse-against-warm-light.jpg', speed: 0.1, className: 'w-[80%] md:w-[45%] h-[50vh] md:h-[70vh] left-[10%] top-0 z-10' },
  { src: '/images/beyond/medium-shot-young-man-posing-outdoors.jpg', speed: 0.25, className: 'w-[60%] md:w-[35%] h-[40vh] md:h-[50vh] right-[5%] top-[20%] z-20' },
  { src: '/images/beyond/portrait-fashionable-boy-outdoors.jpg', speed: 0.05, className: 'w-[70%] md:w-[40%] h-[45vh] md:h-[60vh] left-[20%] top-[40%] z-0' },
];

export function BeyondCommunity() {
  const container = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ['start end', 'end start'],
  });

  return (
    <section ref={container} className="relative w-full h-[150vh] md:h-[200vh] py-20 bg-[#0A0A0A] overflow-hidden">
      
      <div className="absolute inset-0 flex items-center justify-center opacity-[0.02] pointer-events-none">
        <h2 className="font-heading text-[15vw] md:text-[10vw] uppercase tracking-tighter whitespace-nowrap">
          The Community
        </h2>
      </div>

      <div className="relative w-full max-w-screen-xl mx-auto h-full">
        {IMAGES.map((img, i) => {
          // eslint-disable-next-line react-hooks/rules-of-hooks
          const y = useTransform(scrollYProgress, [0, 1], ['0%', `${img.speed * 300}%`]);
          
          return (
            <motion.div
              key={i}
              style={{ y }}
              className={`absolute overflow-hidden ${img.className}`}
            >
              <div className="absolute inset-0 bg-[#1A1A1A]" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={img.src} 
                alt="Community Gallery"
                className="w-full h-full object-cover grayscale opacity-90 hover:opacity-100 hover:grayscale-0 transition-all duration-700"
                loading="lazy"
              />
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
