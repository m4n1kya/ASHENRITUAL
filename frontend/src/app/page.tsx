'use client';

import { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { ArrowRight, Plus, Hourglass } from 'lucide-react';

/* ─── Motion ─────────────────────────────────────────────────────────────── */
const E = [0.4, 0, 0.2, 1] as const;
const SLOW   = { duration: 0.8, ease: E };
const MEDIUM = { duration: 0.5, ease: E };

/* ─── Hourly rotating quotes ─────────────────────────────────────────────── */
const QUOTES = [
  { q: 'Fashion changes, but style endures.',                                 author: 'Coco Chanel'            },
  { q: 'Simplicity is the ultimate sophistication.',                          author: 'Leonardo da Vinci'      },
  { q: 'Elegance is elimination.',                                            author: 'Cristóbal Balenciaga'   },
  { q: 'Luxury must be comfortable, otherwise it is not luxury.',             author: 'Coco Chanel'            },
  { q: 'Clothes mean nothing until someone lives in them.',                   author: 'Marc Jacobs'            },
  { q: 'The details are not the details. They make the design.',              author: 'Charles Eames'          },
  { q: 'God is in the details.',                                              author: 'Ludwig Mies van der Rohe'},
  { q: 'Quality is remembered long after price is forgotten.',                author: 'Aldo Gucci'             },
];
function useHourlyQuote() {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    setIdx(Math.floor(Date.now() / 3_600_000) % QUOTES.length);
    const t = setInterval(() => setIdx(i => (i + 1) % QUOTES.length), 3_600_000);
    return () => clearInterval(t);
  }, []);
  return QUOTES[idx];
}

/* ─── Static product strip ───────────────────────────────────────────────── */
const FORGED = [
  { id: '1', name: 'Noir Coat',              price: '₹ 18,990',  img: '/images/hero.png'    },
  { id: '2', name: 'Structure Trousers',     price: '₹ 11,490',  img: '/images/texture.png' },
  { id: '3', name: 'Ribbed Knit Turtleneck', price: '₹ 8,200',   img: '/images/product.png' },
  { id: '4', name: 'Raw Edge Shirt',         price: '₹ 5,300',   img: '/images/hero.png'    },
];

/* ══════════════════════════════════════════════════════════════════════════
   HOMEPAGE
══════════════════════════════════════════════════════════════════════════ */
export default function HomePage() {
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const imgY   = useTransform(scrollYProgress, [0, 1], ['0%', '12%']);
  const heroOp = useTransform(scrollYProgress, [0, 0.75], [1, 0]);
  
  const bannerRef = useRef<HTMLElement>(null);
  const { scrollYProgress: bannerScroll } = useScroll({ target: bannerRef, offset: ['start end', 'end start'] });
  const bannerOp = useTransform(bannerScroll, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);

  const quote  = useHourlyQuote();

  return (
    <div className="min-h-screen bg-background">

      {/* ════════════════════════════════════════════════════════════════════
          HERO — exact reference layout:
          • "PRESENCE ISN'T PURCHASED." — large Cormorant Garamond, bottom-left
          • Blueprint grid lines overlay (faint technical lines)
          • Right side: 01 … 05 slide counter with dots + vertical line
          • Bottom-left: 001
          • Bottom-right: ANCIENT. PERMANENT. RITUALISTIC.
      ════════════════════════════════════════════════════════════════════ */}
      <section ref={heroRef} className="keep-light-text relative h-screen w-full overflow-hidden" aria-label="Hero">

        {/* ── Background image — parallax ── */}
        <motion.div style={{ y: imgY }} className="absolute inset-0 z-0 will-change-transform">
          <Image
            src="/images/home-hero.jpg"
            alt="ASHENRITUAL — Presence isn't purchased"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
            quality={100}
            unoptimized
          />
          {/* Gradient: heavy on left for text legibility, bottom fade to site bg */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0A]/85 via-[#0A0A0A]/30 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A]/90 via-transparent to-[#0A0A0A]/40" />
        </motion.div>

        {/* ── Blueprint / Technical grid overlay — reference shows faint geometric lines ── */}
        <motion.div
          style={{ opacity: heroOp }}
          className="pointer-events-none absolute inset-0 z-10"
          aria-hidden="true"
        >
          {/* Left-side vertical lines */}
          <svg className="absolute inset-0 h-full w-full opacity-[0.08]" preserveAspectRatio="none">
            {/* Horizontal rule near top */}
            <line x1="0" y1="12%" x2="38%" y2="12%" stroke="#FDFCFB" strokeWidth="0.5" />
            {/* Vertical line left */}
            <line x1="6%" y1="0" x2="6%" y2="100%" stroke="#FDFCFB" strokeWidth="0.5" />
            {/* Small crosshair top-left */}
            <line x1="5.5%" y1="11.5%" x2="6.5%" y2="11.5%" stroke="#FDFCFB" strokeWidth="0.8" />
            <line x1="6%" y1="11%" x2="6%" y2="12%" stroke="#FDFCFB" strokeWidth="0.8" />
            {/* Bottom horizontal rule */}
            <line x1="0" y1="88%" x2="38%" y2="88%" stroke="#FDFCFB" strokeWidth="0.5" />
            {/* Corner crosshair bottom-left */}
            <line x1="5.5%" y1="88%" x2="6.5%" y2="88%" stroke="#FDFCFB" strokeWidth="0.8" />
            <line x1="6%" y1="87.5%" x2="6%" y2="88.5%" stroke="#FDFCFB" strokeWidth="0.8" />
            {/* Mid vertical dashed */}
            <line x1="32%" y1="10%" x2="32%" y2="90%" stroke="#FDFCFB" strokeWidth="0.4" strokeDasharray="2 8" />
            {/* Subtle horizontal rule mid */}
            <line x1="6%" y1="60%" x2="32%" y2="60%" stroke="#FDFCFB" strokeWidth="0.4" />
          </svg>
        </motion.div>

        {/* ── Right side: Subtle Tailor's Tape ── */}
        <motion.div
          style={{ opacity: heroOp }}
          className="absolute right-0 top-0 z-20 flex h-full w-12 items-center justify-end"
          aria-hidden="true"
        >
          {/* Infinite Vertical Tailor's Measuring Tape (Sophisticated) */}
          <div className="relative h-full w-12 border-l border-[rgba(255,255,255,0.04)] overflow-hidden">
            <motion.div
              animate={{ y: ['-50%', '0%'] }}
              transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
              className="flex w-full flex-col pt-10"
            >
              {/* Loop the tape twice to make it infinite */}
              {[0, 1].map((loopIdx) => (
                <div key={loopIdx} className="w-full">
                  {[...Array(100)].map((_, i) => (
                    <div key={i} className="flex w-full items-center justify-end pr-3" style={{ height: '30px' }}>
                      {i % 10 === 0 ? (
                        <>
                          <span className="font-sans text-[10px] tracking-widest text-[#8D8D8D] mr-3 -rotate-90 origin-right translate-x-1 opacity-60">
                            {i.toString().replace(/[0-9]/g, d => '०१२३४५६७८९'[parseInt(d)])}
                          </span>
                          <div className="h-[1px] w-4 bg-[#8D8D8D]/40" />
                        </>
                      ) : i % 5 === 0 ? (
                        <div className="h-[1px] w-2.5 bg-[#8D8D8D]/30" />
                      ) : (
                        <div className="h-[1px] w-1.5 bg-[#8D8D8D]/15" />
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </motion.div>
          </div>
        </motion.div>

        {/* ── Main text content — bottom-left ── */}
        <motion.div
          style={{ opacity: heroOp }}
          className="absolute bottom-0 left-0 z-20 px-8 pb-20 md:px-14"
        >
          <div className="keep-light-text max-w-[480px]">
            {/* MAIN HEADLINE — Gothic font, all caps */}
            <motion.h1
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...SLOW, delay: 0.45 }}
              className="mt-4 font-gothic leading-[1.0] text-[#FDFCFB]"
              style={{
                fontSize: 'clamp(3.5rem, 8vw, 6.5rem)',
                fontWeight: 400,
                letterSpacing: '0.02em',
                fontStyle: 'normal',
              }}
            >
              DESIGNED<br />
              WITH<br />
              INTENT.
            </motion.h1>

            {/* Body */}
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...SLOW, delay: 0.8 }}
              className="mt-5 max-w-[340px] text-[12px] leading-relaxed text-[#8D8D8D] keep-light-text"
            >
              AshenRitual is not about trends. It&apos;s about
              timeless design, intentional craft, and the discipline
              to choose less.
            </motion.p>

            {/* CTA — exact reference: outlined, "EXPLORE THE RITUAL →" */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...SLOW, delay: 0.95 }}
              className="mt-9"
            >
              <Link
                href="/shop"
                className="group inline-flex h-11 items-center gap-5 border border-[#FDFCFB]/30 px-7 font-heading text-[10px] font-medium uppercase tracking-[0.25em] text-[#FDFCFB] transition-all duration-500 hover:border-[#FDFCFB] hover:bg-[#FDFCFB] hover:text-[#0A0A0A]"
              >
                Explore the Ritual
                <ArrowRight className="h-3.5 w-3.5 transition-transform duration-500 group-hover:translate-x-1.5" strokeWidth={1.5} />
              </Link>
            </motion.div>
          </div>
        </motion.div>

        {/* ── Bottom-left: "001" ── */}
        <motion.div
          style={{ opacity: heroOp }}
          className="absolute bottom-8 left-8 z-20"
          aria-hidden="true"
        >
          <span className="font-heading text-[10px] font-medium tracking-[0.3em] text-[#8D8D8D]/50">001</span>
          {/* Short horizontal rule after it */}
          <div className="mt-1 h-px w-16 bg-[#202020]" />
        </motion.div>

        {/* ── Bottom-right: "ANCIENT. PERMANENT. RITUALISTIC." ── */}
        <motion.div
          style={{ opacity: heroOp }}
          className="absolute bottom-8 right-8 z-20 text-right"
          aria-hidden="true"
        >
          {['Ancient.', 'Permanent.', 'Ritualistic.'].map((word, i) => (
            <motion.p
              key={word}
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ ...MEDIUM, delay: 1.2 + i * 0.1 }}
              className="font-heading text-[9px] font-medium uppercase tracking-[0.3em] text-[#8D8D8D]/60"
            >
              {word}
            </motion.p>
          ))}
        </motion.div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          FORGED TODAY — Product strip below hero
      ════════════════════════════════════════════════════════════════════ */}
      <section className="border-t border-[#202020]">
        <div className="mx-auto max-w-screen-xl px-8 py-12 lg:px-12">
          {/* Header */}
          <div className="mb-8 flex items-baseline justify-between">
            <div>
              <h2 className="font-heading text-[11px] font-semibold uppercase tracking-[0.3em] text-[#FDFCFB]">
                Forged Today
              </h2>
              <p className="mt-1 text-[11px] text-[#8D8D8D]">New arrivals crafted by the Ashen Ritual.</p>
            </div>
            <Link href="/shop" className="font-heading text-[9px] font-medium uppercase tracking-[0.3em] text-[#8D8D8D] hover:text-[#FDFCFB] transition-colors duration-300">
              View All
            </Link>
          </div>

          {/* 4-column product grid */}
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {FORGED.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ ...MEDIUM, delay: i * 0.08 }}
              >
                <Link href={`/products/${p.id}`} className="group block">
                  <div className="relative aspect-[3/4] overflow-hidden bg-card">
                    <Image
                      src={p.img}
                      alt={p.name}
                      fill
                      sizes="(max-width: 768px) 50vw, 25vw"
                      className="object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:scale-[1.04]"
                    />
                    <div className="absolute inset-0 bg-black/0 transition-[background-color] duration-700 group-hover:bg-black/20" />
                  </div>
                  <div className="mt-3 space-y-1">
                    <p className="text-[12px] font-medium text-[#FDFCFB]">{p.name}</p>
                    <p className="text-[11px] text-[#8D8D8D]">{p.price}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          EDITORIAL BANNER — Dark Stone Carved Banner
      ════════════════════════════════════════════════════════════════════ */}
      <section ref={bannerRef} className="relative w-full border-t border-[rgba(255,255,255,0.08)] bg-black">
        <motion.div
          style={{ opacity: bannerOp }}
          className="relative flex aspect-[4/3] w-full items-center justify-center overflow-hidden md:aspect-[21/9]"
        >
          <Image
            src="/images/vesper-texture.jpg"
            alt="Editorial"
            fill
            sizes="100vw"
            className="object-cover brightness-75 opacity-90"
            priority={false}
          />
          
          {/* High Contrast Quote */}
          <div className="pointer-events-none absolute inset-0 z-10 flex flex-col items-start justify-center p-8 px-12 md:px-24 text-left">
            <h2 className="max-w-3xl font-sans text-2xl font-medium leading-tight tracking-wide text-[#A8A8A8] sm:text-4xl md:text-5xl lg:text-5xl drop-shadow-md">
              &ldquo;Elegance is elimination.&rdquo;
            </h2>
            <p className="mt-6 font-sans text-[10px] font-semibold uppercase tracking-[0.4em] text-[#8D8D8D]">
              — Cristóbal Balenciaga
            </p>
          </div>
        </motion.div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          PHILOSOPHY
      ════════════════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-background">
        <div className="relative z-10 mx-auto max-w-screen-xl px-8 py-0 pb-24 lg:px-12 lg:pb-32">
          {/* Accordion header */}
          <div className="border-t border-[#202020]">
            <div className="flex items-center justify-between py-5">
              <span className="font-heading text-[10px] font-semibold uppercase tracking-[0.35em] text-[#FDFCFB]">
                Our Philosophy
              </span>
              <Plus className="h-4 w-4 text-[#8D8D8D]" strokeWidth={1.5} />
            </div>
          </div>

          {/* Principles + dark image — 4 cells */}
          <div className="grid grid-cols-1 gap-px bg-[#202020] sm:grid-cols-2 lg:grid-cols-4">
            {[
              { n: '01', t: 'Intentional', d: 'We design with purpose. Nothing is accidental.' },
              { n: '02', t: 'Precise',     d: 'Every detail serves a function.' },
              { n: '03', t: 'Timeless',    d: 'Built to outlast trends. Made to endure.' },
            ].map(({ n, t, d }, i) => (
              <motion.div
                key={n}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ ...MEDIUM, delay: i * 0.1 }}
                className="bg-background p-8"
              >
                <span className="font-display text-4xl font-light italic text-[#1A1A1A] select-none">{n}</span>
                <h3 className="mt-4 font-heading text-[10px] font-semibold uppercase tracking-[0.3em] text-[#FDFCFB]">{t}</h3>
                <p className="mt-3 text-[12px] leading-relaxed text-[#8D8D8D]">{d}</p>
              </motion.div>
            ))}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ ...MEDIUM, delay: 0.3 }}
              className="relative aspect-[4/3] overflow-hidden bg-card lg:aspect-auto"
            >
              <Image src="/images/texture.png" alt="Material texture" fill sizes="25vw" className="object-cover opacity-40" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A]/80 to-transparent" />
              <div className="absolute bottom-5 left-5">
                <p className="font-heading text-[7px] uppercase tracking-[0.4em] text-[#8D8D8D]/60">
                  Finest ground concrete — 77°S CAE
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          HOURLY QUOTE
      ════════════════════════════════════════════════════════════════════ */}
      <section className="border-t border-[#202020]">
        <div className="mx-auto flex max-w-screen-lg items-center justify-center px-8 py-24 text-center lg:py-32">
          <AnimatePresence mode="wait">
            <motion.div
              key={quote.q}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 1.2, ease: E }}
            >
              <p
                className="font-display font-light italic leading-snug text-[#FDFCFB]/55"
                style={{ fontSize: 'clamp(1.6rem, 4vw, 3.5rem)' }}
              >
                &lsquo;{quote.q}&rsquo;
              </p>
              <p className="mt-8 font-heading text-[9px] font-medium uppercase tracking-[0.4em] text-[#8D8D8D]">
                — {quote.author}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          VESPER SECTION
      ════════════════════════════════════════════════════════════════════ */}
      <section className="border-t border-[#202020]">
        <div className="mx-auto max-w-screen-xl px-8 py-20 lg:px-12 lg:py-28">
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-2 lg:gap-24">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={SLOW}
              className="flex flex-col justify-center"
            >
              <p className="font-heading text-[9px] font-medium uppercase tracking-[0.4em] text-[#8D8D8D]">
                Wardrobe Intelligence
              </p>
              <h2 className="mt-4 font-heading text-5xl font-extrabold uppercase tracking-tight text-[#FDFCFB] md:text-7xl">
                Vesper
              </h2>
              <p className="mt-6 font-display text-xl font-light italic leading-relaxed text-[#FDFCFB]/45 md:text-2xl">
                How does form express intent?<br />
                Can a garment hold history?
              </p>
              <p className="mt-5 text-[12px] leading-relaxed text-[#8D8D8D]">
                Vesper observes. Vesper analyses. Vesper refines.
                Share your occasion — receive a wardrobe built on restraint.
              </p>
              <div className="mt-8">
                <Link href="/vesper" className="group inline-flex h-11 items-center gap-5 border border-[#FDFCFB]/20 px-7 font-heading text-[10px] font-medium uppercase tracking-[0.25em] text-[#FDFCFB] transition-all duration-500 hover:border-[#FDFCFB] hover:bg-[#FDFCFB] hover:text-[#0A0A0A]">
                  Consult Vesper
                  <ArrowRight className="h-3.5 w-3.5 transition-transform duration-500 group-hover:translate-x-1.5" strokeWidth={1.5} />
                </Link>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ ...SLOW, delay: 0.2 }}
              className="relative aspect-[4/5] overflow-hidden border border-[#202020]"
            >
              <Image src="/images/product.png" alt="Vesper — The Silent Curator" fill sizes="50vw" className="object-cover opacity-50" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          NEWSLETTER
      ════════════════════════════════════════════════════════════════════ */}
      <section className="border-t border-[#202020]">
        <div className="mx-auto flex max-w-screen-md flex-col items-center px-8 py-20 text-center">
          <p className="font-heading text-[9px] font-medium uppercase tracking-[0.4em] text-[#8D8D8D]">
            Stay in the Ritual
          </p>
          <h2 className="mt-4 font-heading text-lg font-semibold uppercase tracking-[0.15em] text-[#FDFCFB]">
            Early access. Editorials. Intentions.
          </h2>
          <form onSubmit={e => e.preventDefault()} className="mt-10 flex w-full max-w-sm">
            <input
              type="email"
              placeholder="Enter your email"
              aria-label="Email for newsletter"
              className="flex-1 border border-r-0 border-[#202020] bg-transparent px-4 py-3 text-[12px] text-[#FDFCFB] placeholder:text-[#8D8D8D]/40 focus:border-[#FDFCFB]/20 focus:outline-none transition-colors duration-300"
            />
            <button
              type="submit"
              aria-label="Subscribe"
              className="flex h-full items-center justify-center border border-[#202020] bg-transparent px-5 text-[#8D8D8D] hover:border-[#FDFCFB]/20 hover:text-[#FDFCFB] transition-all duration-300"
            >
              <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
