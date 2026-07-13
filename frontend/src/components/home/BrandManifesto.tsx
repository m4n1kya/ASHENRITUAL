'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export function BrandManifesto() {
  return (
    <section className="border-t border-border bg-background">
      <div className="mx-auto grid max-w-screen-xl grid-cols-1 gap-16 px-6 py-24 lg:grid-cols-2 lg:px-8 lg:py-32">
        {/* Left — Philosophy */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="text-[10px] uppercase tracking-[0.4em] text-muted-foreground">
            Philosophy
          </p>
          <h2 className="mt-4 font-heading text-5xl uppercase tracking-tight text-foreground md:text-6xl">
            Fashion is<br />
            identity, not<br />
            attention.
          </h2>
        </motion.div>

        {/* Right — Principles */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col justify-center"
        >
          <div className="space-y-8">
            {[
              {
                label: '01',
                title: 'Intentional Design',
                description: 'Every garment is designed with purpose. Nothing is incidental.',
              },
              {
                label: '02',
                title: 'Quiet Confidence',
                description: 'Luxury doesn\'t shout. The finest pieces are recognized, never announced.',
              },
              {
                label: '03',
                title: 'Precision Craft',
                description: 'From fabric selection to silhouette engineering — discipline defines every stitch.',
              },
            ].map(({ label, title, description }) => (
              <div key={label} className="flex gap-6 border-b border-border pb-8 last:border-b-0 last:pb-0">
                <span className="font-mono text-xs text-muted-foreground">{label}</span>
                <div>
                  <h3 className="text-sm font-medium text-foreground">{title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{description}</p>
                </div>
              </div>
            ))}
          </div>
          <Link
            href="/lookbook"
            className="group mt-10 flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
          >
            View Lookbook
            <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
