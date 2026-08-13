'use client';

import { useRef } from 'react';
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

export default function BeyondPage() {
  const container = useRef<HTMLDivElement>(null);

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
