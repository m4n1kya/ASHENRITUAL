'use client';

import { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { BeyondHero } from '@/components/beyond/BeyondHero';
import { BeyondTextReveal } from '@/components/beyond/BeyondTextReveal';
import { BeyondEditorials } from '@/components/beyond/BeyondEditorials';
import { BeyondCreators } from '@/components/beyond/BeyondCreators';
import { BeyondCommunity } from '@/components/beyond/BeyondCommunity';
import { BeyondReviews } from '@/components/beyond/BeyondReviews';
import { BeyondPress } from '@/components/beyond/BeyondPress';
import { BeyondEvents } from '@/components/beyond/BeyondEvents';
import { BeyondFilms } from '@/components/beyond/BeyondFilms';
import { BeyondFootprint } from '@/components/beyond/BeyondFootprint';
import { BeyondJoin } from '@/components/beyond/BeyondJoin';

gsap.registerPlugin(ScrollTrigger);

export default function BeyondPage() {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.6,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.8,
      touchMultiplier: 2,
    });

    lenis.on('scroll', ScrollTrigger.update);

    const update = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
      gsap.ticker.remove(update);
    };
  }, []);

  return (
    <main ref={container} className="relative w-full bg-[#0E0E0E] text-[#FDFCFB] overflow-x-hidden pt-20">
      <BeyondHero />
      <BeyondTextReveal />
      <BeyondEditorials />
      <BeyondCreators />
      <BeyondCommunity />
      <BeyondReviews />
      <BeyondPress />
      <BeyondEvents />
      <BeyondFilms />
      <BeyondFootprint />
      <BeyondJoin />
    </main>
  );
}
