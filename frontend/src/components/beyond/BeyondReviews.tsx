/**
 * @fileoverview ASHENRITUAL Architecture
 * @module BeyondReviews.tsx
 */
'use client';

import { motion } from 'framer-motion';

const REVIEWS = [
  {
    quote: "ASHENRITUAL does not sell clothing. It sells an architecture of self. The precision of the cut and the weight of the fabric demand a certain posture from the wearer.",
    author: "Rhys Alderton",
    role: "Fashion Critic, Archive Magazine",
    rating: 5,
  },
  {
    quote: "Every piece feels considered. There's no excess, no noise. Just extraordinary quality that you wear and immediately understand.",
    author: "Karan Mehta",
    role: "Verified Purchase — The Obsidian Coat",
    rating: 5,
  },
  {
    quote: "The tailoring on the Vernal Silence collection is unlike anything I've encountered at this price point. It moves beautifully.",
    author: "Saoirse Brennan",
    role: "Stylist & Editorial Director",
    rating: 5,
  },
  {
    quote: "I've purchased from a dozen luxury houses. ASHENRITUAL is the only one where I feel the garment was made specifically for my intent.",
    author: "Daisuke Mori",
    role: "Verified Purchase — Brushed Wool Trousers",
    rating: 5,
  },
  {
    quote: "Quiet luxury, but with a backbone. These pieces aren't trying to be noticed — and that's precisely what makes them unforgettable.",
    author: "Elena Vasquez",
    role: "Creative Director, Monolith Studio",
    rating: 5,
  },
];

export function BeyondReviews() {
  return (
    <section className="w-full py-32 bg-[#050505] border-y border-white/[0.04]">
      <div className="max-w-screen-xl mx-auto px-6 lg:px-12">
        <p className="font-heading text-[10px] uppercase tracking-[0.4em] text-[#4A4A4A] mb-4">
          Verified Voices
        </p>
        <h2 className="font-display italic text-4xl md:text-5xl text-[#FDFCFB] mb-16 max-w-md">
          What they say.
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-px bg-white/[0.04]">
          {REVIEWS.map((review, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, delay: i * 0.08 }}
              className="bg-[#050505] p-8 flex flex-col justify-between min-h-[280px] hover:bg-[#0A0A0A] transition-colors duration-500 group"
            >
              <div>
                <div className="flex gap-1 mb-6">
                  {[...Array(review.rating)].map((_, j) => (
                    <div key={j} className="w-1 h-1 rounded-full bg-[#FDFCFB]/40" />
                  ))}
                </div>
                <p className="font-display italic text-lg md:text-xl leading-relaxed text-[#FDFCFB]/80 group-hover:text-[#FDFCFB] transition-colors duration-500">
                  &ldquo;{review.quote}&rdquo;
                </p>
              </div>
              <div className="mt-8 pt-6 border-t border-white/[0.06]">
                <p className="font-heading text-[12px] uppercase tracking-wider text-[#E8E8E8]">{review.author}</p>
                <p className="font-sans text-[10px] text-[#4A4A4A] mt-1 tracking-wide">{review.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
