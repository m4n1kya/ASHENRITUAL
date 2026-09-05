/**
 * @fileoverview ASHENRITUAL Architecture
 * @module SettingsDrawer.tsx
 */
'use client';

import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useUIStore } from '@/store/ui.store';
import { UniversalProfileForm } from '@/components/forms/UniversalProfileForm';

export default function SettingsDrawer() {
  const { isSettingsOpen, closeSettings } = useUIStore();
  const drawerRef = useRef<HTMLDivElement>(null);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeSettings();
    };
    if (isSettingsOpen) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSettingsOpen, closeSettings]);

  // Lock body scroll when open
  useEffect(() => {
    if (isSettingsOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isSettingsOpen]);

  return (
    <AnimatePresence>
      {isSettingsOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
            onClick={closeSettings}
          />

          {/* Drawer */}
          <motion.div
            ref={drawerRef}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="fixed top-0 right-0 z-[101] h-full w-full max-w-md bg-[#0a0a0a] border-l border-white/10 shadow-2xl overflow-y-auto"
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-white/5">
                <h2 className="text-sm font-medium tracking-widest text-white/90 uppercase">Settings</h2>
                <button
                  onClick={closeSettings}
                  className="p-2 text-white/50 hover:text-white transition-colors rounded-full hover:bg-white/5"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 p-6 flex flex-col gap-8">
                {/* Profile Section */}
                <div className="space-y-4">
                  <h3 className="text-xs font-semibold tracking-wider text-white/40 uppercase">Universal Profile</h3>
                  <div className="p-4 bg-white/[0.02] border border-white/5 rounded-xl">
                    <UniversalProfileForm />
                  </div>
                </div>

                {/* Showroom Section Placeholder */}
                <div className="space-y-4">
                  <h3 className="text-xs font-semibold tracking-wider text-white/40 uppercase">Showroom</h3>
                  <div className="p-4 bg-white/5 border border-white/10 rounded-lg text-sm text-white/60">
                    Showroom settings form will go here.
                  </div>
                </div>
              </div>
              
              {/* Footer */}
              <div className="p-6 border-t border-white/5 flex justify-between items-center text-xs text-white/30">
                <span>ASHENRITUAL CORE V1.0</span>
                <button className="text-red-400 hover:text-red-300 transition-colors">Sign Out</button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
