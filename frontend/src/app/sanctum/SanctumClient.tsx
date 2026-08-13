'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, PenTool, Image as ImageIcon, MapPin, CheckCircle, Search, ArrowLeft, LogIn, Loader2 } from 'lucide-react';
import { useUIStore } from '@/store/ui.store';
import { useAuthStore } from '@/store/auth.store';
import { api } from '@/lib/api';
import { cn } from '@/lib/utils';
import type { Concept, User } from '@/types';

export function SanctumClient() {
  const { isAuthenticated, user, _hasHydrated } = useAuthStore();
  const [sanctumState, setSanctumState] = useState<'HUB' | 'EXHIBITION'>('HUB');
  
  const [profile, setProfile] = useState<User | null>(null);
  const [concepts, setConcepts] = useState<Concept[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (_hasHydrated && isAuthenticated) {
      // Fetch fresh profile and concepts
      Promise.all([
        api.get<{ user: User }>('/users/me'),
        api.get<{ data: Concept[] }>('/creators/concepts').catch(() => ({ data: [] }))
      ]).then(([profileRes, conceptsRes]) => {
        setProfile(profileRes.user);
        setConcepts(conceptsRes.data || []);
      }).finally(() => {
        setLoading(false);
      });
    } else if (_hasHydrated && !isAuthenticated) {
      setLoading(false);
    }
  }, [_hasHydrated, isAuthenticated]);

  if (!_hasHydrated || loading) {
    return (
      <div className="w-full bg-background min-h-screen flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-[#8D8D8D] animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="w-full bg-background min-h-screen flex flex-col items-center justify-center text-center p-8">
        <h1 className="font-heading text-4xl uppercase tracking-widest text-[#E8E8E8] mb-4">Please Login</h1>
        <p className="font-sans text-sm text-[#8D8D8D] max-w-md mx-auto mb-8 leading-relaxed">
          You must be logged in to access the private Creator Studio.
        </p>
        <Link 
          href="/login?redirect=/sanctum"
          className="bg-[#FDFCFB] text-[#0A0A0A] px-8 py-3 font-heading text-[10px] uppercase tracking-widest font-bold hover:bg-[#E8E8E8] transition-colors flex items-center gap-3"
        >
          <LogIn className="w-4 h-4" /> Go to Login
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full bg-background selection:bg-[#FDFCFB] selection:text-[#0A0A0A] min-h-screen relative">
      <AnimatePresence>
        {sanctumState === 'HUB' && (
          <CreatorHub key="hub" profile={profile || user!} />
        )}
        {sanctumState === 'EXHIBITION' && (
          <CreatorLibrary key="library" profile={profile || user!} concepts={concepts} onBack={() => setSanctumState('HUB')} />
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── 1. Creator Hub ──────────────────────────────────────────────────────── */
function CreatorHub({ profile }: { profile: User }) {
  const isVerified = profile.creatorProfile?.verified || false;

  return (
    <motion.div
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="w-full flex flex-col pt-24"
    >
      {/* Profile Section */}
      <div className="mx-auto max-w-screen-xl px-6 w-full flex-1 flex flex-col lg:flex-row items-center justify-center gap-16 lg:gap-24 relative z-10 py-12">
        
        {/* Avatar Area */}
        <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
          <div className="w-32 h-32 lg:w-48 lg:h-48 rounded-full bg-[#111] overflow-hidden border-2 border-[rgba(255,255,255,0.05)] mb-6 relative">
            {profile.avatar ? (
              <Image src={profile.avatar} alt={profile.displayName || profile.username} fill className="object-cover" unoptimized />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-tr from-[#1A1A1A] to-[#0A0A0A]" />
            )}
          </div>
          
          <div className="flex items-center gap-3 mb-2 justify-center lg:justify-start w-full">
            <h1 className="font-heading text-4xl uppercase tracking-wider text-[#FDFCFB]">
              {profile.displayName || profile.username}
            </h1>
            {isVerified && <CheckCircle className="w-5 h-5 text-[#FDFCFB]" />}
          </div>
          
          <p className="font-mono text-[10px] uppercase tracking-widest text-[#8D8D8D] mb-6 flex items-center justify-center lg:justify-start gap-2">
            <MapPin className="w-3 h-3" /> {profile.location || 'Unknown Location'} 
            <span className="mx-2">|</span> 
            {profile.creatorProfile?.specialization || 'Independent Designer'}
          </p>
          
          <p className="font-sans text-sm text-[#A8A8A8] max-w-md leading-relaxed mb-8">
            {profile.bio || 'Add a bio in your settings to define your philosophy.'}
          </p>

          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4">
            <button 
              onClick={() => useUIStore.getState().openUploadWizard()}
              className="bg-[#FDFCFB] text-[#0A0A0A] px-6 py-2.5 font-heading text-[10px] uppercase tracking-widest font-bold hover:bg-[#E8E8E8] transition-colors flex items-center gap-2"
            >
              <PenTool className="w-3 h-3" /> Upload Concept
            </button>
            <button className="border border-[rgba(255,255,255,0.1)] text-[#FDFCFB] px-6 py-2.5 font-heading text-[10px] uppercase tracking-widest hover:bg-[rgba(255,255,255,0.05)] transition-colors flex items-center gap-2">
              <ImageIcon className="w-3 h-3" /> Manage Portfolio
            </button>
            <button 
              onClick={() => useUIStore.getState().openSettings()}
              className="border border-[rgba(255,255,255,0.05)] text-[#8D8D8D] w-10 h-10 flex items-center justify-center hover:bg-[rgba(255,255,255,0.02)] transition-colors shrink-0"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
          <div className="mt-4 flex w-full justify-center lg:justify-start">
            <button className="w-full max-w-[340px] border border-[rgba(255,255,255,0.1)] py-2.5 font-heading text-[10px] uppercase tracking-widest text-[#FDFCFB] hover:bg-[rgba(255,255,255,0.05)] transition-colors">
              Apply to Showroom
            </button>
          </div>
        </div>

        {/* Floating Lantern (Enter Exhibition) */}
        <div className="w-full max-w-sm hidden md:flex items-center justify-center group cursor-pointer" onClick={() => setSanctumState('EXHIBITION')}>
          <motion.div
            animate={{ y: [-15, 15, -15] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="relative z-20 w-full transition-transform duration-[1500ms] ease-out group-hover:scale-[1.05]"
            style={{ height: '380px' }}
          >
            <Image 
              src="/images/lantern.png" 
              alt="Enter Exhibition" 
              fill 
              sizes="380px" 
              className="object-contain drop-shadow-[0_0_25px_rgba(255,255,255,0.15)] opacity-80 group-hover:opacity-100 transition-opacity duration-700" 
              unoptimized
            />
            {/* Ambient glow */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none -z-10">
               <div className="w-[60%] h-[60%] bg-[#FDFCFB]/5 blur-[60px] rounded-full transition-opacity duration-1000 group-hover:bg-[#FDFCFB]/15" />
            </div>
            {/* Hover text indicator */}
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 font-heading text-[10px] uppercase tracking-[0.3em] text-[#FDFCFB] whitespace-nowrap">
              Enter Exhibition
            </div>
          </motion.div>
        </div>

      </div>

    </motion.div>
  );
}

/* ── 2. Creator Library (Exhibition) ────────────────────────────────────────── */
function CreatorLibrary({ profile, concepts, onBack }: { profile: User, concepts: Concept[], onBack: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 50, scale: 0.95 }}
      transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
      className="w-full min-h-screen pt-32 pb-32 px-6 lg:px-12 mx-auto max-w-screen-2xl"
    >
      <button 
        onClick={onBack}
        className="fixed bottom-8 left-6 lg:bottom-12 lg:left-12 z-50 flex items-center gap-3 bg-[#050505]/90 backdrop-blur-md border border-[rgba(255,255,255,0.1)] px-7 py-3.5 rounded-full shadow-2xl hover:bg-[#111] hover:border-[rgba(255,255,255,0.2)] hover:scale-105 transition-all duration-300 group"
      >
        <ArrowLeft className="w-5 h-5 text-[#8D8D8D] group-hover:text-[#FDFCFB] group-hover:-translate-x-1 transition-all duration-300" />
        <span className="font-heading uppercase text-[11px] tracking-[0.2em] font-semibold text-[#8D8D8D] group-hover:text-[#FDFCFB] transition-colors">Return to Studio</span>
      </button>
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
        <div>
          <p className="font-heading text-[10px] uppercase tracking-[0.4em] text-[#8D8D8D] mb-4">Creator Portfolio</p>
          <h2 className="font-display italic text-4xl lg:text-6xl text-[#FDFCFB]">The Exhibition</h2>
        </div>
        <div className="flex items-center gap-4 border-b border-[rgba(255,255,255,0.1)] pb-2 w-full md:w-auto md:min-w-[300px]">
          <Search className="w-4 h-4 text-[#8D8D8D]" />
          <input 
            type="text" 
            placeholder="Search concepts, designers, materials..."
            className="bg-transparent border-none outline-none text-sm font-sans tracking-wide text-[#E8E8E8] placeholder:text-[#4A4A4A] w-full"
          />
        </div>
      </div>

      {concepts.length === 0 ? (
        <div className="w-full py-32 flex flex-col items-center justify-center border border-[rgba(255,255,255,0.05)] bg-[#050505]">
          <h3 className="font-heading text-xl uppercase tracking-widest text-[#4A4A4A] mb-4">No Concepts Yet</h3>
          <p className="text-[#4A4A4A] text-sm text-center max-w-md">
            Upload your first concept to begin your exhibition.
          </p>
        </div>
      ) : (
        <div className="columns-1 md:columns-2 xl:columns-3 gap-8 space-y-8">
          {concepts.map((item, i) => (
            <Link key={item.id} href={`/concepts/${item.slug}`}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + (i * 0.1), duration: 0.8 }}
                className="group relative w-full overflow-hidden break-inside-avoid bg-[#050505] cursor-pointer"
              >
                <div className={cn("relative w-full overflow-hidden min-h-[400px]")}>
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover grayscale opacity-70 group-hover:scale-105 group-hover:opacity-100 transition-all duration-[1.5s] ease-[0.22,1,0.36,1]"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-80 group-hover:opacity-50 transition-opacity duration-700" />
                </div>
                
                <div className="absolute bottom-0 left-0 w-full p-8 translate-y-4 group-hover:translate-y-0 transition-transform duration-700 ease-[0.22,1,0.36,1]">
                  <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#A8A8A8] mb-2">{item.tags?.[0] || 'Concept'}</p>
                  <h3 className="font-heading text-2xl uppercase tracking-wide text-[#FDFCFB] mb-2">{item.title}</h3>
                  <p className="font-display italic text-sm text-[#8D8D8D] group-hover:text-[#E8E8E8] transition-colors">{profile.displayName || profile.username}</p>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      )}
    </motion.div>
  );
}
