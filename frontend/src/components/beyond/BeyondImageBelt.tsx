/**
 * @fileoverview ASHENRITUAL Architecture
 * @module BeyondImageBelt.tsx
 */
'use client';

import { useRef } from 'react';
import { motion } from 'framer-motion';

const IMAGES = [
  '/images/beyond/young-man-portrait.jpg',
  '/images/beyond/portrait-fashionable-boy-outdoors.jpg',
  '/images/beyond/close-up-portrait-attractive-male-model-color-flash-light.jpg',
  '/images/beyond/beautiful-belarus-person-city.jpg',
  '/images/beyond/cowboy-silhouette-with-horse-against-warm-light.jpg',
  '/images/beyond/young-man-portrait.jpg',
  '/images/beyond/portrait-fashionable-boy-outdoors.jpg',
  '/images/beyond/close-up-portrait-attractive-male-model-color-flash-light.jpg',
];

export function BeyondImageBelt() {
  return (
    <section className="w-full py-24 bg-[#080808] overflow-hidden border-y border-white/[0.04]">
      <p className="font-heading text-[10px] uppercase tracking-[0.4em] text-[#4A4A4A] text-center mb-12">
        The Visual Archive
      </p>
      <div className="relative flex">
        <motion.div
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration: 28, ease: 'linear', repeat: Infinity }}
          className="flex gap-4 shrink-0"
        >
          {[...IMAGES, ...IMAGES].map((src, i) => (
            <div
              key={i}
              className="relative shrink-0 w-64 h-80 md:w-80 md:h-96 overflow-hidden group"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt=""
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors duration-700" />
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
