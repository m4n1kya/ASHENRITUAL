'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, MessageSquare, Scan, Ruler, Eye, History } from 'lucide-react';

const navItems = [
  { name: 'Dashboard', href: '/vesper', icon: LayoutDashboard },
  { name: 'AI Concierge', href: '/vesper/chat', icon: MessageSquare },
  { name: 'Size Intelligence', href: '/vesper/size', icon: Scan },
  { name: 'Fit Preview', href: '/vesper/preview', icon: Eye },
  { name: 'Measurements', href: '/vesper/measurements', icon: Ruler },
  { name: 'History', href: '/vesper/history', icon: History, disabled: true },
];

export default function VesperLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex h-screen bg-[#050505] text-[#E8E8E8] font-sans overflow-hidden">
      {/* Persistent Sidebar */}
      <aside className="w-64 border-r border-[#202020] bg-[#0A0A0A] flex flex-col shrink-0 pt-[80px]">
        <div className="p-8 pb-4">
          <p className="font-heading text-[10px] font-medium uppercase tracking-[0.4em] text-[#8D8D8D]">
            Workspace
          </p>
          <h2 className="mt-2 font-heading text-xl uppercase tracking-widest text-[#FDFCFB]">
            VESPER
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

      {/* Main Content Area */}
      <main className="flex-1 relative overflow-hidden bg-background texture-grain pt-[80px]">
        {/* We rely on the child pages to handle AnimatePresence/framer-motion if they want page transitions */}
        {children}
      </main>
    </div>
  );
}
