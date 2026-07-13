import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Chapters — ASHENRITUAL',
  description: 'Curated collections by ASHENRITUAL. Each chapter tells a story of intentional design.',
};

/* Static chapter data — replaces API until DB is seeded */
const CHAPTERS = [
  {
    slug: 'foundation',
    name: 'Foundation',
    label: 'Chapter 001',
    description: 'The timeless pieces that anchor every wardrobe. Precision-cut staples designed for quiet permanence.',
    count: '12 pieces',
    image: '/images/hero.png',
  },
  {
    slug: 'forged-today',
    name: 'Forged Today',
    label: 'Chapter 002',
    description: 'New arrivals forged with deliberate intention. Contemporary silhouettes that speak softly.',
    count: '8 pieces',
    image: '/images/product.png',
  },
  {
    slug: 'epoch',
    name: 'Epoch',
    label: 'Chapter 003',
    description: 'Limited-run pieces that define a moment. Once they are gone, they do not return.',
    count: '4 pieces',
    image: '/images/texture.png',
  },
  {
    slug: 'nocturne',
    name: 'Nocturne',
    label: 'Chapter 004',
    description: 'After dark. The silhouettes that command presence when the world quiets down.',
    count: '6 pieces',
    image: '/images/hero.png',
  },
];

export default function ChaptersPage() {
  return (
    <main className="min-h-screen bg-background pt-[60px] texture-grain">
      {/* Header */}
      <div className="mx-auto max-w-screen-xl px-8 py-16 lg:px-12">
        <p className="font-heading text-[10px] font-medium uppercase tracking-[0.35em] text-[#8D8D8D]">
          Collections
        </p>
        <h1 className="mt-3 font-heading text-5xl font-semibold uppercase tracking-[0.06em] text-[#E8E8E8] md:text-7xl">
          Chapters
        </h1>
        <p className="mt-3 max-w-md text-[13px] leading-relaxed text-[#8D8D8D]">
          Each chapter is a curated body of work. A collection of silhouettes that share a single design intention.
        </p>
      </div>

      {/* Chapter grid — alternating full/split layouts */}
      <div className="mx-auto max-w-screen-xl px-8 pb-24 lg:px-12">
        {CHAPTERS.map((chapter, i) => {
          const isEven = i % 2 === 0;
          return (
            <Link
              key={chapter.slug}
              href={`/chapters/${chapter.slug}`}
              className="group mb-4 flex flex-col border border-[#202020] transition-colors duration-500 hover:border-[#E8E8E8]/20 md:grid md:grid-cols-2"
            >
              {/* Image — alternates position */}
              <div className={`relative aspect-[16/9] overflow-hidden bg-card md:aspect-auto md:min-h-[380px] ${!isEven ? 'md:order-2' : ''}`}>
                <Image
                  src={chapter.image}
                  alt={chapter.name}
                  fill
                  className="object-cover transition-transform duration-[1200ms] group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-black/30 transition-opacity duration-700 group-hover:bg-black/40" />
              </div>

              {/* Content */}
              <div className={`flex flex-col justify-between p-10 lg:p-14 ${!isEven ? 'md:order-1' : ''}`}>
                <div>
                  <p className="font-heading text-[9px] font-medium uppercase tracking-[0.4em] text-[#8D8D8D]">
                    {chapter.label} — {chapter.count}
                  </p>
                  <h2 className="mt-4 font-heading text-4xl font-semibold uppercase tracking-[0.06em] text-[#E8E8E8] md:text-5xl">
                    {chapter.name}
                  </h2>
                  <p className="mt-5 max-w-sm text-[13px] leading-relaxed text-[#8D8D8D]">
                    {chapter.description}
                  </p>
                </div>

                <div className="mt-10 flex items-center gap-4 text-[10px] font-medium uppercase tracking-[0.3em] text-[#8D8D8D] group-hover:text-[#E8E8E8] transition-colors duration-500">
                  Explore Chapter
                  <ArrowRight className="h-3.5 w-3.5 transition-transform duration-500 group-hover:translate-x-2" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </main>
  );
}
