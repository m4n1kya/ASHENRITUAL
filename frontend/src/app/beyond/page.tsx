'use client';

import { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BeyondHero } from '@/components/beyond/BeyondHero';
import { BeyondTextReveal } from '@/components/beyond/BeyondTextReveal';

import { BeyondCreators } from '@/components/beyond/BeyondCreators';
import { BeyondCommunity } from '@/components/beyond/BeyondCommunity';
import { BeyondReviews } from '@/components/beyond/BeyondReviews';
import { BeyondPress } from '@/components/beyond/BeyondPress';
import { BeyondEvents } from '@/components/beyond/BeyondEvents';
import { BeyondFilms } from '@/components/beyond/BeyondFilms';
import { BeyondFootprint } from '@/components/beyond/BeyondFootprint';
import { BeyondJoin } from '@/components/beyond/BeyondJoin';
import { BeyondImageBelt } from '@/components/beyond/BeyondImageBelt';

export default function BeyondPage() {
  const container = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <main ref={container} className="relative w-full bg-[#0E0E0E] text-[#FDFCFB] overflow-x-hidden pt-20">
      
      {/* Shiny magical particles background */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden opacity-80">
        {mounted && [...Array(50)].map((_, i) => (
          <motion.div
            key={`particle-${i}`}
            className="absolute rounded-full bg-white"
            style={{
              width: Math.random() * 2 + 1,
              height: Math.random() * 2 + 1,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              boxShadow: '0 0 8px 1px rgba(255,255,255,0.4)',
            }}
            animate={{
              y: [0, Math.random() * -100 - 50],
              x: [0, (Math.random() - 0.5) * 50],
              opacity: [0, Math.random() * 0.4 + 0.1, 0],
              scale: [0, 1.5, 0],
            }}
            transition={{
              duration: Math.random() * 5 + 5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 5
            }}
          />
        ))}
      </div>

      <div className="relative z-10">
        <BeyondHero />
        <BeyondTextReveal />

        <BeyondImageBelt />
        <BeyondCreators />
        <BeyondCommunity />
        <BeyondReviews />
        <BeyondPress />
        <BeyondEvents />
        <BeyondFilms />
        <BeyondFootprint />
        <BeyondJoin />
      </div>
    </main>
  );
}
