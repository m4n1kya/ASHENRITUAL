'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Heart, ShoppingBag, User, X } from 'lucide-react';
import { useCartStore } from '@/store/cart.store';
import { useAuthStore } from '@/store/auth.store';
import { cn } from '@/lib/utils';

/* ════════════════════════════════════════════════════════════════════════════
   NAVBAR — exact reference panel 1
   ─────────────────────────────────────────────────────────────────────────
   Left:   ASHENRITUAL (Manrope, tracking-[0.3em], small)
   Center: SHOP · CHAPTERS · LOOKBOOK · VESPER/VESPER (uppercase, 10-11px)
   Right:  search · heart · bag · user (17px icons, 1.5 stroke)
   Height: ~52px, very compact
   ════════════════════════════════════════════════════════════════════════════ */

const NAV = [
  { label: 'Shop',     href: '/shop' },
  { label: 'Chapters', href: '/chapters' },
  { label: 'Lookbook', href: '/lookbook' },
  { label: 'Journal',  href: '/journal' },
  { label: 'Vesper',   href: '/vesper' },
] as const;

const MOBILE_SECONDARY = [
  { label: 'Archive',        href: '/archive' },
  { label: 'Saved Rituals',  href: '/saved-rituals' },
  { label: 'Account',        href: '/account' },
] as const;

/* Icon button — exactly 36×36 tap target, thin icon */
function NavIcon({ href, label, badge, children }: {
  href?: string;
  label: string;
  badge?: number;
  children: React.ReactNode;
}) {
  const cls = "relative flex h-9 w-9 items-center justify-center text-[#8D8D8D] transition-colors duration-300 hover:text-[#FDFCFB]";
  const inner = (
    <>
      {children}
      {badge !== undefined && badge > 0 && (
        <span className="absolute right-[3px] top-[3px] flex h-[14px] w-[14px] items-center justify-center bg-[#FDFCFB] font-heading text-[8px] font-semibold leading-none text-[#0A0A0A]">
          {badge > 9 ? '9+' : badge}
        </span>
      )}
    </>
  );
  if (href) return <Link href={href} aria-label={label} className={cls}>{inner}</Link>;
  return <span className={cls} aria-label={label}>{inner}</span>;
}

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled]     = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const cartCount     = useCartStore(s => s.totalItems());
  const isAuthed      = useAuthStore(s => s.isAuthenticated);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 12);
    fn();
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  // Close menu on route change
  useEffect(() => { setMobileOpen(false); }, [pathname]);

  const close  = useCallback(() => setMobileOpen(false), []);
  const toggle = useCallback(() => setMobileOpen(v => !v), []);

  return (
    <>
      {/* ── Fixed bar ──────────────────────────────────────────────────────── */}
      <header
        role="banner"
        className={cn(
          'fixed inset-x-0 top-0 z-50 transition-all duration-500',
          scrolled
            ? 'border-b border-[#202020] bg-background/96 backdrop-blur-md'
            : 'bg-transparent',
        )}
      >
        <div className="mx-auto flex h-[52px] max-w-screen-xl items-center justify-between px-6 lg:px-10">

          {/* Logo — reference: small, tracking-widest */}
          <Link
            href="/"
            aria-label="ASHENRITUAL"
            className="font-heading text-[11px] font-semibold tracking-[0.35em] text-[#FDFCFB] transition-opacity duration-300 hover:opacity-50"
          >
            ASHENRITUAL
          </Link>

          {/* Center nav — exactly matching reference: SHOP CHAPTERS LOOKBOOK VESPER */}
          <nav aria-label="Primary navigation" className="hidden items-center gap-8 md:flex">
            {NAV.map(({ label, href }) => {
              const active = pathname === href || pathname.startsWith(href + '/');
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    'font-heading text-[10px] font-medium uppercase tracking-[0.2em] transition-colors duration-300',
                    /* Vesper gets Cormorant Garamond italic — distinctive */
                    label === 'Vesper' && 'font-display italic normal-case tracking-[0.15em] text-[13px]',
                    active
                      ? 'text-[#FDFCFB]'
                      : 'text-[#8D8D8D] hover:text-[#FDFCFB]',
                  )}
                >
                  {label}
                </Link>
              );
            })}
          </nav>

          {/* Right icons — exact reference: Q heart bag person */}
          <div className="flex items-center">
            <NavIcon href="/search" label="Search">
              <Search className="h-[17px] w-[17px]" strokeWidth={1.5} />
            </NavIcon>
            <NavIcon href="/saved-rituals" label="Saved Rituals">
              <Heart className="h-[17px] w-[17px]" strokeWidth={1.5} />
            </NavIcon>
            <NavIcon href="/cart" label={`Cart — ${cartCount} items`} badge={cartCount}>
              <ShoppingBag className="h-[17px] w-[17px]" strokeWidth={1.5} />
            </NavIcon>
            <NavIcon href={isAuthed ? '/account' : '/login'} label={isAuthed ? 'Account' : 'Sign in'}>
              <User className="h-[17px] w-[17px]" strokeWidth={1.5} />
            </NavIcon>

            {/* Mobile hamburger */}
            <button
              onClick={toggle}
              aria-label={mobileOpen ? 'Close menu' : 'Menu'}
              className="ml-1 flex h-9 w-9 items-center justify-center text-[#8D8D8D] transition-colors duration-300 hover:text-[#FDFCFB] md:hidden"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={mobileOpen ? 'x' : 'h'}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="flex items-center"
                >
                  {mobileOpen ? (
                    <X className="h-[17px] w-[17px]" strokeWidth={1.5} />
                  ) : (
                    /* Minimal 3-line hamburger exactly as reference */
                    <svg width="18" height="11" viewBox="0 0 18 11" fill="none" aria-hidden>
                      <rect x="0" y="0"   width="18" height="1.2" fill="currentColor" />
                      <rect x="0" y="4.9" width="13" height="1.2" fill="currentColor" />
                      <rect x="0" y="9.8" width="18" height="1.2" fill="currentColor" />
                    </svg>
                  )}
                </motion.span>
              </AnimatePresence>
            </button>
          </div>
        </div>
      </header>

      {/* ── Mobile full-screen menu — reference panel 4 ─────────────────────── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            key="mobile-overlay"
            className="fixed inset-0 z-40 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-background" onClick={close} />

            {/* Slide-in panel — reference: sweeps from right like ink */}
            <motion.nav
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
              role="dialog"
              aria-modal="true"
              aria-label="Mobile navigation"
              className="absolute inset-y-0 right-0 flex w-full max-w-[280px] flex-col border-l border-[#202020] bg-background px-8 py-6"
            >
              {/* Close X */}
              <button
                onClick={close}
                aria-label="Close"
                className="mb-12 ml-auto flex h-9 w-9 items-center justify-center text-[#8D8D8D] hover:text-[#FDFCFB] transition-colors"
              >
                <X className="h-5 w-5" strokeWidth={1.5} />
              </button>

              {/* Primary links — large type */}
              <div className="flex flex-col">
                {NAV.map(({ label, href }, i) => (
                  <motion.div
                    key={href}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 + i * 0.06, duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                  >
                    <Link
                      href={href}
                      className="block border-b border-[#202020] py-5 font-heading text-2xl font-semibold uppercase tracking-[0.1em] text-[#8D8D8D] hover:text-[#FDFCFB] transition-colors duration-300"
                    >
                      {label}
                    </Link>
                  </motion.div>
                ))}
              </div>

              {/* Secondary links + socials at bottom */}
              <div className="mt-auto">
                <div className="mb-4 h-px bg-[#202020]" />
                <div className="flex flex-col gap-3 mb-6">
                  {MOBILE_SECONDARY.map(({ label, href }) => (
                    <Link
                      key={href}
                      href={href}
                      className="font-heading text-[10px] font-medium uppercase tracking-[0.3em] text-[#8D8D8D] hover:text-[#FDFCFB] transition-colors duration-300"
                    >
                      {label}
                    </Link>
                  ))}
                </div>
                <div className="h-px bg-[#202020] mb-4" />
                <p className="font-heading text-[9px] uppercase tracking-[0.35em] text-[#3A3A3A]">
                  Instagram · Discord
                </p>
              </div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

