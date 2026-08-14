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
      className="flex h-screen bg-[#050505] text-[#E8E8E8] font-sans overflow-hidden relative"
      style={{ paddingTop: '100px' }}
    >
      {/* Top Left Floating Vesper Bubble */}
      <div className="absolute top-[116px] left-4 md:left-8 z-50 flex flex-col" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="group inline-flex h-11 items-center gap-5 border border-[#FDFCFB]/20 bg-[#050505]/80 backdrop-blur-md px-5 md:px-7 rounded-full font-heading text-[10px] font-medium uppercase tracking-[0.25em] text-[#FDFCFB] transition-all duration-500 hover:border-[#FDFCFB] hover:bg-[#FDFCFB] hover:text-[#0A0A0A]"
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
              initial={{ opacity: 0, y: -10, filter: 'blur(10px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -10, filter: 'blur(10px)' }}
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
              className="absolute top-[calc(100%+8px)] left-0 w-full min-w-[200px] flex flex-col border border-[#FDFCFB]/15 rounded-2xl bg-[#0A0A0A]/80 backdrop-blur-xl shadow-2xl overflow-hidden"
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
                      'flex items-center gap-3 px-6 py-4 text-[10px] uppercase tracking-[0.2em] transition-all duration-300 font-heading border-b border-[#FDFCFB]/5 last:border-b-0',
                      isActive
                        ? 'bg-[#FDFCFB]/10 text-[#FDFCFB]'
                        : 'text-[#888] hover:bg-[#FDFCFB]/5 hover:text-[#CCC]'
                    )}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Top Right Floating New Chat Bubble */}
      <div className="absolute top-[116px] right-4 md:right-8 z-50">
        <button
          onClick={clearMessages}
          className="group inline-flex h-11 items-center gap-3 md:gap-4 border border-[#FDFCFB]/20 bg-[#050505]/80 backdrop-blur-md px-4 md:px-7 rounded-full font-heading text-[10px] font-medium uppercase tracking-[0.25em] text-[#FDFCFB] transition-all duration-500 hover:border-[#FDFCFB] hover:bg-[#FDFCFB] hover:text-[#0A0A0A]"
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
