import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Journal — ASHENRITUAL',
  description: 'Editorials, design perspectives, and the philosophy behind each collection.',
};

const ENTRIES = [
  {
    date: 'July 2026',
    category: 'Design',
    title: 'On the Discipline of Restraint',
    excerpt: 'Why removing is harder than adding — and why it matters in fashion.',
  },
  {
    date: 'June 2026',
    category: 'Philosophy',
    title: 'The Architecture of a Coat',
    excerpt: 'How structural precision translates from concrete to cloth.',
  },
  {
    date: 'May 2026',
    category: 'Material',
    title: 'Against Trend',
    excerpt: 'A meditation on permanence in an industry built on disposability.',
  },
];

export default function JournalPage() {
  return (
    <main className="min-h-screen bg-background pt-[52px]">
      <div className="mx-auto max-w-screen-xl px-8 py-16 lg:px-12">
        {/* Header */}
        <div className="mb-16 border-b border-[#202020] pb-12">
          <p className="font-heading text-[9px] font-medium uppercase tracking-[0.4em] text-[#8D8D8D]">
            Perspectives
          </p>
          <h1 className="mt-3 font-heading text-5xl font-extrabold uppercase tracking-tight text-[#FDFCFB] md:text-7xl lg:text-9xl">
            Journal
          </h1>
          <p className="mt-4 max-w-md text-[13px] leading-relaxed text-[#8D8D8D]">
            On design. On materiality. On the philosophy of presence.
          </p>
        </div>

        {/* Entries */}
        <div className="space-y-0">
          {ENTRIES.map((entry, i) => (
            <div
              key={i}
              className="group flex flex-col gap-4 border-b border-[#202020] py-10 md:flex-row md:items-center md:justify-between md:gap-0"
            >
              <div className="flex items-start gap-10">
                <div className="hidden md:block">
                  <p className="font-heading text-[9px] font-medium uppercase tracking-[0.3em] text-[#8D8D8D]/50 w-20">
                    {entry.date}
                  </p>
                </div>
                <div>
                  <p className="mb-2 font-heading text-[9px] font-medium uppercase tracking-[0.3em] text-[#8D8D8D]">
                    {entry.category}
                  </p>
                  <h2 className="font-heading text-xl font-semibold uppercase tracking-[0.06em] text-[#FDFCFB] md:text-2xl">
                    {entry.title}
                  </h2>
                  <p className="mt-2 max-w-md text-[12px] leading-relaxed text-[#8D8D8D]">
                    {entry.excerpt}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-[9px] font-medium uppercase tracking-[0.3em] text-[#8D8D8D] group-hover:text-[#FDFCFB] transition-colors duration-300 md:ml-8">
                Read
                <ArrowRight className="h-3 w-3 transition-transform duration-500 group-hover:translate-x-1" strokeWidth={1.5} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
