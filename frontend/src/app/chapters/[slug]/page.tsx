import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import type { Product } from '@/types';
import { ProductCard } from '@/components/ui/ProductCard';

interface Chapter {
  id: string;
  name: string;
  description: string | null;
  quote: string | null;
  quoteAuthor: string | null;
  image: string | null;
  products: Product[];
}

interface PageProps {
  params: Promise<{ slug: string }>;
}


async function getChapter(slug: string): Promise<Chapter | null> {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
  try {
    const res = await fetch(`${API_URL}/chapters/${slug}`, { cache: 'no-store' });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const chapter = await getChapter(slug);
  
  if (!chapter) {
    return { title: 'Chapter Not Found — ASHENRITUAL' };
  }
  
  return {
    title: `${chapter.name} — ASHENRITUAL`,
    description: chapter.description || 'A poetic season by ASHENRITUAL.',
  };
}

export default async function ChapterPage({ params }: PageProps) {
  const { slug } = await params;
  const chapter = await getChapter(slug);

  if (!chapter) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-background pt-[60px] texture-grain">
      {/* Hero Section — Cinematic & Poetic */}
      <section className="relative h-[80vh] min-h-[600px] w-full bg-card overflow-hidden">
        <Image
          src={chapter.image || '/images/hero.png'}
          alt={chapter.name}
          fill
          className="object-cover"
          priority
        />
        {/* Gradients to fade smoothly into the background color below */}
        <div className="absolute inset-0 bg-black/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-transparent to-transparent" />
        
        <div className="absolute inset-0 flex flex-col justify-center px-8 lg:px-12 max-w-screen-xl mx-auto">
          <Link href="/chapters" className="group mb-12 inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] text-[#8D8D8D] hover:text-[#E8E8E8] transition-colors">
            <ArrowLeft className="h-3 w-3 transition-transform group-hover:-translate-x-1" />
            All Chapters
          </Link>
          
          <h1 className="font-heading text-5xl font-semibold uppercase tracking-[0.06em] text-[#FDFCFB] md:text-7xl lg:text-8xl max-w-3xl leading-tight">
            {chapter.name}
          </h1>
          
          {chapter.quote && (
            <div className="mt-12 max-w-2xl border-l border-[#8D8D8D]/30 pl-6 md:pl-10">
              <p className="font-serif text-xl italic text-[#E8E8E8] md:text-2xl lg:text-3xl leading-relaxed">
                {chapter.quote}
              </p>
              {chapter.quoteAuthor && (
                <p className="mt-6 font-heading text-[10px] uppercase tracking-[0.3em] text-[#8D8D8D]">
                  — {chapter.quoteAuthor}
                </p>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Description & Products */}
      <section className="mx-auto max-w-screen-xl px-8 py-24 lg:px-12">
        <div className="mb-24 md:w-2/3 lg:w-1/2">
          <p className="font-heading text-[10px] font-medium uppercase tracking-[0.35em] text-[#8D8D8D]">
            The Ritual
          </p>
          <p className="mt-6 text-[14px] leading-loose text-[#A8A8A8] md:text-[15px]">
            {chapter.description}
          </p>
        </div>

        <div className="border-t border-[#202020] pt-12">
          <div className="mb-12 flex items-center justify-between">
            <h2 className="font-heading text-2xl font-semibold uppercase tracking-[0.1em] text-[#E8E8E8]">
              Pieces in this Chapter
            </h2>
            <p className="font-heading text-[10px] uppercase tracking-[0.3em] text-[#8D8D8D]">
              {chapter.products.length} Items
            </p>
          </div>

          {chapter.products.length > 0 ? (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-6">
              {chapter.products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="py-20 text-center">
              <p className="text-sm text-[#8D8D8D]">No pieces have been discovered in this season yet.</p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
