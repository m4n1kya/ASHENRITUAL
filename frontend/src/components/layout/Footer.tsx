import Link from 'next/link';

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
      { label: 'New Orders',   href: '/shop?sort=newest' },
      { label: 'Chapters',     href: '/chapters' },
      { label: 'Lookbook',     href: '/lookbook' },
      { label: 'Accessories',  href: '/shop?category=accessories' },
    ],
  },
  {
    heading: 'Chapters',
    links: [
      { label: 'Foundation',  href: '/chapters/foundation' },
      { label: 'About',       href: '/about' },
      { label: 'Journal',     href: '/journal' },
      { label: 'Vesper',      href: '/vesper' },
      { label: 'Lookbook',    href: '/lookbook' },
    ],
  },
  {
    heading: 'Company',
    links: [
      { label: 'Faqs',     href: '/faq' },
      { label: 'Shipping', href: '/shipping' },
      { label: 'Returns',  href: '/returns' },
      { label: 'Reviews',  href: '/reviews' },
      { label: 'Checkout', href: '/checkout' },
    ],
  },
] as const;

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      role="contentinfo"
      className="border-t border-[#202020] bg-background"
    >
      <div className="mx-auto max-w-screen-xl px-6 py-16 lg:px-10 lg:py-20">

        {/* Grid — 4 columns: brand + 3 link groups */}
        <div className="grid grid-cols-2 gap-10 sm:grid-cols-4">

          {/* Brand */}
          <div className="col-span-2 sm:col-span-1">
            <Link
              href="/"
              className="font-heading text-[11px] font-semibold tracking-[0.35em] text-[#FDFCFB] hover:opacity-60 transition-opacity duration-300"
            >
              ASHENRITUAL
            </Link>
            <p className="mt-4 text-[12px] leading-relaxed text-[#8D8D8D]/60">
              Presence isn&apos;t purchased.<br />
              It&apos;s cultivated.
            </p>
            <p className="mt-3 font-heading text-[9px] font-medium uppercase tracking-[0.3em] text-[#3A3A3A]">
              Premium soft purchased.
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
