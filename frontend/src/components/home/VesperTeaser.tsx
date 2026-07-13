'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export function VesperTeaser() {
  return (
    <section className="border-t border-border bg-secondary">
      <div className="mx-auto flex max-w-screen-xl flex-col items-center gap-8 px-6 py-24 text-center lg:px-8 lg:py-32">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-lg"
        >
          <p className="font-premium text-[10px] uppercase tracking-[0.4em] text-muted-foreground">
            Wardrobe Intelligence
          </p>
          <h2 className="mt-4 font-heading text-5xl uppercase tracking-tight text-foreground md:text-7xl">
            Meet VESPER
          </h2>
          <p className="mt-6 font-premium text-base leading-relaxed text-muted-foreground">
            VESPER observes your wardrobe. Analyzes occasion, season, and silhouette. Returns a complete outfit — 
            not a suggestion, a direction. Every sentence intentional. Every recommendation precise.
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          <Link
            href="/vesper"
            className="group flex h-14 items-center gap-4 border border-border bg-transparent px-12 text-xs font-medium uppercase tracking-widest text-foreground transition-all hover:bg-foreground hover:text-background"
          >
            Consult VESPER
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

