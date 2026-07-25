'use client';

import { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Clock, BookOpen } from 'lucide-react';

/* ── Data ───────────────────────────────────────────────────────────────── */

const FEATURED_ARTICLE = {
  date: 'July 2026',
  category: 'Design Philosophy',
  title: 'On the Discipline of Restraint',
  excerpt: 'Why removing is harder than adding — and why it matters in fashion. A meditation on the void as a design tool.',
  readTime: '8 min read',
  image: '/images/hero.png',
  href: '/journal/discipline-of-restraint',
};

const ARTICLES = [
  {
    date: 'June 2026',
    category: 'Architecture',
    title: 'The Architecture of a Coat',
    excerpt: 'How structural precision translates from concrete to cloth.',
    readTime: '5 min read',
    image: '/images/product.png',
    href: '/journal/architecture-of-a-coat',
  },
  {
    date: 'May 2026',
    category: 'Material Studies',
    title: 'Against Trend',
    excerpt: 'A meditation on permanence in an industry built on rapid, unsustainable disposability.',
    readTime: '12 min read',
    image: '/images/texture.png',
    href: '/journal/against-trend',
  },
  {
    date: 'April 2026',
    category: 'Process',
    title: 'Dyeing in the Dark',
    excerpt: 'The rigorous process of achieving the perfect, light-absorbing obsidian black.',
    readTime: '6 min read',
    image: '/images/hero.png',
    href: '/journal/dyeing-in-the-dark',
  },
  {
    date: 'March 2026',
    category: 'Philosophy',
    title: 'Silence in Noise',
    excerpt: 'Dressing as an act of resistance against the modern cacophony of branding.',
    readTime: '7 min read',
    image: '/images/product.png',
    href: '/journal/silence-in-noise',
  }
];

/* ── Components ───────────────────────────────────────────────────────────── */

export default function JournalPage() {
  const headerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: headerRef,
    offset: ['start start', 'end start'],
  });

  const headerY = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const headerOpacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

  return (
    <main className="min-h-screen bg-background pt-[60px] texture-grain overflow-x-hidden">
      
      {/* ── Header ───────────────────────────────────────────────────────────── */}
      <section ref={headerRef} className="relative flex flex-col items-center justify-center border-b border-border px-8 py-24 text-center lg:px-12 lg:py-32">
        <motion.div style={{ y: headerY, opacity: headerOpacity }} className="flex flex-col items-center">
          <p className="font-heading text-[10px] font-medium uppercase tracking-[0.4em] text-muted-foreground">
            Perspectives
          </p>
          <h1 className="mt-6 font-gothic text-6xl text-foreground md:text-8xl lg:text-[9rem] leading-none">
            Journal
          </h1>
          <p className="mt-8 max-w-lg font-serif text-lg leading-relaxed text-muted-foreground md:text-xl">
            On design. On materiality. On the philosophy of presence.
          </p>
        </motion.div>
      </section>

      {/* ── Featured Article ─────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-screen-2xl px-4 py-16 md:px-8 lg:py-24">
        <Link href={FEATURED_ARTICLE.href} className="group relative block overflow-hidden border border-border bg-card">
          <div className="grid lg:grid-cols-2">
            <div className="relative aspect-square w-full overflow-hidden lg:aspect-auto lg:h-full">
              <Image
                src={FEATURED_ARTICLE.image}
                alt={FEATURED_ARTICLE.title}
                fill
                className="object-cover transition-transform duration-[2000ms] group-hover:scale-105"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
              <div className="absolute inset-0 bg-black/20 transition-colors duration-500 group-hover:bg-transparent" />
            </div>
            
            <div className="flex flex-col justify-center p-8 md:p-16 lg:p-24">
              <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                <span>{FEATURED_ARTICLE.date}</span>
                <span className="h-1 w-1 bg-border rounded-full" />
                <span>{FEATURED_ARTICLE.category}</span>
              </div>
              
              <h2 className="mt-8 font-gothic text-5xl text-foreground md:text-6xl lg:text-7xl">
                {FEATURED_ARTICLE.title}
              </h2>
              
              <p className="mt-6 font-serif text-lg leading-relaxed text-muted-foreground md:text-xl">
                {FEATURED_ARTICLE.excerpt}
              </p>
              
              <div className="mt-12 flex items-center justify-between border-t border-border pt-8">
                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-foreground">
                  <Clock className="h-3 w-3" />
                  {FEATURED_ARTICLE.readTime}
                </div>
                <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.3em] text-foreground transition-all duration-300 group-hover:gap-5">
                  Read Essay
                  <ArrowRight className="h-3 w-3" />
                </div>
              </div>
            </div>
          </div>
        </Link>
      </section>

      {/* ── Article Grid ─────────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-screen-2xl px-4 pb-32 md:px-8">
        <div className="mb-12 flex items-center justify-between border-b border-border pb-6">
          <h3 className="font-heading text-[10px] font-bold uppercase tracking-[0.3em] text-foreground">
            Previous Entries
          </h3>
          <BookOpen className="h-4 w-4 text-muted-foreground" />
        </div>

        <div className="grid grid-cols-1 gap-x-8 gap-y-16 md:grid-cols-2 lg:grid-cols-2">
          {ARTICLES.map((article, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: (i % 2) * 0.1, duration: 0.6 }}
            >
              <Link href={article.href} className="group flex flex-col h-full">
                <div className="relative aspect-[16/9] w-full overflow-hidden border border-border bg-card">
                  <Image
                    src={article.image}
                    alt={article.title}
                    fill
                    className="object-cover opacity-80 transition-all duration-[1500ms] group-hover:scale-105 group-hover:opacity-100"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
                
                <div className="mt-8 flex flex-col flex-1">
                  <div className="flex items-center gap-3 text-[9px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                    <span>{article.category}</span>
                    <span className="h-px w-4 bg-border" />
                    <span>{article.date}</span>
                  </div>
                  
                  <h4 className="mt-4 font-gothic text-3xl text-foreground md:text-4xl transition-colors duration-300 group-hover:text-muted-foreground">
                    {article.title}
                  </h4>
                  
                  <p className="mt-4 flex-1 font-serif text-base leading-relaxed text-muted-foreground">
                    {article.excerpt}
                  </p>
                  
                  <div className="mt-8 flex items-center justify-between border-t border-border pt-4">
                    <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                      {article.readTime}
                    </span>
                    <ArrowRight className="h-3 w-3 text-foreground transition-transform duration-300 group-hover:translate-x-2" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
        
        {/* Load More (Mock) */}
        <div className="mt-24 flex justify-center border-t border-border pt-16">
          <button className="group flex items-center justify-center border border-border bg-card px-12 py-4 font-heading text-[10px] font-bold uppercase tracking-[0.3em] text-foreground transition-colors hover:bg-foreground hover:text-background">
            Load Archive
          </button>
        </div>
      </section>

    </main>
  );
}
