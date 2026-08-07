'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import { MapPin, CheckCircle, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export function ShowroomProfileClient({ showroomId }: { showroomId: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef });

  // Placeholder data for the design
  const store = {
    name: 'Atelier Kuro',
    city: 'Pithoragarh',
    state: 'Uttarakhand',
    verified: true,
    category: 'Quiet Luxury',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070&auto=format&fit=crop',
    specialization: 'Handcrafted formalwear and premium wool tailoring.',
    history: 'Founded in 2018, Atelier Kuro began as a small bespoke tailoring house dedicated to the art of absolute reduction. Rejecting seasonal trends, the house focuses exclusively on enduring silhouettes crafted from heavyweight Japanese and Italian textiles. Today, it stands as one of the premier destinations for architectural menswear in northern India.',
    founder: 'Aryan Kuro',
    materials: ['Japanese Denim', 'Italian Wool', 'Vegetable-Tanned Leather'],
  };

  const y = useTransform(scrollYProgress, [0, 1], ['0%', '40%']);
  const opacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);

  return (
    <div ref={containerRef} className="w-full bg-background selection:bg-[#FDFCFB] selection:text-[#0A0A0A] overflow-hidden min-h-screen">
      
      {/* ── Hero Storefront ────────────────────────────────────────────────── */}
      <section className="relative h-[85vh] w-full overflow-hidden">
        <motion.div style={{ y, opacity }} className="absolute inset-0 z-0">
          <Image
            src={store.image}
            alt={store.name}
            fill
            className="object-cover grayscale opacity-50"
            priority
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        </motion.div>

        <div className="absolute bottom-0 left-0 w-full z-10 px-6 lg:px-12 pb-24">
          <div className="mx-auto max-w-screen-2xl">
            <div className="flex items-center gap-4 mb-6">
              {store.verified && (
                <div className="flex items-center gap-1.5 bg-[#FDFCFB] px-3 py-1.5">
                  <CheckCircle className="w-3 h-3 text-[#0A0A0A]" />
                  <span className="font-heading text-[9px] uppercase tracking-[0.2em] text-[#0A0A0A] font-bold">Verified Showroom</span>
                </div>
              )}
              <span className="font-heading text-[10px] uppercase tracking-[0.3em] text-[#8D8D8D]">
                {store.category}
              </span>
            </div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
              className="font-heading text-5xl md:text-7xl lg:text-[100px] uppercase tracking-tighter text-[#FDFCFB] mb-4"
            >
              {store.name}
            </motion.h1>
            
            <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-widest text-[#A8A8A8]">
              <MapPin className="w-4 h-4" />
              {store.city}, {store.state}
            </div>
          </div>
        </div>
      </section>

      {/* ── Story & Details ────────────────────────────────────────────────── */}
      <section className="w-full py-32 border-b border-[rgba(255,255,255,0.03)]">
        <div className="mx-auto max-w-screen-2xl px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          <div className="lg:col-span-4">
            <div className="sticky top-32 space-y-12">
              <div>
                <h3 className="font-heading text-[10px] uppercase tracking-[0.3em] text-[#8D8D8D] mb-4">Founder</h3>
                <p className="font-display italic text-2xl text-[#E8E8E8]">{store.founder}</p>
              </div>
              
              <div>
                <h3 className="font-heading text-[10px] uppercase tracking-[0.3em] text-[#8D8D8D] mb-4">Specialization</h3>
                <p className="font-sans text-sm text-[#A8A8A8] leading-relaxed">{store.specialization}</p>
              </div>

              <div>
                <h3 className="font-heading text-[10px] uppercase tracking-[0.3em] text-[#8D8D8D] mb-4">Core Materials</h3>
                <ul className="space-y-3">
                  {store.materials.map(m => (
                    <li key={m} className="font-mono text-[11px] uppercase tracking-widest text-[#E8E8E8] pb-3 border-b border-[rgba(255,255,255,0.05)]">
                      {m}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="lg:col-span-8 lg:pl-16">
            <h2 className="font-heading text-4xl lg:text-5xl uppercase tracking-tighter text-[#FDFCFB] mb-10">The House History</h2>
            <div className="font-sans text-lg lg:text-xl text-[#8D8D8D] leading-relaxed space-y-6">
              <p>{store.history}</p>
              <p>Every piece curated within these walls undergoes strict architectural scrutiny to ensure it meets our standards of absolute reduction.</p>
            </div>

            <div className="mt-24">
              <h2 className="font-heading text-3xl uppercase tracking-tighter text-[#FDFCFB] mb-10 flex items-center justify-between border-b border-[rgba(255,255,255,0.05)] pb-6">
                Featured Designers
                <button className="text-[10px] uppercase tracking-[0.2em] text-[#8D8D8D] hover:text-[#FDFCFB] flex items-center gap-2 transition-colors">
                  View Sanctum Profiles <ArrowRight className="w-3 h-3" />
                </button>
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {[1,2,3].map((v) => (
                  <div key={v} className="group cursor-pointer">
                    <div className="aspect-[3/4] bg-[#0A0A0A] mb-4 overflow-hidden border border-[rgba(255,255,255,0.02)] group-hover:border-[rgba(255,255,255,0.1)] transition-colors">
                      <div className="w-full h-full bg-[#111] animate-pulse" /> {/* Placeholder for Creator Avatar */}
                    </div>
                    <p className="font-heading text-sm uppercase tracking-wider text-[#E8E8E8] group-hover:text-[#FDFCFB]">Designer {v}</p>
                    <p className="font-mono text-[10px] tracking-widest text-[#4A4A4A] mt-1 uppercase">Independent</p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── Future Placeholder Sections ────────────────────────────────────── */}
      <section className="w-full py-32 bg-[#050505]">
        <div className="mx-auto max-w-screen-2xl px-6 lg:px-12 text-center">
          <p className="font-heading text-[10px] uppercase tracking-[0.4em] text-[#4A4A4A] mb-6">Future Capabilities</p>
          <div className="flex flex-wrap justify-center gap-4">
            {['Appointments', 'Store Visit', 'Tailoring Bookings', 'Virtual Walkthrough', 'Reviews'].map(lbl => (
              <span key={lbl} className="border border-[rgba(255,255,255,0.05)] px-6 py-3 font-mono text-xs uppercase tracking-widest text-[#8D8D8D] opacity-50 cursor-not-allowed">
                {lbl}
              </span>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
