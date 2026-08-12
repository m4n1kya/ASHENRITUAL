import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { ScrollReveal } from '@/components/ui/ScrollReveal';

export const metadata: Metadata = {
  title: 'Chapters — ASHENRITUAL',
  description: 'Curated poetic collections by ASHENRITUAL. Each chapter tells a story of intentional design.',
};

interface Chapter {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  _count?: {
    products: number;
  };
}

async function getChapters(): Promise<Chapter[]> {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
  try {
    const res = await fetch(`${API_URL}/chapters`, { cache: 'no-store' });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export default async function ChaptersPage() {
  const chapters = await getChapters();

  return (
    <main className="min-h-screen bg-background pt-[60px] texture-grain">
      {/* Header */}
      <div className="mx-auto max-w-screen-xl px-8 py-16 lg:px-12 text-center md:text-left">
        <p className="font-heading text-[10px] font-medium uppercase tracking-[0.35em] text-[#8D8D8D]">
          Collections
        </p>
        <h1 className="mt-3 font-heading text-5xl font-semibold uppercase tracking-[0.06em] text-[#E8E8E8] md:text-7xl">
          Chapters
        </h1>
        <p className="mt-3 max-w-md text-[13px] leading-relaxed text-[#8D8D8D] mx-auto md:mx-0">
          The seasons, translated into fabric. A poetic exploration of silhouettes shaped by the passing of time.
        </p>
      </div>

      {/* Chapter grid — alternating full/split layouts */}
      <div className="mx-auto max-w-screen-xl px-8 pb-24 lg:px-12">
        {chapters.map((chapter, i) => {
          const isEven = i % 2 === 0;
          const count = chapter._count?.products || 0;
          
          return (
            <ScrollReveal key={chapter.id} delay={isEven ? 0 : 0.1}>
              <Link
                href={`/chapters/${chapter.slug}`}
                className="group mb-8 flex flex-col border border-[#202020] transition-colors duration-500 hover:border-[#E8E8E8]/20 md:grid md:grid-cols-2"
              >
                {/* Image — alternates position */}
                <div className={`relative aspect-[16/9] overflow-hidden bg-card md:aspect-auto md:min-h-[480px] ${!isEven ? 'md:order-2' : ''}`}>
                  <Image
                    src={chapter.image || '/images/hero.png'}
                    alt={chapter.name}
                    fill
                    className="object-cover transition-transform duration-[2000ms] group-hover:scale-[1.03]"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-black/40 transition-opacity duration-1000 group-hover:bg-black/50" />
                </div>

                {/* Content */}
                <div className={`flex flex-col justify-between p-10 lg:p-14 ${!isEven ? 'md:order-1' : ''}`}>
                  <div>
                    <p className="font-heading text-[9px] font-medium uppercase tracking-[0.4em] text-[#8D8D8D]">
                      Chapter {String(i + 1).padStart(3, '0')} — {count} piece{count !== 1 ? 's' : ''}
                    </p>
                    <h2 className="mt-4 font-heading text-4xl font-semibold uppercase tracking-[0.06em] text-[#E8E8E8] md:text-5xl leading-tight">
                      {chapter.name}
                    </h2>
                    <p className="mt-6 max-w-sm text-[13px] leading-relaxed text-[#8D8D8D]">
                      {chapter.description}
                    </p>
                  </div>

                  <div className="mt-12 flex items-center gap-4 text-[10px] font-medium uppercase tracking-[0.3em] text-[#8D8D8D] group-hover:text-[#E8E8E8] transition-colors duration-500">
                    Explore Chapter
                    <ArrowRight className="h-3.5 w-3.5 transition-transform duration-500 group-hover:translate-x-2" />
                  </div>
                </div>
              </Link>
            </ScrollReveal>
          );
        })}
      </div>
    </main>
  );
}
