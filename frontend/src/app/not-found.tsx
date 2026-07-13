import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background px-8 text-center texture-grain">
      {/* Reference: monumental etched number with dark atmosphere */}
      <div className="relative select-none">
        <span
          className="font-heading text-[16rem] font-semibold leading-none tracking-tight md:text-[22rem]"
          style={{
            color: 'transparent',
            backgroundImage: 'linear-gradient(180deg, rgba(50,45,40,0.5) 0%, rgba(20,18,15,0.2) 100%)',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
          }}
          aria-hidden="true"
        >
          404
        </span>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <p className="font-heading text-[10px] font-medium uppercase tracking-[0.35em] text-[#8D8D8D]">
            Not Found
          </p>
          <p className="mt-3 font-display text-2xl font-light italic text-[#E8E8E8]/50 md:text-3xl">
            This page has been archived.
          </p>
        </div>
      </div>

      <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
        <Link
          href="/"
          className="group flex h-11 items-center gap-4 border border-[#202020] px-8 text-[10px] font-medium uppercase tracking-[0.25em] text-[#8D8D8D] transition-all duration-500 hover:border-[#E8E8E8]/30 hover:text-[#E8E8E8]"
        >
          Return Home
          <ArrowRight className="h-3.5 w-3.5 transition-transform duration-500 group-hover:translate-x-1" />
        </Link>
        <Link
          href="/shop"
          className="group flex h-11 items-center gap-4 border border-[#E8E8E8]/15 px-8 text-[10px] font-medium uppercase tracking-[0.25em] text-[#E8E8E8] transition-all duration-500 hover:bg-[#E8E8E8] hover:text-[#0A0A0A]"
        >
          Explore the Collection
        </Link>
      </div>
    </main>
  );
}
