'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export function BeyondJoin() {
  return (
    <section className="w-full py-32 bg-[#0E0E0E] border-t border-[rgba(255,255,255,0.05)]">
      <div className="max-w-4xl mx-auto px-6 text-center flex flex-col items-center">
        <h2 className="font-heading text-4xl md:text-6xl font-medium text-[#FDFCFB] mb-6">Enter The Universe</h2>
        <p className="font-display italic text-xl md:text-2xl text-[#8D8D8D] mb-12">
          Become part of the cultural fabric of ASHENRITUAL.
        </p>
        
        <div className="flex flex-col md:flex-row gap-6">
          <Link href="/register" className="group flex items-center gap-4 bg-[#FDFCFB] text-[#0A0A0A] px-8 py-4 font-heading text-[10px] uppercase tracking-[0.2em] hover:bg-[#E8E8E8] transition-colors">
            Become a Creator
            <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link href="/contact" className="group flex items-center gap-4 border border-[rgba(255,255,255,0.2)] text-[#FDFCFB] px-8 py-4 font-heading text-[10px] uppercase tracking-[0.2em] hover:bg-[#1A1A1A] transition-colors">
            Submit Editorial
          </Link>
        </div>
        
        <p className="font-heading text-[9px] uppercase tracking-[0.2em] text-[#4A4A4A] mt-16">
          Tag #ASHENRITUAL to be featured
        </p>
      </div>
    </section>
  );
}
