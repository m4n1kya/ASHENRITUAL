'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

/* ════════════════════════════════════════════════════════════════════════════
   FOOTER — reference bottom panel
   ASHENRITUAL | SHOP | CHAPTERS | COMPANY | SUPPORT
   Fine text, thin divider, copyright + legal links
   ════════════════════════════════════════════════════════════════════════════ */

const COLS = [
  {
    heading: 'Shop',
    links: [
      { label: 'All Products', href: '/shop' },
      { label: 'New Arrivals', href: '/shop?sort=newest' },
      { label: 'Accessories',  href: '/shop?category=accessories' },
      { label: 'Checkout',     href: '/checkout' },
    ],
  },
  {
    heading: 'Explore',
    links: [
      { label: 'Showrooms',    href: '/showrooms' },
      { label: 'Chapters',     href: '/chapters' },
      { label: 'Forge',        href: '/forge' },
      { label: 'Sanctum',      href: '/sanctum' },
      { label: 'Beyond',       href: '/beyond' },
      { label: 'Vesper',       href: '/vesper' },
    ],
  },
  {
    heading: 'Company',
    links: [
      { label: 'About',        href: '/about' },
      { label: 'FAQs',         href: '/faq' },
      { label: 'Shipping',     href: '/shipping' },
      { label: 'Returns',      href: '/returns' },
      { label: 'Contact',      href: '/contact' },
    ],
  },
] as const;

export function Footer() {
  const year = new Date().getFullYear();
  const pathname = usePathname();

  if (pathname?.startsWith('/vesper')) {
    return null;
  }

  return (
    <footer
      role="contentinfo"
      className="border-t border-[#202020] bg-background"
    >
      <div className="mx-auto max-w-screen-xl px-6 py-16 lg:px-10 lg:py-20">

        {/* Grid — 4 columns: brand + 3 link groups */}
        <div className="grid grid-cols-2 gap-10 sm:grid-cols-4">

          <div className="col-span-2 sm:col-span-1 pr-6">
            <Link
              href="/"
              className="flex items-center gap-1 text-[13px] font-bold tracking-[0.35em] text-[#FDFCFB] hover:opacity-70 transition-opacity duration-300 [font-family:var(--font-logo)]"
            >
              ASHENRITUAL
            </Link>
            <p className="mt-5 font-mono text-[11px] leading-relaxed text-[#8D8D8D]">
              Presence isn&apos;t purchased.<br />
              It&apos;s cultivated.
            </p>
          </div>

          {/* Link columns */}
          {COLS.map(col => (
            <div key={col.heading}>
              <h3 className="mb-5 font-heading text-[9px] font-semibold uppercase tracking-[0.35em] text-[#FDFCFB]">
                {col.heading}
              </h3>
              <ul className="space-y-3">
                {col.links.map(({ label, href }) => (
                  <li key={label}>
                    <Link
                      href={href}
                      className="text-[12px] text-[#8D8D8D] hover:text-[#FDFCFB] transition-colors duration-300"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-[#202020] pt-8 sm:flex-row">
          <p className="font-heading text-[10px] tracking-wider text-[#3A3A3A]">
            © {year} ASHENRITUAL. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            {['Privacy', 'Terms', 'Contact'].map(l => (
              <Link
                key={l}
                href={`/${l.toLowerCase()}`}
                className="font-heading text-[10px] text-[#3A3A3A] hover:text-[#8D8D8D] transition-colors duration-300"
              >
                {l}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
