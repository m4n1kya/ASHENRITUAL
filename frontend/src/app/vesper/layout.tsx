'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, MessageSquare, Scan, Ruler, Eye, History, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { name: 'AI Concierge', href: '/vesper', icon: MessageSquare },
  { name: 'Size Intelligence', href: '/vesper/size', icon: Scan },
  { name: 'Fit Preview', href: '/vesper/preview', icon: Eye },
  { name: 'Measurements', href: '/vesper/measurements', icon: Ruler },
  { name: 'History', href: '/vesper/history', icon: History, disabled: true },
];

export default function VesperLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Close dropdown when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const activeItem = navItems.find(item => item.href === pathname) || navItems[0];

  return (
    <div className="flex h-screen bg-[#050505] text-[#E8E8E8] font-sans overflow-hidden flex-col lg:flex-row">
      
      {/* ── Mobile/Tablet Dropdown Navigation (Hidden on lg+) ── */}
      <div className="lg:hidden flex-none w-full border-b border-[#202020] bg-[#0A0A0A] pt-[52px] z-30" ref={dropdownRef}>
        <div 
          className="px-6 py-4 flex items-center justify-between cursor-pointer"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <div className="flex items-center gap-3">
            <activeItem.icon className="h-4 w-4 text-[#8D8D8D]" />
            <span className="font-heading text-sm tracking-widest uppercase text-[#FDFCFB]">
              {activeItem.name}
            </span>
          </div>
          <ChevronDown className={cn("h-4 w-4 text-[#8D8D8D] transition-transform duration-300", mobileMenuOpen && "rotate-180")} />
        </div>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
              className="overflow-hidden border-t border-[#151515] bg-[#0A0A0A]"
            >
              <nav className="flex flex-col py-2">
                {navItems.map((item) => {
                  const isActive = pathname === item.href;
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      href={item.disabled ? '#' : item.href}
                      className={cn(
                        "flex items-center px-6 py-4 text-xs tracking-wider uppercase transition-colors",
                        isActive ? "bg-[#151515] text-[#FDFCFB]" : "text-[#8D8D8D] hover:bg-[#111111] hover:text-[#E8E8E8]",
                        item.disabled && "opacity-40 cursor-not-allowed"
                      )}
                      onClick={(e) => {
                        if (item.disabled) e.preventDefault();
                        else setMobileMenuOpen(false);
                      }}
                    >
                      <Icon className={cn("mr-4 h-4 w-4", isActive ? "text-[#FDFCFB]" : "text-[#8D8D8D]")} />
                      {item.name}
                      {item.disabled && (
                        <span className="ml-auto text-[8px] tracking-widest text-[#4A4A4A]">Soon</span>
                      )}
                    </Link>
                  );
                })}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Persistent Sidebar (Hidden on < lg) ── */}
      <aside className="hidden lg:flex w-64 border-r border-[#202020] bg-[#0A0A0A] flex-col shrink-0 pt-[80px]">
        <div className="p-8 pb-4">
          <p className="font-heading text-[10px] font-medium uppercase tracking-[0.4em] text-[#8D8D8D]">
            Workspace
          </p>
          <h2 className="mt-2 font-display italic normal-case text-2xl tracking-[0.15em] text-[#FDFCFB]">
            Vesper
          </h2>
        </div>

        <nav className="flex-1 px-4 py-8 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.disabled ? '#' : item.href}
                className={`group flex items-center px-4 py-3 text-sm transition-all duration-500 rounded-full ${
                  isActive 
                    ? 'bg-[#1A1A1A] text-[#FDFCFB]' 
                    : 'text-[#8D8D8D] hover:bg-[#111111] hover:text-[#E8E8E8]'
                } ${item.disabled ? 'opacity-40 cursor-not-allowed' : ''}`}
                onClick={(e) => item.disabled && e.preventDefault()}
              >
                <Icon className={`mr-4 h-4 w-4 transition-transform duration-500 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
                <span className="tracking-wide">{item.name}</span>
                {item.disabled && (
                  <span className="ml-auto text-[9px] uppercase tracking-widest text-[#4A4A4A]">Soon</span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-8 border-t border-[#202020]">
          <p className="text-[10px] text-[#4A4A4A] uppercase tracking-widest text-center">
            AshenRitual Intelligence
          </p>
        </div>
      </aside>

      {/* ── Main Content Area ── */}
      <main className="flex-1 relative overflow-hidden bg-background texture-grain lg:pt-[80px]">
        {children}
      </main>
    </div>
  );
}
