/**
 * @fileoverview ASHENRITUAL Architecture
 * @module BeyondCreators.tsx
 */
'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const CREATORS = [
  { name: 'Elena Rostova', role: 'Architectural Photographer', img: '/images/beyond/young-man-portrait.jpg' },
  { name: 'Kaelen Vance', role: 'Stylist & Director', img: '/images/beyond/close-up-portrait-attractive-male-model-color-flash-light.jpg' },
  { name: 'Studio Form', role: 'Brutalist Design Firm', img: '/images/beyond/beautiful-belarus-person-city.jpg' },
  { name: 'Marcus Chen', role: 'Fashion Filmmaker', img: '/images/beyond/medium-shot-young-man-posing-outdoors.jpg' },
];

export function BeyondCreators() {
  const container = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ['start end', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], ['5%', '-5%']);

  return (
    <section ref={container} className="w-full py-32 bg-[#0E0E0E]">
      <div className="max-w-screen-xl mx-auto px-6 md:px-10">
        <div className="flex justify-between items-end mb-16">
          <h2 className="font-heading text-3xl md:text-5xl font-medium text-[#FDFCFB]">Creator Spotlight</h2>
          <span className="font-heading text-[10px] uppercase tracking-[0.2em] text-[#8D8D8D]">01 / Voices</span>
        </div>

        <motion.div style={{ y }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {CREATORS.map((creator, i) => (
            <div key={i} className="group relative overflow-hidden aspect-[3/4] bg-[#1A1A1A]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={creator.img} 
                alt={creator.name}
                className="w-full h-full object-cover grayscale transition-transform duration-[1.5s] group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0E0E0E]/90 via-transparent to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="absolute bottom-0 left-0 p-6 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                <h3 className="font-heading text-lg font-medium text-[#FDFCFB]">{creator.name}</h3>
                <p className="font-heading text-[9px] uppercase tracking-[0.2em] text-[#8D8D8D] mt-2">{creator.role}</p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
