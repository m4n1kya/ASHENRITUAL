import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Lookbook — ASHENRITUAL',
  description: 'Editorial fashion photography from ASHENRITUAL. The aesthetic of restraint, captured in every frame.',
};

/* Reference: "THE LOOKBOOK — MANUALS" with numbered form entries,
   large editorial images, side-by-side layout with arrows */

const EDITORIALS = [
  {
    id: 'form-1',
    label: 'Form 1',
    title: 'Foundation',
    subtitle: 'The architecture of restraint.',
    image: '/images/hero.png',
    href: '/chapters/foundation',
  },
  {
    id: 'form-2',
    label: 'Form 2',
    title: 'Forged Today',
    subtitle: 'Permanence through precision.',
    image: '/images/product.png',
    href: '/chapters/forged-today',
  },
  {
    id: 'layering-1',
    label: 'Layering 1',
    title: 'Epoch',
    subtitle: 'When restraint meets dimension.',
    image: '/images/texture.png',
    href: '/chapters/epoch',
  },
  {
    id: 'layering-2',
    label: 'Layering 2',
    title: 'Nocturne',
    subtitle: 'After-dark silhouettes.',
    image: '/images/hero.png',
    href: '/shop',
  },
];

const MATERIAL_STUDIES = [
  { label: 'Concrete', image: '/images/texture.png' },
  { label: 'Stone', image: '/images/product.png' },
  { label: 'Leather', image: '/images/hero.png' },
  { label: 'Paper', image: '/images/texture.png' },
  { label: 'Brushed Metal', image: '/images/product.png' },
  { label: 'Film Grain', image: '/images/hero.png' },
];

export default function LookbookPage() {
  return (
    <main className="min-h-screen bg-background pt-[60px] texture-grain">
      {/* ── Header ───────────────────────────────────────────────────────────── */}
      <div className="mx-auto max-w-screen-xl px-8 py-16 lg:px-12">
        <p className="font-heading text-[10px] font-medium uppercase tracking-[0.35em] text-[#8D8D8D]">
          The Lookbook
        </p>
        <h1 className="mt-3 font-heading text-5xl font-semibold uppercase tracking-[0.06em] text-[#E8E8E8] md:text-7xl lg:text-9xl">
          Manuals
        </h1>
        <div className="mt-6 flex items-center justify-between border-b border-[#202020] pb-8">
          <p className="text-[13px] leading-relaxed text-[#8D8D8D]">
            Visual language for the considered wardrobe.<br />
            Each frame deliberate. Each silhouette precise.
          </p>
          <Link
            href="/shop"
            className="hidden items-center gap-2 text-[10px] font-medium uppercase tracking-[0.25em] text-[#8D8D8D] hover:text-[#E8E8E8] transition-colors duration-300 md:flex"
          >
            View All
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </div>

      {/* ── Editorial Strip — reference: horizontal row with arrows ──────────── */}
      <div className="mx-auto max-w-screen-xl px-8 lg:px-12">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {EDITORIALS.map((item, i) => (
            <Link key={item.id} href={item.href} className="group">
              <div className="relative aspect-[3/4] overflow-hidden bg-card">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  priority={i < 2}
                  className="object-cover transition-transform duration-[1200ms] group-hover:scale-105"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A]/60 via-transparent to-transparent" />
              </div>
              <div className="mt-4 flex items-start justify-between">
                <div>
                  <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-[#8D8D8D]">{item.label}</p>
                  <p className="mt-1 text-[13px] font-medium text-[#E8E8E8]">{item.title}</p>
                </div>
                <ArrowUpRight className="mt-0.5 h-3.5 w-3.5 text-[#8D8D8D] transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[#E8E8E8]" />
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* ── Material Studies ─────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-screen-xl px-8 py-20 lg:px-12">
        <div className="flex items-end justify-between border-b border-[#202020] pb-8 mb-10">
          <div>
            <p className="font-heading text-[10px] font-medium uppercase tracking-[0.35em] text-[#8D8D8D]">
              Curated Design Elements
            </p>
            <h2 className="mt-3 font-heading text-3xl font-semibold uppercase tracking-[0.08em] text-[#E8E8E8]">
              Material Studies
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 md:grid-cols-6">
          {MATERIAL_STUDIES.map((mat) => (
            <div key={mat.label} className="group">
              <div className="relative aspect-square overflow-hidden bg-card border border-[#202020]">
                <Image
                  src={mat.image}
                  alt={mat.label}
                  fill
                  className="object-cover opacity-60 transition-opacity duration-700 group-hover:opacity-80"
                  sizes="(max-width: 768px) 33vw, 16vw"
                />
              </div>
              <p className="mt-3 text-[10px] font-medium uppercase tracking-[0.25em] text-[#8D8D8D] group-hover:text-[#E8E8E8] transition-colors duration-300">
                {mat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Vesper CTA Strip ─────────────────────────────────────────────────── */}
      <section className="border-t border-[#202020] bg-[#0E0E0E]">
        <div className="mx-auto flex max-w-screen-xl flex-col items-start gap-6 px-8 py-16 md:flex-row md:items-center md:justify-between lg:px-12">
          <div>
            <p className="font-heading text-[10px] font-medium uppercase tracking-[0.35em] text-[#8D8D8D]">
              Wardrobe Intelligence
            </p>
            <h2 className="mt-3 font-heading text-3xl font-semibold uppercase tracking-[0.06em] text-[#E8E8E8]">
              Let Vesper Complete Your Ritual
            </h2>
            <p className="mt-3 max-w-md text-[13px] leading-relaxed text-[#8D8D8D]">
              Translate these editorials into your wardrobe. Vesper analyzes occasion, season, and silhouette to build a complete outfit.
            </p>
          </div>
          <Link
            href="/vesper"
            className="group flex h-11 shrink-0 items-center gap-4 border border-[#202020] px-8 text-[10px] font-medium uppercase tracking-[0.25em] text-[#8D8D8D] transition-all duration-500 hover:border-[#E8E8E8]/30 hover:text-[#E8E8E8]"
          >
            Consult Vesper
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-500 group-hover:translate-x-1" />
          </Link>
        </div>
      </section>
    </main>
  );
}
