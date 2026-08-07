'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, PenTool, Image as ImageIcon, MapPin, CheckCircle, Search } from 'lucide-react';
import { cn } from '@/lib/utils';

/* ══════════════════════════════════════════════════════════════════════════
   SANCTUM — THE CREATOR ECOSYSTEM
   ══════════════════════════════════════════════════════════════════════════ */

const MASONRY_ITEMS = [
  { id: 1, type: 'Concept Art', title: 'Monolithic Structure 01', designer: 'Aryan Kuro', h: 'h-[400px]', img: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=1972&auto=format&fit=crop' },
  { id: 2, type: 'Material Study', title: 'Heavyweight Linen Drape', designer: 'Elena Rostova', h: 'h-[600px]', img: 'https://images.unsplash.com/photo-1616423640778-28d1b53229bd?q=80&w=2000&auto=format&fit=crop' },
  { id: 3, type: 'Prototype', title: 'Asymmetric Leather Jacket', designer: 'Kaelen', h: 'h-[500px]', img: 'https://images.unsplash.com/photo-1555529733-0e670560f8e1?q=80&w=2000&auto=format&fit=crop' },
  { id: 4, type: 'Moodboard', title: 'Chapter IV: Ashes', designer: 'ASHENRITUAL Studio', h: 'h-[450px]', img: 'https://images.unsplash.com/photo-1507027682794-35e6c12ad5b4?q=80&w=1974&auto=format&fit=crop' },
  { id: 5, type: '3D Render', title: 'Silicone Boot Concept', designer: 'Kaelen', h: 'h-[700px]', img: 'https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?q=80&w=2070&auto=format&fit=crop' },
  { id: 6, type: 'Sketch', title: 'Pleated Trousers Geometry', designer: 'Aryan Kuro', h: 'h-[400px]', img: 'https://images.unsplash.com/photo-1594902128965-f93318b76c8c?q=80&w=2070&auto=format&fit=crop' },
];

export function SanctumClient() {
  const [inSanctum, setInSanctum] = useState(false);

  return (
    <div className="w-full bg-background selection:bg-[#FDFCFB] selection:text-[#0A0A0A] min-h-screen relative">
      <AnimatePresence mode="wait">
        {!inSanctum ? (
          <CreatorHub key="hub" onEnter={() => setInSanctum(true)} />
        ) : (
          <CreatorLibrary key="library" />
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── 1. Creator Hub & The Door ───────────────────────────────────────────── */
function CreatorHub({ onEnter }: { onEnter: () => void }) {
  // Mock logged-in creator data
  const creator = {
    name: 'Aryan Kuro',
    bio: 'Independent designer focusing on absolute reduction and architectural tailoring.',
    location: 'Pithoragarh, India',
    specialization: 'Minimal Menswear',
    verified: true,
  };

  return (
    <motion.div
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
      className="w-full min-h-screen flex flex-col pt-24"
    >
      {/* Profile Section */}
      <div className="mx-auto max-w-screen-xl px-6 w-full flex-1 flex flex-col lg:flex-row items-center justify-center gap-16 lg:gap-24 relative z-10 py-12">
        
        {/* Avatar Area */}
        <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
          <div className="w-32 h-32 lg:w-48 lg:h-48 rounded-full bg-[#111] overflow-hidden border-2 border-[rgba(255,255,255,0.05)] mb-6 relative">
            {/* Avatar placeholder */}
            <div className="absolute inset-0 bg-gradient-to-tr from-[#1A1A1A] to-[#0A0A0A]" />
          </div>
          
          <div className="flex items-center gap-3 mb-2 justify-center lg:justify-start w-full">
            <h1 className="font-heading text-4xl uppercase tracking-wider text-[#FDFCFB]">{creator.name}</h1>
            {creator.verified && <CheckCircle className="w-5 h-5 text-[#FDFCFB]" />}
          </div>
          
          <p className="font-mono text-[10px] uppercase tracking-widest text-[#8D8D8D] mb-6 flex items-center justify-center lg:justify-start gap-2">
            <MapPin className="w-3 h-3" /> {creator.location} <span className="mx-2">|</span> {creator.specialization}
          </p>
          
          <p className="font-sans text-sm text-[#A8A8A8] max-w-md leading-relaxed mb-8">
            {creator.bio}
          </p>

          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4">
            <button className="bg-[#FDFCFB] text-[#0A0A0A] px-6 py-2.5 font-heading text-[10px] uppercase tracking-widest font-bold hover:bg-[#E8E8E8] transition-colors flex items-center gap-2">
              <PenTool className="w-3 h-3" /> Upload Concept
            </button>
            <button className="border border-[rgba(255,255,255,0.1)] text-[#FDFCFB] px-6 py-2.5 font-heading text-[10px] uppercase tracking-widest hover:bg-[rgba(255,255,255,0.05)] transition-colors flex items-center gap-2">
              <ImageIcon className="w-3 h-3" /> Manage Portfolio
            </button>
            <button className="border border-[rgba(255,255,255,0.05)] text-[#8D8D8D] w-10 h-10 flex items-center justify-center hover:bg-[rgba(255,255,255,0.02)] transition-colors">
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Info Box */}
        <div className="w-full max-w-sm border border-[rgba(255,255,255,0.05)] bg-[#050505] p-8 hidden md:block">
          <h3 className="font-heading text-[10px] uppercase tracking-[0.3em] text-[#8D8D8D] mb-6 border-b border-[rgba(255,255,255,0.05)] pb-4">Showroom Affiliations</h3>
          <p className="font-sans text-xs text-[#A8A8A8] mb-6 leading-relaxed">
            Your concepts are currently unaffiliated. Apply to a verified showroom to have your collections physically carried.
          </p>
          <button className="w-full border border-[rgba(255,255,255,0.1)] py-3 font-heading text-[10px] uppercase tracking-widest text-[#FDFCFB] hover:bg-[#111] transition-colors">
            Apply to Showroom
          </button>
        </div>

      </div>

      {/* The Door */}
      <div className="w-full flex-1 flex flex-col items-center justify-end relative pb-0 mt-20">
        <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-[#020202] to-transparent z-0 pointer-events-none" />
        
        <button 
          onClick={onEnter}
          className="group relative w-full max-w-2xl h-[40vh] bg-[#020202] border-t border-x border-[rgba(255,255,255,0.02)] flex items-center justify-center overflow-hidden z-10 transition-all duration-1000 hover:border-[rgba(255,255,255,0.08)]"
        >
          {/* Subtle lighting slit in the middle */}
          <div className="absolute inset-y-0 left-1/2 w-[1px] bg-gradient-to-b from-transparent via-[#FDFCFB]/10 to-transparent group-hover:via-[#FDFCFB]/30 transition-all duration-1000" />
          
          <span className="font-heading text-sm uppercase tracking-[0.5em] text-[#4A4A4A] group-hover:text-[#FDFCFB] transition-colors duration-700 bg-[#020202] px-6 z-10">
            Enter The Sanctum
          </span>
        </button>
      </div>
    </motion.div>
  );
}

/* ── 2. Creator Library (Masonry) ────────────────────────────────────────── */
function CreatorLibrary() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
      className="w-full min-h-screen pt-32 pb-32 px-6 lg:px-12 mx-auto max-w-screen-2xl"
    >
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
        <div>
          <p className="font-heading text-[10px] uppercase tracking-[0.4em] text-[#8D8D8D] mb-4">Creator Library</p>
          <h2 className="font-display italic text-4xl lg:text-6xl text-[#FDFCFB]">The Exhibition</h2>
        </div>
        <div className="flex items-center gap-4 border-b border-[rgba(255,255,255,0.1)] pb-2 w-full md:w-auto md:min-w-[300px]">
          <Search className="w-4 h-4 text-[#8D8D8D]" />
          <input 
            type="text" 
            placeholder="Search concepts, designers, materials..."
            className="bg-transparent border-none outline-none text-sm font-sans tracking-wide text-[#E8E8E8] placeholder:text-[#4A4A4A] w-full"
          />
        </div>
      </div>

      {/* Masonry Layout Simulation */}
      <div className="columns-1 md:columns-2 xl:columns-3 gap-8 space-y-8">
        {MASONRY_ITEMS.map((item, i) => (
          <Link key={item.id} href={`/sanctum/creator/${item.id}`}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + (i * 0.1), duration: 0.8 }}
              className="group relative w-full overflow-hidden break-inside-avoid bg-[#050505] cursor-pointer"
            >
              <div className={cn("relative w-full overflow-hidden", item.h)}>
                <Image
                  src={item.img}
                  alt={item.title}
                  fill
                  className="object-cover grayscale opacity-70 group-hover:scale-105 group-hover:opacity-100 transition-all duration-[1.5s] ease-[0.22,1,0.36,1]"
                  unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-80 group-hover:opacity-50 transition-opacity duration-700" />
              </div>
              
              {/* Overlay Content */}
              <div className="absolute bottom-0 left-0 w-full p-8 translate-y-4 group-hover:translate-y-0 transition-transform duration-700 ease-[0.22,1,0.36,1]">
                <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#A8A8A8] mb-2">{item.type}</p>
                <h3 className="font-heading text-2xl uppercase tracking-wide text-[#FDFCFB] mb-2">{item.title}</h3>
                <p className="font-display italic text-sm text-[#8D8D8D] group-hover:text-[#E8E8E8] transition-colors">{item.designer}</p>
              </div>
            </motion.div>
          </Link>
        ))}
      </div>
    </motion.div>
  );
}
