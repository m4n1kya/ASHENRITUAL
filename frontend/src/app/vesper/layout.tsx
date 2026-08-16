'use client';

import { useState, useRef, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { MessageSquare, Scan, Eye, Ruler, ChevronDown, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useVesperStore } from '@/store/vesper.store';

const navItems = [
  { name: 'Chat', href: '/vesper', icon: MessageSquare },
  { name: 'Size', href: '/vesper/size', icon: Scan },
  { name: 'Preview', href: '/vesper/preview', icon: Eye },
  { name: 'Fit', href: '/vesper/measurements', icon: Ruler },
];

export default function VesperLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const clearMessages = useVesperStore(state => state.clearMessages);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const activeItem = navItems.find(item => item.href === pathname) || navItems[0];
  const ActiveIcon = activeItem.icon;

  return (
    <div
      className="flex h-screen bg-[#050505] text-[#E8E8E8] font-sans overflow-hidden relative pt-[72px] md:pt-[100px]"
    >
      {/* Top Left Floating Vesper Bubble */}
      <div className="absolute top-[68px] md:top-[116px] left-4 md:left-8 z-50 flex flex-col" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="group inline-flex h-11 items-center gap-5 border border-white/10 bg-black/50 backdrop-blur-xl px-5 md:px-7 rounded-full font-heading text-[10px] font-medium uppercase tracking-[0.25em] text-[#FDFCFB] transition-all duration-500 hover:border-white hover:bg-white hover:text-black shadow-[0_4px_24px_rgba(0,0,0,0.4)]"
        >
          <span className="flex items-center gap-2">
            <ActiveIcon className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Vesper — </span>{activeItem.name}
          </span>
          <ChevronDown
            className={cn(
              "h-3.5 w-3.5 transition-transform duration-500",
              isOpen ? "rotate-180" : ""
            )}
            strokeWidth={1.5}
          />
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, filter: 'blur(10px)', scale: 0.95 }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)', scale: 1 }}
              exit={{ opacity: 0, y: -10, filter: 'blur(10px)', scale: 0.95 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="absolute top-[calc(100%+12px)] left-0 w-full min-w-[220px] flex flex-col border border-white/10 rounded-[20px] bg-[#0A0A0A]/70 backdrop-blur-2xl shadow-[0_16px_40px_rgba(0,0,0,0.6)] p-2"
            >
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      'flex items-center gap-3 px-5 py-3.5 text-[10px] uppercase tracking-[0.25em] transition-all duration-300 font-heading rounded-xl relative overflow-hidden',
                      isActive
                        ? 'bg-white/15 text-white'
                        : 'text-[#888] hover:bg-white/5 hover:text-white'
                    )}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeIndicator"
                        className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-1/2 bg-white rounded-r-full"
                      />
                    )}
                    <Icon className="h-3.5 w-3.5 relative z-10" />
                    <span className="relative z-10">{item.name}</span>
                  </Link>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Top Right Floating New Chat Bubble */}
      <div className="absolute top-[68px] md:top-[116px] right-4 md:right-8 z-50">
        <button
          onClick={clearMessages}
          className="group inline-flex h-11 items-center gap-3 md:gap-4 border border-white/10 bg-black/50 backdrop-blur-xl px-4 md:px-7 rounded-full font-heading text-[10px] font-medium uppercase tracking-[0.25em] text-[#FDFCFB] transition-all duration-500 hover:border-white hover:bg-white hover:text-black shadow-[0_4px_24px_rgba(0,0,0,0.4)]"
        >
          <RotateCcw className="h-3.5 w-3.5 transition-transform duration-500 group-hover:-rotate-180" strokeWidth={1.5} />
          <span className="hidden sm:inline">New Chat</span>
        </button>
      </div>

      {/* Main Chat Content — Full Width */}
      <div className="flex-1 overflow-hidden min-w-0">
        {children}
      </div>
    </div>
  );
}
