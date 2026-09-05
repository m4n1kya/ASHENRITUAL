/**
 * @fileoverview ASHENRITUAL Architecture
 * @module BeyondEditorials.tsx
 */
'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const SLIDES = [
  {
    title: 'Autumn Winter / 24',
    subtitle: 'Campaign',
    image: '/images/beyond/beautiful-belarus-person-city.jpg',
  },
  {
    title: 'The Blueprint',
    subtitle: 'Behind The Seams',
    image: '/images/beyond/portrait-fashionable-boy-outdoors.jpg',
  },
  {
    title: 'Silhouettes',
    subtitle: 'Editorial',
    image: '/images/beyond/close-up-portrait-attractive-male-model-color-flash-light.jpg',
  },
];

export function BeyondEditorials() {
  const targetRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: targetRef,
  });

  // 3 slides = 300vw. We want to move by 200vw left, which is 66.666% of the 300vw container.
  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-66.66666%"]);

  return (
    <section ref={targetRef} className="relative h-[300vh] w-full bg-[#0A0A0A]">
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        <motion.div style={{ x }} className="flex h-full w-[300vw]">
          {SLIDES.map((slide, index) => (
            <div 
              key={index} 
              className="relative w-screen h-full flex flex-col justify-center px-10 md:px-32 lg:px-48"
            >
              <div className="flex flex-col md:flex-row items-center gap-10 md:gap-20 h-[70vh]">
                <div className="w-full md:w-3/5 h-[40vh] md:h-full relative overflow-hidden group">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={slide.image}
                    alt={slide.title}
                    className="w-full h-full object-cover grayscale transition-transform duration-[2s] group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/10 transition-opacity duration-700 group-hover:opacity-0" />
                </div>
                
                <div className="w-full md:w-2/5 flex flex-col justify-center">
                  <span className="font-heading text-[10px] uppercase tracking-[0.3em] text-[#8D8D8D] mb-4">
                    {slide.subtitle}
                  </span>
                  <h3 className="font-heading text-4xl md:text-5xl lg:text-7xl font-medium tracking-wide text-[#FDFCFB] leading-tight">
                    {slide.title}
                  </h3>
                  <div className="mt-8 w-12 h-[1px] bg-[#4A4A4A]" />
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
