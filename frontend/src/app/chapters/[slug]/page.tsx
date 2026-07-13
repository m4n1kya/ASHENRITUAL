import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface Props {
  params: Promise<{ slug: string }>;
}

const CHAPTERS: Record<string, {
  name: string;
  label: string;
  description: string;
  longDesc: string;
  image: string;
}> = {
  'foundation': {
    name: 'Foundation',
    label: 'Chapter 001',
    description: 'The timeless pieces that anchor every wardrobe.',
    longDesc: 'Precision-cut staples designed for quiet permanence. These are not trend pieces. These are the garments you wear for a decade and return to again and again — not because they are comfortable, but because they are correct.',
    image: '/images/hero.png',
  },
  'forged-today': {
    name: 'Forged Today',
    label: 'Chapter 002',
    description: 'New arrivals forged with deliberate intention.',
    longDesc: 'Contemporary silhouettes that speak softly. Forged Today is about the now — pieces engineered for this moment while designed to outlast it. Every silhouette considered. Every material selected with purpose.',
    image: '/images/product.png',
  },
  'epoch': {
    name: 'Epoch',
    label: 'Chapter 003',
    description: 'Limited-run pieces that define a moment.',
    longDesc: 'Once they are gone, they do not return. Epoch captures a singular moment in design — a collaboration between craft and restraint. These pieces exist in limited quantities. When they sell, the chapter closes.',
    image: '/images/texture.png',
  },
  'nocturne': {
    name: 'Nocturne',
    label: 'Chapter 004',
    description: 'After dark. Silhouettes that command presence.',
    longDesc: 'When the world quiets down, what you wear speaks loudest. Nocturne is a study in depth — dark tones, architectural drape, and silhouettes engineered for evenings where subtlety is the most powerful statement.',
    image: '/images/hero.png',
  },
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const chapter = CHAPTERS[slug];
  if (!chapter) return { title: 'Chapter Not Found — ASHENRITUAL' };
  return {
    title: `${chapter.name} — ASHENRITUAL`,
    description: chapter.description,
  };
}

export default async function ChapterPage({ params }: Props) {
  const { slug } = await params;
  const chapter = CHAPTERS[slug];
  if (!chapter) notFound();

  return (
    <main className="min-h-screen bg-background pt-[60px] texture-grain">
      {/* Hero — full width cinematic image */}
      <div className="relative aspect-[21/9] overflow-hidden bg-card">
        <Image
          src={chapter.image}
          alt={chapter.name}
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/30 to-transparent" />
        <div className="absolute bottom-0 left-0 p-8 lg:p-16">
          <p className="font-heading text-[9px] font-medium uppercase tracking-[0.4em] text-[#8D8D8D]">
            {chapter.label}
          </p>
          <h1 className="mt-3 font-heading text-6xl font-semibold uppercase tracking-[0.06em] text-[#E8E8E8] md:text-8xl lg:text-[9rem]">
            {chapter.name}
          </h1>
        </div>
      </div>

      {/* Description */}
      <div className="mx-auto max-w-screen-xl px-8 py-16 lg:px-12">
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <p className="font-heading text-[10px] font-medium uppercase tracking-[0.35em] text-[#8D8D8D]">
              The Chapter
            </p>
            <p className="mt-4 font-display text-2xl font-light italic leading-relaxed text-[#E8E8E8]/70 md:text-3xl">
              {chapter.description}
            </p>
          </div>
          <div className="flex flex-col justify-center">
            <p className="text-[13px] leading-relaxed text-[#8D8D8D]">
              {chapter.longDesc}
            </p>
            <Link
              href="/shop"
              className="group mt-8 flex h-11 w-fit items-center gap-4 border border-[#202020] px-8 text-[10px] font-medium uppercase tracking-[0.25em] text-[#8D8D8D] transition-all duration-500 hover:border-[#E8E8E8]/30 hover:text-[#E8E8E8]"
            >
              Shop This Chapter
              <ArrowRight className="h-3.5 w-3.5 transition-transform duration-500 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>

        {/* Back */}
        <Link
          href="/chapters"
          className="group mt-20 flex items-center gap-3 text-[10px] font-medium uppercase tracking-[0.3em] text-[#8D8D8D] transition-colors duration-300 hover:text-[#E8E8E8]"
        >
          <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-500 group-hover:-translate-x-1" />
          All Chapters
        </Link>
      </div>
    </main>
  );
}
