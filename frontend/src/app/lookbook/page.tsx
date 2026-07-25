'use client';

import { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, ArrowUpRight } from 'lucide-react';

/* ── Data ───────────────────────────────────────────────────────────────── */

const EDITORIALS = [
  {
    id: '01',
    label: 'Form 1',
    title: 'Foundation',
    subtitle: 'The architecture of restraint.',
    description: 'A study in stark geometry. Stripping away the non-essential to reveal the structural integrity of the garment itself. The silhouette becomes a monolith.',
    image: '/images/hero.png',
    href: '/chapters/foundation',
  },
  {
    id: '02',
    label: 'Form 2',
    title: 'Forged Today',
    subtitle: 'Permanence through precision.',
    description: 'Hardware as jewelry. Heavy zippers, stark seams, and cold metal against dense wool. Industrial necessity recontextualized as luxury.',
    image: '/images/product.png',
    href: '/chapters/forged-today',
  },
  {
    id: '03',
    label: 'Layering 1',
    title: 'Epoch',
    subtitle: 'When restraint meets dimension.',
    description: 'The interplay of varying weights. Sheer organza layered over heavy canvas. Creating depth without resorting to loud color.',
    image: '/images/texture.png',
    href: '/chapters/epoch',
  },
];

const MATERIAL_STUDIES = [
  { label: 'Concrete', image: '/images/texture.png' },
  { label: 'Stone', image: '/images/product.png' },
  { label: 'Leather', image: '/images/hero.png' },
];

/* ── Components ───────────────────────────────────────────────────────────── */

export default function LookbookPage() {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  return (
    <main ref={containerRef} className="min-h-screen bg-background pt-[60px] texture-grain overflow-x-hidden">
      
      {/* ── Intro ───────────────────────────────────────────────────────────── */}
      <section className="relative flex min-h-[80vh] flex-col items-center justify-center px-8 text-center lg:px-12">
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="font-heading text-[10px] font-medium uppercase tracking-[0.4em] text-muted-foreground"
        >
          The Lookbook
        </motion.p>
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="mt-6 font-gothic text-6xl text-foreground md:text-8xl lg:text-[10rem] leading-none"
        >
          Manuals
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="mt-8 max-w-xl font-serif text-lg leading-relaxed text-muted-foreground md:text-xl"
        >
          A visual language for the considered wardrobe. Each frame deliberate. Each silhouette precise.
        </motion.p>
      </section>

      {/* ── Editorial Stagger ──────────────────────────────────────────────── */}
      <section className="mx-auto max-w-screen-2xl px-4 py-24 md:px-8">
        {EDITORIALS.map((item, index) => {
          const isEven = index % 2 === 0;
          
          return (
            <motion.div 
              key={item.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className={`mb-32 flex flex-col gap-12 lg:mb-48 lg:flex-row ${isEven ? '' : 'lg:flex-row-reverse'} lg:items-center lg:gap-24`}
            >
              <div className="relative aspect-[3/4] w-full lg:w-3/5 overflow-hidden group">
                <Link href={item.href}>
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover transition-transform duration-[2000ms] group-hover:scale-105"
                    sizes="(max-width: 1024px) 100vw, 60vw"
                  />
                  <div className="absolute inset-0 bg-black/10 transition-colors duration-500 group-hover:bg-transparent" />
                </Link>
              </div>

              <div className="w-full lg:w-2/5">
                <p className="font-heading text-[10px] font-bold uppercase tracking-[0.3em] text-foreground/50">
                  {item.id} — {item.label}
                </p>
                <h2 className="mt-6 font-gothic text-4xl text-foreground md:text-6xl lg:text-7xl">
                  {item.title}
                </h2>
                <p className="mt-4 font-serif text-xl italic text-muted-foreground">
                  {item.subtitle}
                </p>
                <p className="mt-8 max-w-md text-sm leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
                <Link 
                  href={item.href}
                  className="group mt-12 inline-flex items-center gap-4 border-b border-border pb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-foreground transition-all hover:border-foreground"
                >
                  Explore Chapter
                  <ArrowRight className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </div>
            </motion.div>
          );
        })}
      </section>

      {/* ── Immersive Full-Bleed ────────────────────────────────────────────── */}
      <section className="relative h-[80vh] w-full overflow-hidden">
        <motion.div 
          style={{ y: useTransform(scrollYProgress, [0, 1], ['0%', '30%']) }}
          className="absolute inset-0"
        >
          <Image
            src="/images/hero.png"
            alt="Editorial Ambient"
            fill
            className="object-cover opacity-80"
            sizes="100vw"
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/50" />
        
        <div className="absolute bottom-16 left-8 md:left-16 lg:left-24">
          <p className="font-heading text-[10px] font-medium uppercase tracking-[0.4em] text-white/50">
            Curation
          </p>
          <h2 className="mt-4 font-gothic text-5xl text-white md:text-7xl">
            The Empty Room
          </h2>
        </div>
      </section>

      {/* ── Material Studies ─────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-screen-xl px-8 py-32 lg:px-12">
        <div className="mb-16 flex flex-col items-center text-center">
          <p className="font-heading text-[10px] font-medium uppercase tracking-[0.35em] text-muted-foreground">
            Curated Elements
          </p>
          <h2 className="mt-4 font-heading text-2xl font-semibold uppercase tracking-[0.08em] text-foreground md:text-3xl">
            Material Studies
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {MATERIAL_STUDIES.map((mat, i) => (
            <motion.div 
              key={mat.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              className="group"
            >
              <div className="relative aspect-[4/5] overflow-hidden bg-card border border-border">
                <Image
                  src={mat.image}
                  alt={mat.label}
                  fill
                  className="object-cover opacity-60 transition-transform duration-[1500ms] group-hover:scale-110 group-hover:opacity-100"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              <p className="mt-4 text-center font-heading text-[10px] font-medium uppercase tracking-[0.3em] text-muted-foreground transition-colors duration-300 group-hover:text-foreground">
                {mat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

    </main>
  );
}
