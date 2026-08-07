'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence, useScroll, useTransform, MotionValue } from 'framer-motion';
import { CheckCircle, MapPin, ChevronRight, Search } from 'lucide-react';
import { cn } from '@/lib/utils';

/* ══════════════════════════════════════════════════════════════════════════
   SHOWROOMS — DISCOVERY JOURNEY
   ══════════════════════════════════════════════════════════════════════════ */

const MOCK_SHOWROOMS = [
  {
    id: 'shr_01',
    name: 'Atelier Kuro',
    city: 'Pithoragarh',
    state: 'Uttarakhand',
    verified: true,
    category: 'Quiet Luxury',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070&auto=format&fit=crop',
    specialization: 'Handcrafted formalwear and premium wool tailoring.',
  },
  {
    id: 'shr_02',
    name: 'Maison Obsidian',
    city: 'Delhi',
    state: 'Delhi',
    verified: true,
    category: 'Minimal Tailoring',
    image: 'https://images.unsplash.com/photo-1555529733-0e670560f8e1?q=80&w=2000&auto=format&fit=crop',
    specialization: 'Brutalist silhouettes and deconstructed garments.',
  },
  {
    id: 'shr_03',
    name: 'The White Room',
    city: 'Mumbai',
    state: 'Maharashtra',
    verified: true,
    category: 'Linen Specialists',
    image: 'https://images.unsplash.com/photo-1600607688969-a5bfcd64bd40?q=80&w=2000&auto=format&fit=crop',
    specialization: 'Pristine monochrome collections for extreme climates.',
  },
  {
    id: 'shr_04',
    name: 'Void Studios',
    city: 'Bangalore',
    state: 'Karnataka',
    verified: false,
    category: 'Japanese Streetwear',
    image: 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?q=80&w=2070&auto=format&fit=crop',
    specialization: 'Avant-garde streetwear using heavyweight denim.',
  },
];

type Level = 'COUNTRY' | 'STATE' | 'CITY' | 'SHOWROOMS';

export function ShowroomsClient() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  
  const [level, setLevel] = useState<Level>('COUNTRY');
  const [selection, setSelection] = useState({
    country: 'India',
    state: '',
    city: '',
  });

  return (
    <div ref={containerRef} className="w-full bg-background selection:bg-[#FDFCFB] selection:text-[#0A0A0A] overflow-hidden min-h-screen pb-32">
      <HeroSection scrollYProgress={scrollYProgress} />
      
      <div className="mx-auto max-w-screen-2xl px-6 lg:px-12 mt-16 lg:mt-32">
        <JourneyPath level={level} selection={selection} setLevel={setLevel} />
        
        <div className="mt-16 min-h-[50vh] relative">
          <AnimatePresence mode="wait">
            {level === 'COUNTRY' && (
              <SelectionLayer
                key="country"
                title="Select Country"
                options={[{ label: 'India', active: true }]}
                onSelect={(val) => {
                  setSelection(s => ({ ...s, country: val }));
                  setLevel('STATE');
                }}
              />
            )}
            
            {level === 'STATE' && (
              <SelectionLayer
                key="state"
                title="Select State"
                options={[
                  { label: 'Uttarakhand', active: true },
                  { label: 'Delhi', active: true },
                  { label: 'Maharashtra', active: true },
                  { label: 'Karnataka', active: true },
                ]}
                onSelect={(val) => {
                  setSelection(s => ({ ...s, state: val }));
                  setLevel('CITY');
                }}
              />
            )}

            {level === 'CITY' && (
              <SelectionLayer
                key="city"
                title="Select City"
                options={
                  selection.state === 'Uttarakhand' ? [{ label: 'Pithoragarh', active: true }, { label: 'Dehradun', active: true }] :
                  selection.state === 'Delhi' ? [{ label: 'New Delhi', active: true }] :
                  selection.state === 'Maharashtra' ? [{ label: 'Mumbai', active: true }] :
                  [{ label: 'Bangalore', active: true }]
                }
                onSelect={(val) => {
                  setSelection(s => ({ ...s, city: val }));
                  setLevel('SHOWROOMS');
                }}
              />
            )}

            {level === 'SHOWROOMS' && (
              <ShowroomGrid key="showrooms" city={selection.city} />
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

/* ── 1. Hero ─────────────────────────────────────────────────────────────── */
function HeroSection({ scrollYProgress }: { scrollYProgress: MotionValue<number> }) {
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  return (
    <section className="relative flex h-[70vh] lg:h-[85vh] w-full items-center justify-center overflow-hidden border-b border-[rgba(255,255,255,0.03)]">
      <motion.div style={{ y, opacity }} className="absolute inset-0 z-0 bg-[#050505]">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#050505]/50 to-background z-10" />
      </motion.div>

      <div className="relative z-10 flex flex-col items-center text-center px-6">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="font-heading text-[10px] font-semibold uppercase tracking-[0.5em] text-[#8D8D8D] mb-6"
        >
          The Network
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="font-heading text-5xl md:text-7xl lg:text-[110px] font-bold uppercase tracking-tighter text-[#FDFCFB]"
        >
          SHOWROOMS
        </motion.h1>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mt-8 max-w-xl space-y-4"
        >
          <p className="font-display italic text-xl text-[#E8E8E8] md:text-2xl">
            Discover verified menswear houses across India.
          </p>
          <p className="font-sans text-[13px] tracking-wide text-[#8D8D8D] leading-relaxed max-w-md mx-auto">
            Every showroom represents its own identity, craftsmanship, and curated catalogue. Browse by location and experience menswear beyond conventional online shopping.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

/* ── 2. Journey Path ─────────────────────────────────────────────────────── */
function JourneyPath({ level, selection, setLevel }: { level: Level, selection: { country: string, state: string, city: string }, setLevel: (l: Level) => void }) {
  const stages = [
    { id: 'COUNTRY', label: selection.country || 'Country' },
    { id: 'STATE', label: selection.state || 'State' },
    { id: 'CITY', label: selection.city || 'City' },
  ];

  const currentIndex = stages.findIndex(s => s.id === level) === -1 ? 3 : stages.findIndex(s => s.id === level);

  return (
    <div className="flex items-center gap-3 font-heading text-[10px] uppercase tracking-[0.25em] text-[#4A4A4A]">
      {stages.map((stage, i) => {
        const isPast = i < currentIndex;
        const isCurrent = i === currentIndex;
        const isFuture = i > currentIndex;

        if (isFuture) return null;

        return (
          <div key={stage.id} className="flex items-center gap-3">
            <button
              onClick={() => setLevel(stage.id as Level)}
              disabled={isCurrent}
              className={cn(
                "transition-colors duration-300",
                isCurrent ? "text-[#FDFCFB]" : "text-[#8D8D8D] hover:text-[#E8E8E8] cursor-pointer"
              )}
            >
              {stage.label}
            </button>
            {!isCurrent && <ChevronRight className="h-3 w-3 text-[#333]" />}
          </div>
        );
      })}
      {level === 'SHOWROOMS' && (
        <div className="flex items-center gap-3">
          <span className="text-[#FDFCFB]">Showrooms</span>
        </div>
      )}
    </div>
  );
}

/* ── 3. Selection Layer ──────────────────────────────────────────────────── */
function SelectionLayer({ title, options, onSelect }: { title: string, options: {label: string, active: boolean}[], onSelect: (val: string) => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="absolute inset-0"
    >
      <h2 className="font-display italic text-3xl text-[#E8E8E8] mb-12">{title}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {options.map((opt, i) => (
          <motion.button
            key={opt.label}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            onClick={() => opt.active && onSelect(opt.label)}
            disabled={!opt.active}
            className={cn(
              "flex flex-col items-start justify-between p-6 h-32 border border-[rgba(255,255,255,0.05)] bg-[#0A0A0A] transition-all duration-500 group",
              opt.active ? "hover:border-[rgba(255,255,255,0.15)] hover:bg-[#111]" : "opacity-50 cursor-not-allowed"
            )}
          >
            <span className="font-heading text-[12px] uppercase tracking-widest text-[#8D8D8D] group-hover:text-[#FDFCFB] transition-colors">{opt.label}</span>
            {opt.active && <ArrowRightIcon />}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}

function ArrowRightIcon() {
  return <ArrowRight className="h-4 w-4 text-[#4A4A4A] group-hover:text-[#FDFCFB] transition-colors group-hover:translate-x-1 duration-300" />
}
import { ArrowRight } from 'lucide-react';

/* ── 4. Showroom Grid ────────────────────────────────────────────────────── */
function ShowroomGrid({ city }: { city: string }) {
  const filtered = MOCK_SHOWROOMS; // In real app, filter by city or show all if city is "All"

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="flex items-center justify-between mb-12 border-b border-[rgba(255,255,255,0.05)] pb-6">
        <h2 className="font-display italic text-3xl text-[#E8E8E8]">Verified Showrooms in {city}</h2>
        <div className="flex gap-4">
          <button className="text-[10px] font-heading uppercase tracking-widest text-[#8D8D8D] hover:text-[#FDFCFB] transition-colors flex items-center gap-2">
            <Search className="w-3 h-3" /> Filter
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
        {filtered.map((store, i) => (
          <Link key={store.id} href={`/showrooms/${store.id}`}>
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="group cursor-pointer relative"
            >
              {/* Image Container */}
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#0A0A0A] border border-[rgba(255,255,255,0.02)] group-hover:border-[rgba(255,255,255,0.1)] transition-colors duration-700">
                <Image
                  src={store.image}
                  alt={store.name}
                  fill
                  className="object-cover grayscale opacity-70 group-hover:opacity-100 group-hover:scale-105 transition-all duration-1000 ease-[0.22,1,0.36,1]"
                  unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-80 group-hover:opacity-40 transition-opacity duration-700" />
                
                {/* Badge */}
                {store.verified && (
                  <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-[#050505]/80 backdrop-blur-md px-3 py-1.5 border border-[rgba(255,255,255,0.1)]">
                    <CheckCircle className="w-3 h-3 text-[#FDFCFB]" />
                    <span className="font-heading text-[8px] uppercase tracking-[0.2em] text-[#FDFCFB]">Verified</span>
                  </div>
                )}
              </div>

              {/* Info Panel */}
              <div className="pt-6 relative">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-heading text-2xl uppercase tracking-wide text-[#FDFCFB] mb-1">{store.name}</h3>
                    <div className="flex items-center gap-2 text-[10px] font-mono tracking-widest text-[#8D8D8D] uppercase">
                      <MapPin className="w-3 h-3" />
                      {store.city}, {store.state}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="inline-block border border-[#333] px-3 py-1 text-[9px] font-heading uppercase tracking-widest text-[#A8A8A8]">
                      {store.category}
                    </span>
                  </div>
                </div>
                <p className="font-sans text-[13px] text-[#A8A8A8] leading-relaxed max-w-sm">
                  {store.specialization}
                </p>
              </div>
            </motion.div>
          </Link>
        ))}
      </div>
    </motion.div>
  );
}
