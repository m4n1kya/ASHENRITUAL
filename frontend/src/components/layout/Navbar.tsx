'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ShoppingBag, User, X, ArrowRight } from 'lucide-react';
import { WebIcon } from '@/components/ui/WebIcon';
import { useCartStore } from '@/store/cart.store';
import { useAuthStore } from '@/store/auth.store';
import { api } from '@/lib/api';
import { cn } from '@/lib/utils';
import type { Product } from '@/types';

const NAV = [
  { label: 'Shop',     href: '/shop' },
  { label: 'Chapters', href: '/chapters' },
  { label: 'Vesper',   href: '/vesper' },
  { label: 'Atelier',  href: '/atelier' },
  { label: 'Journal',  href: '/journal' },
] as const;

const MOBILE_SECONDARY = [
  { label: 'Archive',        href: '/archive' },
  { label: 'Saved Rituals',  href: '/saved-rituals' },
  { label: 'Account',        href: '/account' },
] as const;

/* Icon button */
function NavIcon({ href, label, badge, children, iconCls }: {
  href?: string;
  label: string;
  badge?: number;
  children: React.ReactNode;
  iconCls?: string;
}) {
  const cls = cn('relative flex h-9 w-9 items-center justify-center transition-colors duration-300', iconCls);
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

/* ── Inline Search with Recommendations ─────────────────────────────────── */
function NavSearch() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [focused, setFocused] = useState(false);
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Fetch recommendations as user types
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!query.trim() || query.length < 2) {
      setResults([]);
      return;
    }
    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await api.get<{ data: Product[] }>(`/products?q=${encodeURIComponent(query)}&limit=5`);
        setResults(res.data || []);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 280);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [query]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setFocused(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const submit = useCallback(() => {
    if (!query.trim()) return;
    setFocused(false);
    inputRef.current?.blur();
    router.push(`/shop?q=${encodeURIComponent(query.trim())}`);
  }, [query, router]);

  const goToProduct = useCallback((id: string) => {
    setFocused(false);
    setQuery('');
    router.push(`/products/${id}`);
  }, [router]);

  const isOpen = focused && query.length >= 2;

  return (
    <div ref={containerRef} className="hidden md:flex flex-1 max-w-[700px] mx-8 relative">
      {/* Input */}
      <div style={{ outline: 'none', boxShadow: 'none' }} className="flex w-full items-center gap-3 rounded-full px-5 py-1.5 bg-[#1A1A1A] border border-[rgba(255,255,255,0.08)]">
        <Search className={cn('h-3.5 w-3.5 flex-shrink-0 transition-colors duration-300', focused ? 'text-[#FDFCFB]' : 'text-[#8D8D8D]')} />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          onKeyDown={e => {
            if (e.key === 'Enter') submit();
            if (e.key === 'Escape') { setFocused(false); inputRef.current?.blur(); }
          }}
          placeholder="Seek what endures..."
          style={{ outline: 'none', boxShadow: 'none', border: 'none' }}
          className="navbar-search-input flex-1 bg-transparent text-[12px] font-medium tracking-wide text-[#E8E8E8] placeholder:text-[#4A4A4A]"
        />
        <AnimatePresence>
          {query && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.15 }}
              onClick={() => { setQuery(''); setResults([]); inputRef.current?.focus(); }}
              className="flex-shrink-0 text-[#4A4A4A] hover:text-[#FDFCFB] transition-colors"
            >
              <X className="h-3.5 w-3.5" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Recommendations Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="search-dropdown"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
            className="absolute left-0 right-0 top-[calc(100%+8px)] z-[60] overflow-hidden rounded-2xl border border-[rgba(255,255,255,0.1)] bg-[#0E0E0E]/95 backdrop-blur-xl shadow-2xl"
          >
            {/* Loading shimmer */}
            {loading && (
              <div className="flex items-center gap-3 px-5 py-4">
                <div className="h-1.5 w-1.5 rounded-full bg-[#8D8D8D] animate-pulse" />
                <div className="h-1.5 w-1.5 rounded-full bg-[#8D8D8D] animate-pulse delay-75" />
                <div className="h-1.5 w-1.5 rounded-full bg-[#8D8D8D] animate-pulse delay-150" />
              </div>
            )}

            {/* Results */}
            {!loading && results.length > 0 && (
              <div>
                <p className="px-5 pt-4 pb-2 font-heading text-[9px] uppercase tracking-[0.3em] text-[#4A4A4A]">Suggestions</p>
                {results.map((product, i) => (
                  <motion.button
                    key={product.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                    onClick={() => goToProduct(product.id)}
                    className="group flex w-full items-center gap-4 px-5 py-3 text-left transition-colors hover:bg-[#1A1A1A]"
                  >
                    {/* Thumbnail */}
                    <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-md bg-[#1A1A1A]">
                      {product.images?.[0] && (
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="h-full w-full object-cover"
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="truncate text-[12px] font-medium text-[#E8E8E8] group-hover:text-[#FDFCFB] transition-colors">{product.name}</p>
                      <p className="text-[11px] text-[#4A4A4A]">
                        ₹ {Number(product.price).toLocaleString('en-IN')}
                      </p>
                    </div>
                    <ArrowRight className="h-3.5 w-3.5 flex-shrink-0 text-[#4A4A4A] opacity-0 group-hover:opacity-100 transition-opacity" />
                  </motion.button>
                ))}
                {/* View all */}
                <button
                  onClick={submit}
                  className="flex w-full items-center justify-between border-t border-[rgba(255,255,255,0.06)] px-5 py-3.5 text-left transition-colors hover:bg-[#1A1A1A] group"
                >
                  <span className="font-heading text-[10px] uppercase tracking-[0.25em] text-[#8D8D8D] group-hover:text-[#FDFCFB] transition-colors">
                    View all results for &ldquo;{query}&rdquo;
                  </span>
                  <ArrowRight className="h-3.5 w-3.5 text-[#4A4A4A] group-hover:text-[#FDFCFB] transition-colors" />
                </button>
              </div>
            )}

            {/* Empty state */}
            {!loading && results.length === 0 && query.length >= 2 && (
              <div className="px-5 py-6 text-center">
                <p className="font-heading text-[11px] uppercase tracking-[0.2em] text-[#4A4A4A]">Nothing found for &ldquo;{query}&rdquo;</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── Main Navbar ─────────────────────────────────────────────────────────── */
export function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const cartCount = useCartStore(s => s.totalItems());
  const { isAuthenticated, _hasHydrated } = useAuthStore();
  const isAuthed = _hasHydrated && isAuthenticated;

  const navTextCls  = 'text-[#8D8D8D] hover:text-[#FDFCFB]';
  const logoTextCls = 'text-[#FDFCFB]';
  const iconCls     = 'text-[#8D8D8D] hover:text-[#FDFCFB]';
  const activeCls   = 'text-[#FDFCFB]';

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  useEffect(() => { setMobileOpen(false); }, [pathname]);

  const close  = useCallback(() => setMobileOpen(false), []);
  const toggle = useCallback(() => setMobileOpen(v => !v), []);

  return (
    <>
      {/* ── Fixed bar ───────────────────────────────────────────────────── */}
      <header role="banner" className="fixed inset-x-0 top-0 z-50 transition-all duration-500">

        {/* Tier 1: Logo + Search + Icons */}
        <div className="w-full bg-background/40 backdrop-blur-md border-b border-[rgba(255,255,255,0.08)]">
          <div className="mx-auto flex h-[52px] max-w-screen-xl items-center justify-between px-6 lg:px-10">

            {/* Logo */}
            <Link
              href="/"
              aria-label="ASHENRITUAL"
              className={cn(
                'flex items-center gap-1 font-heading text-[11px] font-semibold tracking-[0.35em] transition-colors duration-300 hover:opacity-70',
                logoTextCls,
              )}
            >
              ASHENRITUAL
            </Link>

            {/* Inline Search (Desktop) */}
            <NavSearch />

            {/* Right icons */}
            <div className="flex items-center gap-1 md:gap-2">
              {/* Mobile search icon */}
              <div className="md:hidden">
                <NavIcon href="/search" label="Search" iconCls={iconCls}>
                  <Search className="h-[17px] w-[17px]" strokeWidth={1.5} />
                </NavIcon>
              </div>
              <NavIcon href="/saved-rituals" label="Saved Rituals" iconCls={iconCls}>
                <WebIcon className="h-[17px] w-[17px]" strokeWidth={1.5} />
              </NavIcon>
              <NavIcon href={isAuthed ? '/account' : '/login'} label={isAuthed ? 'Account' : 'Sign in'} iconCls={iconCls}>
                <User className="h-[17px] w-[17px]" strokeWidth={1.5} />
              </NavIcon>
              <NavIcon href="/cart" label={`Cart — ${cartCount} items`} badge={cartCount} iconCls={iconCls}>
                <ShoppingBag className="h-[17px] w-[17px]" strokeWidth={1.5} />
              </NavIcon>

              {/* Mobile hamburger */}
              <button
                onClick={toggle}
                aria-label={mobileOpen ? 'Close menu' : 'Menu'}
                className={cn('ml-1 flex h-9 w-9 items-center justify-center transition-colors duration-300 md:hidden', iconCls)}
              >
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={mobileOpen ? 'x' : 'h'}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    {mobileOpen
                      ? <X className="h-5 w-5" strokeWidth={1.5} />
                      : <div className="space-y-[3px]"><span className="block h-[1.5px] w-4 bg-current" /><span className="block h-[1.5px] w-4 bg-current" /></div>
                    }
                  </motion.span>
                </AnimatePresence>
              </button>
            </div>

          </div>
        </div>

        {/* Tier 2: Navigation Links — transparent */}
        <div className="hidden md:flex mx-auto h-[48px] max-w-screen-xl items-center justify-center px-6 lg:px-10">
          <nav aria-label="Primary navigation" className="flex items-center gap-10">
            {NAV.map(({ label, href }) => {
              const active = pathname === href || pathname.startsWith(href + '/');
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    'font-heading text-[11px] font-bold uppercase tracking-[0.25em] transition-colors duration-300',
                    label === 'Vesper' && 'font-display italic normal-case tracking-[0.15em] text-[14px]',
                    label !== 'Vesper' && (active ? activeCls : navTextCls),
                    label === 'Vesper' && (active ? 'text-[#FDFCFB]' : 'text-[#8D8D8D] hover:text-[#FDFCFB]'),
                  )}
                >
                  {label}
                </Link>
              );
            })}
          </nav>
        </div>

      </header>

      {/* ── Mobile full-screen menu ──────────────────────────────────────── */}
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
            <div className="absolute inset-0 bg-background" onClick={close} />
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
              <button
                onClick={close}
                aria-label="Close"
                className="mb-12 ml-auto flex h-9 w-9 items-center justify-center text-[#8D8D8D] hover:text-[#FDFCFB] transition-colors"
              >
                <X className="h-5 w-5" strokeWidth={1.5} />
              </button>

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
