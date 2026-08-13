'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

const SOCIALS = [
  {
    name: 'Instagram',
    handle: '@ashenritual',
    url: 'https://instagram.com/ashenritual',
    description: 'Editorials, campaigns & daily drops',
  },
  {
    name: 'Pinterest',
    handle: 'ashenritual',
    url: 'https://pinterest.com/ashenritual',
    description: 'Mood boards & archival references',
  },
  {
    name: 'X / Twitter',
    handle: '@ashenritual',
    url: 'https://x.com/ashenritual',
    description: 'Brand manifesto & cultural discourse',
  },
  {
    name: 'YouTube',
    handle: 'AshenRitual',
    url: 'https://youtube.com/@ashenritual',
    description: 'Films, process & behind the seams',
  },
];

export function BeyondJoin() {
  return (
    <section className="w-full bg-[#050505]">
      {/* Social links */}
      <div className="border-t border-white/[0.04] max-w-screen-xl mx-auto px-6 lg:px-12 py-32">
        <p className="font-heading text-[10px] uppercase tracking-[0.4em] text-[#4A4A4A] mb-4">
          Follow The Universe
        </p>
        <h2 className="font-display italic text-4xl md:text-5xl text-[#FDFCFB] mb-16 max-w-md">
          We exist everywhere.
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-px bg-white/[0.04]">
          {SOCIALS.map((social, i) => (
            <motion.a
              key={i}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group bg-[#050505] p-8 hover:bg-[#0A0A0A] transition-colors duration-500 flex flex-col justify-between min-h-[200px]"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-heading text-[13px] uppercase tracking-widest text-[#FDFCFB]">{social.name}</p>
                  <p className="font-mono text-[10px] text-[#4A4A4A] mt-1">{social.handle}</p>
                </div>
                <ArrowUpRight className="h-4 w-4 text-[#4A4A4A] group-hover:text-[#FDFCFB] group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all duration-300" />
              </div>
              <p className="font-sans text-xs text-[#4A4A4A] group-hover:text-[#8D8D8D] transition-colors duration-500 leading-relaxed mt-6">
                {social.description}
              </p>
            </motion.a>
          ))}
        </div>

        <div className="mt-20 pt-16 border-t border-white/[0.04] flex flex-col md:flex-row items-start justify-between gap-8">
          <div>
            <h3 className="font-heading text-2xl uppercase tracking-widest text-[#FDFCFB] mb-3">Enter The Universe</h3>
            <p className="font-display italic text-lg text-[#4A4A4A]">Become part of the cultural fabric of ASHENRITUAL.</p>
          </div>
          <div className="flex gap-4">
            <Link href="/register" className="bg-[#FDFCFB] text-[#0A0A0A] px-7 py-3.5 font-heading text-[10px] uppercase tracking-[0.2em] hover:bg-[#E8E8E8] transition-colors">
              Become a Creator
            </Link>
            <Link href="/contact" className="border border-white/20 text-[#FDFCFB] px-7 py-3.5 font-heading text-[10px] uppercase tracking-[0.2em] hover:bg-[#1A1A1A] transition-colors">
              Submit Editorial
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
