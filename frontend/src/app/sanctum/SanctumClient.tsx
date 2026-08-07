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
  const [sanctumState, setSanctumState] = useState<'HUB' | 'TRANSITION' | 'EXHIBITION'>('HUB');
  
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
          <CreatorHub key="hub" profile={profile || user!} onEnter={() => setSanctumState('TRANSITION')} />
        )}
        {sanctumState === 'TRANSITION' && (
          <SanctumTransition key="transition" onComplete={() => setSanctumState('EXHIBITION')} />
        )}
        {sanctumState === 'EXHIBITION' && (
          <CreatorLibrary key="library" profile={profile || user!} concepts={concepts} onBack={() => setSanctumState('HUB')} />
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── 1. Creator Hub & The Door ───────────────────────────────────────────── */
function CreatorHub({ profile, onEnter }: { profile: User, onEnter: () => void }) {
  const isVerified = profile.creatorProfile?.verified || false;

  return (
    <motion.div
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="w-full min-h-screen flex flex-col pt-24"
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
              className="border border-[rgba(255,255,255,0.05)] text-[#8D8D8D] w-10 h-10 flex items-center justify-center hover:bg-[rgba(255,255,255,0.02)] transition-colors"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Info Box */}
        <div className="w-full max-w-sm border border-[rgba(255,255,255,0.05)] bg-[#050505] p-8 hidden md:block">
          <h3 className="font-heading text-[10px] uppercase tracking-[0.3em] text-[#8D8D8D] mb-6 border-b border-[rgba(255,255,255,0.05)] pb-4">Showroom Affiliations</h3>
          <p className="font-sans text-xs text-[#A8A8A8] mb-6 leading-relaxed">
            Your concepts are currently unaffiliated. Apply to a verified showroom to have your collections physically carried.
          </p>
          <button className="w-full border border-[rgba(255,255,255,0.1)] py-3 font-heading text-[10px] uppercase tracking-widest text-[#FDFCFB] hover:bg-[#111] transition-colors">
            Apply to Showroom
          </button>
        </div>

      </div>

      {/* The Door */}
      <div className="w-full flex-1 flex flex-col items-center justify-end relative pb-0 mt-20">
        <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-[#020202] to-transparent z-0 pointer-events-none" />
        
        <button 
          onClick={onEnter}
          className="group relative w-full max-w-2xl h-[40vh] bg-[#020202] border-t border-x border-[rgba(255,255,255,0.02)] flex items-center justify-center overflow-hidden z-10 transition-all duration-1000 hover:border-[rgba(255,255,255,0.08)]"
        >
          <div className="absolute inset-y-0 left-1/2 w-[1px] bg-gradient-to-b from-transparent via-[#FDFCFB]/10 to-transparent group-hover:via-[#FDFCFB]/30 transition-all duration-1000" />
          
          <span className="font-heading text-sm uppercase tracking-[0.5em] text-[#4A4A4A] group-hover:text-[#FDFCFB] transition-colors duration-700 bg-[#020202] px-6 z-10">
            Enter Exhibition
          </span>
        </button>
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

/* ── 3. Sanctum Transition ───────────────────────────────────────────────── */
function SanctumTransition({ onComplete }: { onComplete: () => void }) {
  useEffect(() => {
    const t = setTimeout(onComplete, 3200);
    return () => clearTimeout(t);
  }, [onComplete]);

  return (
    <motion.div
      key="transition"
      className="fixed inset-0 z-[99999] flex items-center justify-center bg-[#050505]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0, filter: 'blur(10px)' }}
        animate={{ 
          scale: [0.8, 1, 1.05, 30], 
          opacity: [0, 1, 1, 0],
          filter: ['blur(10px)', 'blur(0px)', 'blur(0px)', 'blur(0px)']
        }}
        transition={{ 
          duration: 3.2, 
          times: [0, 0.3, 0.7, 1], 
          ease: "easeInOut" 
        }}
        className="relative flex items-center justify-center will-change-transform"
      >
        {/* SOFT BACKGROUND FOG */}
        <div className="absolute inset-0 z-[-1] mt-16 flex items-center justify-center pointer-events-none">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={`cloud-${i}`}
              className="absolute rounded-full bg-[#151515]"
              style={{
                width: Math.random() * 100 + 200, 
                height: Math.random() * 100 + 200,
                filter: 'blur(40px)',
              }}
              animate={{
                opacity: [0, 0.5, 0],
                scale: [0.8, 1.2],
                x: [(Math.random() - 0.5) * 60, (Math.random() - 0.5) * 60],
                y: [(Math.random() - 0.5) * 60, (Math.random() - 0.5) * 60 - 40],
              }}
              transition={{ 
                duration: Math.random() * 2 + 3, 
                repeat: Infinity, 
                ease: "easeInOut",
                delay: Math.random()
              }}
            />
          ))}
        </div>

        {/* SHINY LANTERN IMAGE */}
        <Image 
          src="/images/lantern-logo.png" 
          alt="ASHENRITUAL" 
          width={500} 
          height={500} 
          className="relative z-0 h-[250px] w-auto object-contain mt-16"
          unoptimized
          priority
        />

        {/* COOL GLOWING ASH PARTICLES */}
        <div className="absolute inset-0 z-[10] mt-16 flex items-center justify-center pointer-events-none">
          {[...Array(25)].map((_, i) => {
            const size = Math.random() * 4 + 1.5;
            const startX = (Math.random() - 0.5) * 180;
            const startY = (Math.random() - 0.5) * 120 + 80;
            
            return (
              <motion.div
                key={`ash-${i}`}
                className="absolute rounded-full bg-white"
                style={{
                  width: size, 
                  height: size,
                  boxShadow: '0 0 8px 2px rgba(200, 200, 200, 0.6)',
                  filter: 'blur(0.5px)',
                }}
                animate={{
                  opacity: [0, Math.random() * 0.7 + 0.3, 0],
                  y: [startY, startY - (Math.random() * 150 + 100)],
                  x: [startX, startX + (Math.random() * 50 - 25)],
                  scale: [0, 1.5, 0.5],
                }}
                transition={{
                  duration: Math.random() * 1.5 + 2,
                  repeat: Infinity,
                  ease: "easeOut",
                  delay: Math.random() * 2.5
                }}
              />
            );
          })}
        </div>
      </motion.div>
    </motion.div>
  );
}
