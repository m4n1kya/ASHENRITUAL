'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  Layers,
  ShoppingCart,
  Users,
  Star,
  Tag,
  Cpu,
} from 'lucide-react';
import { cn } from '@/lib/utils';

/* ════════════════════════════════════════════════════════════════════════════
   ADMIN LAYOUT — dark sidebar panel, matching reference dark system
   ════════════════════════════════════════════════════════════════════════════ */

const NAV_ITEMS = [
  { label: 'Dashboard',  href: '/admin',              icon: LayoutDashboard },
  { label: 'Products',   href: '/admin/products',     icon: Package },
  { label: 'Chapters',   href: '/admin/chapters',     icon: Layers },
  { label: 'Orders',     href: '/admin/orders',       icon: ShoppingCart },
  { label: 'Customers',  href: '/admin/customers',    icon: Users },
  { label: 'Reviews',    href: '/admin/reviews',      icon: Star },
  { label: 'Coupons',    href: '/admin/coupons',      icon: Tag },
  { label: 'Vesper',     href: '/admin/vesper',        icon: Cpu },
] as const;

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen bg-background pt-[52px]">
      {/* ── Sidebar ─────────────────────────────────────────────────────── */}
      <aside className="hidden w-[200px] shrink-0 border-r border-[#202020] bg-background md:flex md:flex-col">
        <div className="sticky top-[52px] flex h-[calc(100vh-52px)] flex-col px-4 py-6">
          {/* Admin label */}
          <div className="mb-6 px-2">
            <p className="font-heading text-[8px] font-semibold uppercase tracking-[0.4em] text-[#3A3A3A]">
              Control Panel
            </p>
          </div>

          {/* Nav */}
          <nav className="flex flex-col gap-0.5">
            {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
              const active = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 transition-all duration-300',
                    'font-heading text-[10px] font-medium uppercase tracking-[0.2em]',
                    active
                      ? 'bg-[#1A1A1A] text-[#FDFCFB]'
                      : 'text-[#8D8D8D] hover:bg-[#141414] hover:text-[#FDFCFB]',
                  )}
                >
                  <Icon className="h-[14px] w-[14px]" strokeWidth={1.5} />
                  {label}
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="mt-auto border-t border-[#202020] pt-5">
            <Link
              href="/"
              className="flex items-center gap-2 px-3 font-heading text-[9px] uppercase tracking-[0.3em] text-[#3A3A3A] hover:text-[#8D8D8D] transition-colors duration-300"
            >
              ← Storefront
            </Link>
          </div>
        </div>
      </aside>

      {/* ── Main ────────────────────────────────────────────────────────── */}
      <main className="flex-1 overflow-x-hidden">
        <div className="mx-auto max-w-screen-xl px-8 py-10 lg:px-12">
          {children}
        </div>
      </main>
    </div>
  );
}

