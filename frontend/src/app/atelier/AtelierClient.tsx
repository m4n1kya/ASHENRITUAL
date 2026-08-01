'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform, MotionValue } from 'framer-motion';

/* ══════════════════════════════════════════════════════════════════════════
   ATELIER — THE CREATIVE STUDIO
   ══════════════════════════════════════════════════════════════════════════ */

export function AtelierClient() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef });

  return (
    <div ref={containerRef} className="w-full bg-background selection:bg-[#FDFCFB] selection:text-[#0A0A0A] overflow-hidden">
      <HeroSection scrollYProgress={scrollYProgress} />
      <BrandPhilosophy />
      <CreativeProcess />
      <MaterialLibrary />
      <DesignPrinciples />
      <SeasonalDevelopment />
      <InspirationWall />
      <Craftsmanship />
      <StudioGallery />
    </div>
  );
}

/* ── 1. Hero ─────────────────────────────────────────────────────────────── */
function HeroSection({ scrollYProgress }: { scrollYProgress: MotionValue<number> }) {
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const opacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);

  return (
    <section className="relative flex h-screen w-full items-center justify-center overflow-hidden border-b border-[rgba(255,255,255,0.05)]">
      <motion.div style={{ y, opacity }} className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop"
          alt="Atelier Studio"
          fill
          className="object-cover object-center opacity-40 grayscale"
          priority
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/50" />
      </motion.div>

      <div className="relative z-10 flex flex-col items-center text-center px-6">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="font-heading text-[10px] font-semibold uppercase tracking-[0.5em] text-[#8D8D8D] mb-8"
        >
          The Creative Studio
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="font-heading text-6xl md:text-8xl lg:text-[140px] font-bold uppercase tracking-tight text-[#FDFCFB] drop-shadow-2xl"
        >
          Atelier
        </motion.h1>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1, ease: [0.22, 1, 0.36, 1] }}
          className="mt-12 max-w-xl space-y-4"
        >
          <p className="font-display italic text-2xl text-[#E8E8E8] md:text-3xl">
            &quot;Where silence becomes form.&quot;
          </p>
          <p className="font-sans text-[13px] tracking-widest text-[#8D8D8D] uppercase">
            Every collection begins long before the first garment is worn.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

/* ── 2. Brand Philosophy ─────────────────────────────────────────────────── */
function BrandPhilosophy() {
  return (
    <section className="relative w-full py-32 lg:py-48 px-6 lg:px-12 mx-auto max-w-screen-2xl">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-8 items-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="lg:col-span-5 relative aspect-[4/5] w-full max-w-md mx-auto lg:mx-0 overflow-hidden bg-[#1A1A1A]"
        >
          <Image
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop"
            alt="Philosophy"
            fill
            className="object-cover grayscale hover:grayscale-0 transition-all duration-1000 opacity-80"
            unoptimized
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="lg:col-span-6 lg:col-start-7 flex flex-col justify-center"
        >
          <h2 className="font-heading text-4xl lg:text-6xl uppercase tracking-tighter text-[#FDFCFB] mb-8">
            Quiet Confidence,<br />
            Absolute Restraint.
          </h2>
          <div className="space-y-6 font-sans text-lg lg:text-xl font-light leading-relaxed text-[#A8A8A8]">
            <p>
              At ASHENRITUAL, we believe that true luxury does not shout. It is felt in the weight of the fabric, the precision of the cut, and the permanence of the design. We reject the ephemeral nature of seasonal trends in favor of intentional, timeless creation.
            </p>
            <p>
              Our philosophy is rooted in silence and architecture. A garment should act as a structural extension of the wearer—providing proportion, texture, and discipline. Every piece is engineered with a meticulous attention to detail, resulting in a wardrobe that is both profoundly understated and unmistakably present.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ── 3. Creative Process ─────────────────────────────────────────────────── */
const PROCESS_STEPS = [
  { id: '01', title: 'Research & Form', desc: 'Studying architectural silhouettes and industrial textures to inform the structural language of the collection.' },
  { id: '02', title: 'Material Selection', desc: 'Sourcing premium textiles globally—focusing on weight, drape, and durability to ensure generational longevity.' },
  { id: '03', title: 'Pattern Engineering', desc: 'Drafting precise geometries that move with the human form while maintaining rigid aesthetic discipline.' },
  { id: '04', title: 'Tailoring & Construction', desc: 'Executing each garment with uncompromising craftsmanship, where the unseen interior is as beautiful as the exterior.' },
];

function CreativeProcess() {
  return (
    <section className="w-full py-32 bg-[#0A0A0A] border-y border-[rgba(255,255,255,0.03)]">
      <div className="mx-auto max-w-screen-2xl px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20 text-center"
        >
          <span className="font-heading text-[10px] uppercase tracking-[0.4em] text-[#8D8D8D]">The Lifecycle</span>
          <h2 className="mt-4 font-display italic text-4xl lg:text-5xl text-[#FDFCFB]">The Creative Process</h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
          {PROCESS_STEPS.map((step, i) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.8, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="group relative flex flex-col"
            >
              <div className="text-[10px] font-mono tracking-widest text-[#4A4A4A] mb-6 pb-6 border-b border-[rgba(255,255,255,0.05)] transition-colors group-hover:border-[rgba(255,255,255,0.2)]">
                PHASE {step.id}
              </div>
              <h3 className="font-heading text-xl uppercase tracking-wide text-[#E8E8E8] mb-4">
                {step.title}
              </h3>
              <p className="font-sans text-[13px] leading-relaxed text-[#8D8D8D] group-hover:text-[#A8A8A8] transition-colors">
                {step.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── 4. Material Library ─────────────────────────────────────────────────── */
const MATERIALS = [
  { name: 'Japanese Heavyweight Cotton', origin: 'Okayama, Japan', texture: 'Dense, structured, matte', desc: 'Woven on vintage looms, this cotton provides an architectural rigidity that softens beautifully over years of wear.', img: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=1972&auto=format&fit=crop' },
  { name: 'Brushed Italian Wool', origin: 'Biella, Italy', texture: 'Soft, dense, heavy-drape', desc: 'A meticulously milled wool offering profound warmth and a fluid drape, engineered for the deepest winter months.', img: 'https://images.unsplash.com/photo-1616423640778-28d1b53229bd?q=80&w=2000&auto=format&fit=crop' },
  { name: 'Vegetable-Tanned Calfskin', origin: 'Tuscany, Italy', texture: 'Smooth, rigid, patinating', desc: 'Treated with natural tannins, this leather begins stiff and structural, molding uniquely to the wearer\'s anatomy over time.', img: 'https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?q=80&w=2070&auto=format&fit=crop' },
];

function MaterialLibrary() {
  return (
    <section className="w-full py-32 lg:py-48 px-6 lg:px-12 mx-auto max-w-screen-2xl">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="mb-16 lg:mb-24 flex flex-col lg:flex-row justify-between items-end gap-8 border-b border-[rgba(255,255,255,0.08)] pb-12"
      >
        <div>
          <h2 className="font-heading text-4xl lg:text-6xl uppercase tracking-tighter text-[#FDFCFB]">
            Material<br />Archive
          </h2>
        </div>
        <p className="max-w-md font-sans text-sm text-[#8D8D8D] leading-relaxed lg:text-right">
          The foundation of permanence. We source only textiles capable of aging with dignity—fabrics that tell a story of endurance and quality.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
        {MATERIALS.map((mat, i) => (
          <motion.div
            key={mat.name}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.8, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="group flex flex-col"
          >
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#111] mb-6">
              <Image
                src={mat.img}
                alt={mat.name}
                fill
                className="object-cover grayscale opacity-60 group-hover:scale-105 group-hover:opacity-100 transition-all duration-1000 ease-[0.22,1,0.36,1]"
                unoptimized
              />
            </div>
            <h3 className="font-heading text-lg uppercase tracking-wide text-[#E8E8E8] mb-2">{mat.name}</h3>
            <ul className="mb-4 space-y-1 font-mono text-[10px] uppercase tracking-widest text-[#4A4A4A]">
              <li>Origin: <span className="text-[#8D8D8D]">{mat.origin}</span></li>
              <li>Texture: <span className="text-[#8D8D8D]">{mat.texture}</span></li>
            </ul>
            <p className="font-sans text-[13px] leading-relaxed text-[#A8A8A8]">
              {mat.desc}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ── 5. Design Principles ────────────────────────────────────────────────── */
function DesignPrinciples() {
  const principles = ['Silence', 'Structure', 'Texture', 'Architecture', 'Utility', 'Precision', 'Permanence', 'Contrast'];
  
  return (
    <section className="w-full bg-[#FDFCFB] text-[#0A0A0A] py-32 lg:py-48 overflow-hidden">
      <div className="mx-auto max-w-screen-2xl px-6 lg:px-12 flex flex-col lg:flex-row gap-16 lg:gap-32">
        <div className="flex-1">
          <motion.h2
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="font-heading text-5xl lg:text-7xl font-bold uppercase tracking-tighter"
          >
            The Visual<br />Language
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-8 max-w-md font-sans text-lg font-medium text-[#4A4A4A] leading-relaxed"
          >
            Every piece is built upon a rigid framework of principles. These concepts dictate not just how a garment looks, but how it behaves and endures over time.
          </motion.p>
        </div>
        
        <div className="flex-1 grid grid-cols-2 gap-x-8 gap-y-12">
          {principles.map((word, i) => (
            <motion.div
              key={word}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="border-t border-[#0A0A0A]/20 pt-4"
            >
              <span className="font-display italic text-2xl lg:text-3xl">{word}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── 6. Seasonal Development ─────────────────────────────────────────────── */
const SEASONS = [
  { name: 'Vernal Silence', desc: 'Exploring the violent rebirth of spring through lightweight architectural layering.', img: '/images/chapters/Vernal Silence.jpg' },
  { name: 'Summer Afterglow', desc: 'A study in stark contrasts—shadow and light, breathable linens against brutalist concrete.', img: '/images/chapters/Summer Afterglow.jpg' },
  { name: 'Autumn Ashes', desc: 'The descent into darkness. Heavy cottons and deep earthy undertones reflecting decay.', img: '/images/chapters/Autumn Ashes.jpg' },
  { name: 'Winter Solitude', desc: 'Isolation engineered. Extreme thermal protection encased in absolute minimalist forms.', img: '/images/chapters/Winter Solitude.jpg' },
  { name: 'Monsoon Reverie', desc: 'Technical mastery meets fluidity. Water-repellent nylon behaving like liquid silk.', img: '/images/chapters/Monsoon Reverie.jpg' },
  { name: 'The White Hour', desc: 'Absolute reduction. The ultimate expression of our philosophy in pristine, untouched monochrome.', img: '/images/chapters/The White Hour.jpg' },
];

function SeasonalDevelopment() {
  return (
    <section className="w-full py-32 lg:py-48 bg-background">
      <div className="mx-auto max-w-screen-2xl px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-24"
        >
          <h2 className="font-heading text-4xl lg:text-5xl uppercase tracking-tighter text-[#FDFCFB] mb-6">
            Seasonal Evolution
          </h2>
          <p className="max-w-2xl mx-auto font-sans text-sm text-[#8D8D8D] leading-relaxed">
            Our Chapters are not merely collections; they are focused creative studies. Each season explores a specific aesthetic and philosophical theme, driving our pattern drafting, material sourcing, and campaign direction.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-16">
          {SEASONS.map((season, i) => (
            <motion.div
              key={season.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.8, delay: i * 0.1 }}
              className="group cursor-default"
            >
              <div className="relative aspect-square w-full overflow-hidden bg-[#111] mb-6">
                <Image
                  src={season.img}
                  alt={season.name}
                  fill
                  className="object-cover opacity-80 group-hover:scale-105 group-hover:opacity-100 transition-all duration-[1.5s] ease-[0.22,1,0.36,1]"
                  unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
              <h3 className="font-heading text-xl uppercase tracking-wide text-[#E8E8E8] mb-3">{season.name}</h3>
              <p className="font-sans text-[13px] leading-relaxed text-[#A8A8A8]">{season.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── 7. Inspiration Wall ─────────────────────────────────────────────────── */
const MASONRY_IMGS = [
  "https://images.unsplash.com/photo-1518640467707-6811f4a6ab73?q=80&w=2000&auto=format&fit=crop", // concrete
  "https://images.unsplash.com/photo-1507027682794-35e6c12ad5b4?q=80&w=1974&auto=format&fit=crop", // abstract architecture
  "https://images.unsplash.com/photo-1607419725910-66444da0807b?q=80&w=2070&auto=format&fit=crop", // minimal stairs
  "https://images.unsplash.com/photo-1594902128965-f93318b76c8c?q=80&w=2070&auto=format&fit=crop", // minimal interior
  "https://images.unsplash.com/photo-1524334228333-0f6db392f8a1?q=80&w=2070&auto=format&fit=crop", // texture abstract
  "https://images.unsplash.com/photo-1616423640778-28d1b53229bd?q=80&w=2000&auto=format&fit=crop", // fabric close up
];

function InspirationWall() {
  return (
    <section className="w-full py-32 lg:py-48 bg-[#050505] border-t border-[rgba(255,255,255,0.03)]">
      <div className="mx-auto max-w-screen-2xl px-6 lg:px-12">
        <div className="flex flex-col items-center text-center mb-24">
          <span className="font-heading text-[10px] uppercase tracking-[0.4em] text-[#8D8D8D]">Reference Material</span>
          <h2 className="mt-4 font-display italic text-4xl lg:text-5xl text-[#FDFCFB]">The Inspiration Wall</h2>
        </div>

        {/* Masonry Layout Simulation */}
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
          {MASONRY_IMGS.map((src, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: (i % 3) * 0.1 }}
              className="relative w-full overflow-hidden break-inside-avoid bg-[#111]"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt="Inspiration reference"
                className="w-full h-auto object-cover grayscale hover:grayscale-0 transition-all duration-1000"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── 8. Craftsmanship ────────────────────────────────────────────────────── */
function Craftsmanship() {
  return (
    <section className="relative w-full overflow-hidden border-t border-[rgba(255,255,255,0.05)] bg-[#0A0A0A]">
      <div className="grid grid-cols-1 lg:grid-cols-2">
        <div className="relative h-[60vh] lg:h-auto w-full">
          <Image
            src="https://images.unsplash.com/photo-1556909211-36987daf7b4d?q=80&w=2070&auto=format&fit=crop"
            alt="Tailoring"
            fill
            className="object-cover grayscale opacity-60"
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-transparent to-background hidden lg:block" />
        </div>
        <div className="flex flex-col justify-center px-8 py-24 lg:px-24 lg:py-48">
          <h2 className="font-heading text-4xl lg:text-6xl uppercase tracking-tighter text-[#FDFCFB] mb-8">
            The Anatomy<br />of Construction
          </h2>
          <div className="space-y-6 font-sans text-sm lg:text-base leading-relaxed text-[#A8A8A8]">
            <p>
              An ASHENRITUAL garment is defined as much by its hidden interior as its outward silhouette. We employ traditional tailoring techniques fused with modern industrial construction methods. French seams, reinforced stress points, and fully bound interiors ensure absolute longevity.
            </p>
            <p>
              Fabric weights are meticulously balanced to create architectural drape without sacrificing movement. It is a slow, methodical process that prioritizes durability and perfection over speed. 
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── 9. Studio Gallery ───────────────────────────────────────────────────── */
function StudioGallery() {
  const images = [
    "https://images.unsplash.com/photo-1556909211-36987daf7b4d?q=80&w=2070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=1972&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1507027682794-35e6c12ad5b4?q=80&w=1974&auto=format&fit=crop",
  ];

  return (
    <section className="w-full py-32 bg-background overflow-hidden border-t border-[rgba(255,255,255,0.03)]">
      <div className="px-6 lg:px-12 mb-16">
        <h2 className="font-heading text-[10px] uppercase tracking-[0.4em] text-[#8D8D8D]">Inside The Studio</h2>
      </div>
      
      {/* Horizontal scrolling gallery */}
      <div className="w-full flex overflow-x-auto snap-x snap-mandatory hide-scrollbar pb-12 px-6 lg:px-12 gap-6">
        {images.map((src, i) => (
          <div key={i} className="snap-center shrink-0 w-[85vw] md:w-[60vw] lg:w-[40vw] aspect-[4/3] relative bg-[#111]">
            <Image
              src={src}
              alt="Studio Gallery"
              fill
              className="object-cover grayscale hover:grayscale-0 transition-all duration-[2s]"
              unoptimized
            />
          </div>
        ))}
      </div>
    </section>
  );
}
