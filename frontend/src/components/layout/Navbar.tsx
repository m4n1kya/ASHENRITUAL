'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ShoppingBag, User, X, ArrowRight, LogIn, LayoutDashboard, Package, LogOut, Settings } from 'lucide-react';
import { WebIcon } from '@/components/ui/WebIcon';
import { useCartStore } from '@/store/cart.store';
import { useAuthStore } from '@/store/auth.store';
import { useUIStore } from '@/store/ui.store';
import { api } from '@/lib/api';
import { cn } from '@/lib/utils';
import type { Product } from '@/types';

const NAV = [
  { label: 'Shop',      href: '/shop' },
  { label: 'Showrooms', href: '/showrooms' },
  { label: 'Chapters',  href: '/chapters' },
  { label: 'Vesper',    href: '/vesper' },
  { label: 'Forge',     href: '/forge' },
  { label: 'Sanctum',   href: '/sanctum' },
  { label: 'Beyond',    href: '/beyond' },
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

/* ── User Dropdown ───────────────────────────────────────────────────────── */
function UserDropdown({ isAuthed, iconCls }: { isAuthed: boolean; iconCls: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { logout } = useAuthStore();
  const { openSettings } = useUIStore();
  const router = useRouter();

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = useCallback(() => {
    logout();
    setOpen(false);
    router.push('/');
  }, [logout, router]);

  const authedLinks = [
    { label: 'Profile', href: '/account', icon: User },
    { label: 'Orders', href: '/archive', icon: Package },
    { label: 'Saved Rituals', href: '/saved-rituals', icon: WebIcon },
  ];

  return (
    <div 
      ref={ref} 
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        onClick={() => setOpen(v => !v)}
        aria-label={isAuthed ? 'Profile' : 'Login'}
        className={cn('relative flex h-9 w-9 items-center justify-center transition-colors duration-300', iconCls)}
      >
        <User className="h-[17px] w-[17px]" strokeWidth={1.5} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            key="user-dropdown"
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.18, ease: [0.4, 0, 0.2, 1] }}
            className="absolute right-0 top-[calc(100%+10px)] z-[70] w-52 overflow-hidden border border-[rgba(255,255,255,0.1)] bg-[#0E0E0E]/95 backdrop-blur-xl shadow-2xl"
          >
            {isAuthed ? (
              <>
                {/* Guest / User badge */}
                <div className="px-4 py-3 border-b border-[rgba(255,255,255,0.06)]">
                  <p className="font-heading text-[10px] uppercase tracking-[0.2em] text-[#FDFCFB]">
                    {useAuthStore.getState().user?.email === 'guest@ashenritual.com' ? 'Guest' : (useAuthStore.getState().user?.displayName || useAuthStore.getState().user?.email?.split('@')[0])}
                  </p>
                  {useAuthStore.getState().user?.email === 'guest@ashenritual.com' && (
                    <p className="mt-1 text-[9px] text-[#8D8D8D] font-mono tracking-wider">Demo Mode</p>
                  )}
                </div>
                {/* Authenticated links */}
                <div className="py-2">
                  {authedLinks.map(({ label, href, icon: Icon }) => (
                    <Link
                      key={href}
                      href={href}
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 font-heading text-[10px] uppercase tracking-[0.2em] text-[#8D8D8D] transition-colors hover:bg-[#1A1A1A] hover:text-[#FDFCFB]"
                    >
                      <Icon className="h-3.5 w-3.5 flex-shrink-0" strokeWidth={1.5} />
                      {label}
                    </Link>
                  ))}
                  <button
                    onClick={() => { setOpen(false); openSettings(); }}
                    className="flex w-full items-center gap-3 px-4 py-3 font-heading text-[10px] uppercase tracking-[0.2em] text-[#8D8D8D] transition-colors hover:bg-[#1A1A1A] hover:text-[#FDFCFB]"
                  >
                    <Settings className="h-3.5 w-3.5 flex-shrink-0" strokeWidth={1.5} />
                    Settings
                  </button>
                </div>
                <div className="border-t border-[rgba(255,255,255,0.06)]">
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 px-4 py-3 font-heading text-[10px] uppercase tracking-[0.2em] text-[#8D8D8D] transition-colors hover:bg-[#1A1A1A] hover:text-[#FDFCFB]"
                  >
                    <LogOut className="h-3.5 w-3.5 flex-shrink-0" strokeWidth={1.5} />
                    Sign Out
                  </button>
                </div>
              </>
            ) : (
              <>
                {/* Guest links */}
                <div className="py-2">
                  <Link
                    href="/login"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 font-heading text-[10px] uppercase tracking-[0.2em] text-[#8D8D8D] transition-colors hover:bg-[#1A1A1A] hover:text-[#FDFCFB]"
                  >
                    <LogIn className="h-3.5 w-3.5 flex-shrink-0" strokeWidth={1.5} />
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 font-heading text-[10px] uppercase tracking-[0.2em] text-[#8D8D8D] transition-colors hover:bg-[#1A1A1A] hover:text-[#FDFCFB]"
                  >
                    <LayoutDashboard className="h-3.5 w-3.5 flex-shrink-0" strokeWidth={1.5} />
                    Create Account
                  </Link>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
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
                        /* eslint-disable-next-line @next/next/no-img-element */
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
        <div className={cn("relative w-full border-b border-[rgba(255,255,255,0.08)] bg-background", pathname === '/' && "home-tier1")}>
          <div className="relative z-10 mx-auto flex h-[52px] max-w-screen-xl items-center justify-between px-3 sm:px-6 lg:px-10">

            {/* Logo */}
            <Link
              href="/"
              aria-label="ASHENRITUAL"
              className={cn(
                'flex items-center gap-1 text-[9px] sm:text-[11px] font-bold tracking-[0.2em] sm:tracking-[0.35em] transition-colors duration-300 hover:opacity-70',
                '[font-family:var(--font-logo)] whitespace-nowrap shrink-0',
                logoTextCls,
              )}
            >
              ASHENRITUAL
            </Link>

            {/* Inline Search (Desktop) */}
            <NavSearch />

            {/* Right icons: Saved Rituals → Cart → User */}
            <div className="flex items-center gap-0 sm:gap-1 md:gap-2 shrink-0">
              {/* Mobile search icon */}
              <div className="md:hidden">
                <NavIcon href="/search" label="Search" iconCls={iconCls}>
                  <Search className="h-[17px] w-[17px]" strokeWidth={1.5} />
                </NavIcon>
              </div>

              {/* 1. Saved Rituals */}
              <NavIcon href="/saved-rituals" label="Saved Rituals" iconCls={iconCls}>
                <WebIcon className="h-[17px] w-[17px]" strokeWidth={1.5} />
              </NavIcon>

              {/* 2. Cart */}
              <NavIcon href="/cart" label={`Cart — ${cartCount} items`} badge={cartCount} iconCls={iconCls}>
                <ShoppingBag className="h-[17px] w-[17px]" strokeWidth={1.5} />
              </NavIcon>

              {/* 3. User icon → dropdown */}
              <UserDropdown isAuthed={isAuthed} iconCls={iconCls} />

              {/* Mobile hamburger */}
              <button
                onClick={toggle}
                aria-label={mobileOpen ? 'Close menu' : 'Menu'}
                className={cn('flex h-9 w-9 items-center justify-center transition-colors duration-300 md:hidden ml-0.5 sm:ml-1', iconCls)}
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
        <div className="hidden md:flex mx-auto h-[32px] max-w-screen-xl items-start pt-2 justify-center px-6 lg:px-10">
          <motion.nav 
            aria-label="Primary navigation" 
            className="flex items-center gap-10"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
            }}
          >
            {NAV.map(({ label, href }) => {
              const active = pathname === href || pathname.startsWith(href + '/');
              return (
                <motion.div
                  key={href}
                  variants={{
                    hidden: { opacity: 0, y: -5 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
                  }}
                >
                  <Link
                    href={href}
                    className={cn(
                      'font-heading text-[9px] font-bold uppercase tracking-[0.25em] transition-colors duration-300',
                      label === 'Vesper' && 'font-display italic normal-case tracking-[0.15em] text-[12px]',
                      label !== 'Vesper' && (active ? activeCls : navTextCls),
                      label === 'Vesper' && (active ? 'text-[#FDFCFB]' : 'text-[#8D8D8D] hover:text-[#FDFCFB]'),
                    )}
                  >
                    {label}
                  </Link>
                </motion.div>
              );
            })}
          </motion.nav>
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
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={close} />
            <motion.nav
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
              role="dialog"
              aria-modal="true"
              aria-label="Mobile navigation"
              className="absolute inset-y-0 right-0 flex w-full max-w-[280px] flex-col border-l border-[#202020] bg-background/90 backdrop-blur-xl px-8 pt-[90px] pb-6 shadow-2xl overflow-y-auto hide-scrollbar"
            >

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
