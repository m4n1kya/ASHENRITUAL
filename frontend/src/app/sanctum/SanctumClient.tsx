'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, PenTool, Image as ImageIcon, MapPin, CheckCircle, ArrowLeft, LogIn, Loader2, X } from 'lucide-react';
import { useUIStore } from '@/store/ui.store';
import { useAuthStore } from '@/store/auth.store';
import { api } from '@/lib/api';
import type { Concept, User } from '@/types';

/* ── Exhibition prototype data ───────────────────────────────────────────── */
const PROTO_IMAGES = [
  { id: 'e1',  src: '/images/exhibition_01.png',  creator: '@void.ritual',  handle: 'ASHEN-2041', title: 'Fractured Silhouette' },
  { id: 'e2',  src: '/images/exhibition_02.png',  creator: '@mute.form',    handle: 'ASHEN-1879', title: 'Textile Study III' },
  { id: 'e3',  src: '/images/exhibition_03.png',  creator: '@liminal.cut',  handle: 'ASHEN-3302', title: 'Brutalist Drape' },
  { id: 'e4',  src: '/images/exhibition_04.png',  creator: '@ash.theory',   handle: 'ASHEN-0091', title: 'Ink Draft No. 7' },
  { id: 'e5',  src: '/images/exhibition_05.png',  creator: '@null.cloth',   handle: 'ASHEN-4410', title: 'Collage Fragment' },
  { id: 'e6',  src: '/images/exhibition_06.png',  creator: '@still.object', handle: 'ASHEN-2253', title: 'Geometry of Utility' },
  { id: 'e7',  src: '/images/exhibition_07.png',  creator: '@dusk.atelier', handle: 'ASHEN-1102', title: 'Night Architecture' },
  { id: 'e8',  src: '/images/exhibition_08.png',  creator: '@grey.index',   handle: 'ASHEN-3871', title: 'Moodboard 88' },
  { id: 'e9',  src: '/images/forge-hero.jpg',     creator: '@iron.stitch',  handle: 'ASHEN-5519', title: 'The Forge Series' },
  { id: 'e10', src: '/images/natural-texture.jpg',creator: '@earth.form',   handle: 'ASHEN-6634', title: 'Raw Material I' },
  { id: 'e11', src: '/images/void-etched.png',       creator: '@wet.ink',      handle: 'ASHEN-7701', title: 'Surface Tension' },
  { id: 'e12', src: '/images/new-texture-hero.jpg',creator: '@texture.lab', handle: 'ASHEN-8823', title: 'Woven Horizon' },
  // Beyond images
  { id: 'e13', src: '/images/beyond/beautiful-belarus-person-city.jpg',           creator: '@urban.phantom', handle: 'ASHEN-9201', title: 'City Veil' },
  { id: 'e14', src: '/images/beyond/close-up-portrait-attractive-male-model-color-flash-light.jpg', creator: '@flash.cut', handle: 'ASHEN-9302', title: 'Flash Study I' },
  { id: 'e15', src: '/images/beyond/cowboy-silhouette-with-horse-against-warm-light.jpg', creator: '@dust.ritual', handle: 'ASHEN-9403', title: 'Western Form' },
  { id: 'e16', src: '/images/beyond/medium-shot-young-man-posing-outdoors.jpg',   creator: '@field.edit',   handle: 'ASHEN-9504', title: 'Open Air No. 3' },
  { id: 'e17', src: '/images/beyond/portrait-fashionable-boy-outdoors.jpg',       creator: '@street.form',  handle: 'ASHEN-9605', title: 'Outdoor Portrait' },
  { id: 'e18', src: '/images/beyond/young-man-portrait.jpg',                      creator: '@still.face',   handle: 'ASHEN-9706', title: 'Portrait Study' },
];

/* Build 10 rows — each row gets a unique speed, direction, and size */
type RowSize = 'small' | 'medium' | 'large';

const ROW_CONFIGS: { speed: number; size: RowSize }[] = [
  { speed: 120, size: 'large' },
  { speed: 150, size: 'medium' },
  { speed: 100, size: 'small' },
  { speed: 180, size: 'large' },
  { speed: 140, size: 'medium' },
  { speed: 200, size: 'small' },
  { speed: 110, size: 'large' },
  { speed: 160, size: 'medium' },
  { speed: 95,  size: 'small' },
  { speed: 130, size: 'medium' },
];

function buildRows() {
  const rows = [];
  for (let i = 0; i < 10; i++) {
    // Each row gets a different shuffle
    const shuffled = [...PROTO_IMAGES].sort(() => Math.random() - 0.5);
    // Double the items so the belt can loop seamlessly
    rows.push({ items: [...shuffled, ...shuffled], rtl: i % 2 === 1, speed: ROW_CONFIGS[i].speed, size: ROW_CONFIGS[i].size });
  }
  return rows;
}

/* ──────────────────────────────────────────────────────────────────────────── */
export function SanctumClient() {
  const { isAuthenticated, user, _hasHydrated } = useAuthStore();
  const [sanctumState, setSanctumState] = useState<'HUB' | 'ANIM' | 'EXHIBITION'>('HUB');
  const [profile, setProfile] = useState<User | null>(null);
  const [concepts, setConcepts] = useState<Concept[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (_hasHydrated && isAuthenticated) {
      Promise.all([
        api.get<{ user: User }>('/users/me'),
        api.get<{ data: Concept[] }>('/creators/concepts').catch(() => ({ data: [] }))
      ]).then(([profileRes, conceptsRes]) => {
        setProfile(profileRes.user);
        setConcepts(conceptsRes.data || []);
      }).finally(() => setLoading(false));
    } else if (_hasHydrated && !isAuthenticated) {
      setLoading(false);
    }
  }, [_hasHydrated, isAuthenticated]);

  const enterExhibition = useCallback(() => {
    // Lock scroll on body while animation plays
    document.body.style.overflow = 'hidden';
    document.body.style.pointerEvents = 'none';
    setSanctumState('ANIM');
    setTimeout(() => {
      setSanctumState('EXHIBITION');
      document.body.style.overflow = '';
      document.body.style.pointerEvents = '';
    }, 3400);
  }, []);

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
        <Link href="/login?redirect=/sanctum"
          className="bg-[#FDFCFB] text-[#0A0A0A] px-8 py-3 font-heading text-[10px] uppercase tracking-widest font-bold hover:bg-[#E8E8E8] transition-colors flex items-center gap-3"
        >
          <LogIn className="w-4 h-4" /> Go to Login
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full bg-background selection:bg-[#FDFCFB] selection:text-[#0A0A0A] min-h-screen relative overflow-x-hidden overflow-y-auto">

      {/* Full-screen startup animation — covers entire website, blocks all interaction */}
      <AnimatePresence>
        {sanctumState === 'ANIM' && (
          <motion.div
            key="entry-anim"
            className="fixed inset-0 z-[99999] flex items-center justify-center bg-[#050505] cursor-default"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9, ease: 'easeInOut' }}
            style={{ pointerEvents: 'all' }}
          >
            <div className="relative flex items-center justify-center">
              {/* Isolate the scaling and filter to just the image wrapper, preventing child compositing lag */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0, filter: 'blur(10px)' }}
                animate={{ scale: [0.8, 1, 1.05, 40], opacity: [0, 1, 1, 0], filter: ['blur(10px)', 'blur(0px)', 'blur(0px)', 'blur(0px)'] }}
                transition={{ duration: 3.2, times: [0, 0.3, 0.7, 1], ease: [0.25, 0.1, 0.25, 1] }}
                className="relative z-0 mt-16"
              >
                <Image src="/images/lantern-logo.png" alt="ASHENRITUAL" width={500} height={500}
                  className="h-[250px] w-auto object-contain" unoptimized priority />
              </motion.div>

              {/* Fade out particles early so they aren't scaled or composited during the heavy zoom */}
              <motion.div 
                className="absolute inset-0 z-10 mt-16 flex items-center justify-center pointer-events-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 2.2, times: [0, 0.2, 1], ease: 'easeInOut' }}
              >
                {[...Array(60)].map((_, i) => {
                  const size = Math.random() * 4 + 1.5;
                  const angle = Math.random() * Math.PI * 2;
                  // Tighter distribution to keep particles closer to the center
                  const distance = Math.pow(Math.random(), 0.8) * 140; 
                  const startX = Math.cos(angle) * distance;
                  const startY = Math.sin(angle) * distance;
                  
                  // Gentle drift, mostly upwards like dust motes
                  const driftX = startX + (Math.random() * 40 - 20);
                  const driftY = startY - (Math.random() * 60 + 20);

                  return (
                    <motion.div key={i} className="absolute rounded-full bg-white"
                      style={{ width: size, height: size, boxShadow: `0 0 ${size * 3}px ${size * 0.5}px rgba(255,255,255,0.8)` }}
                      animate={{
                        opacity: [0, Math.random() * 0.5 + 0.5, 0],
                        y: [startY, driftY],
                        x: [startX, driftX],
                        scale: [0.5, 1.2, 0.5],
                      }}
                      transition={{ duration: Math.random() * 3 + 2, repeat: Infinity, ease: 'easeInOut', delay: Math.random() * 2 }}
                    />
                  );
                })}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {sanctumState === 'HUB' && (
          <CreatorHub key="hub" profile={profile || user!} onEnterExhibition={enterExhibition} />
        )}
        {sanctumState === 'EXHIBITION' && (
          <ExhibitionWall key="exhibition" profile={profile || user!} concepts={concepts} onBack={() => setSanctumState('HUB')} />
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── Dense Particle Field ────────────────────────────────────────────────── */
function ParticleField() {
  // Layer 0: Ambient dust evenly spread across the whole screen
  const ambientParticles = Array.from({ length: 350 }, (_, i) => {
    const angle = Math.random() * Math.PI * 2;
    // Math.sqrt gives an even distribution in a circle
    const dist = Math.sqrt(Math.random()) * 1500;
    const x = Math.cos(angle) * dist;
    const y = Math.sin(angle) * dist;
    const opacity = Math.random() * 0.4 + 0.1;
    const size = Math.random() * 2 + 0.5;
    return { id: `a-${i}`, x, y, opacity, size, delay: Math.random() * 5, duration: Math.random() * 5 + 4 };
  });

  // Layer 1: Behind the image (z-index 1) - Lantern cluster
  const particlesBehind = Array.from({ length: 150 }, (_, i) => {
    const angle = Math.random() * Math.PI * 2;
    // Bias towards center
    const dist = Math.pow(Math.random(), 3) * 1200 + 10;
    const x = Math.cos(angle) * dist;
    const y = Math.sin(angle) * dist;
    const density = Math.max(0, 1 - dist / 1300);
    const opacity = density * (Math.random() * 0.6 + 0.2);
    const size = density * (Math.random() * 3 + 1) + 0.5;
    return { id: `b-${i}`, x, y, opacity: Math.max(opacity, 0.1), size, delay: Math.random() * 5, duration: Math.random() * 4 + 3 };
  });

  // Layer 2: In front of the image (z-index 30) - Lantern cluster
  const particlesInFront = Array.from({ length: 70 }, (_, i) => {
    const angle = Math.random() * Math.PI * 2;
    const dist = Math.pow(Math.random(), 3) * 1000 + 10;
    const x = Math.cos(angle) * dist;
    const y = Math.sin(angle) * dist;
    const density = Math.max(0, 1 - dist / 1100);
    const opacity = density * (Math.random() * 0.5 + 0.2);
    const size = density * (Math.random() * 2 + 1) + 0.5;
    return { id: `f-${i}`, x, y, opacity: Math.max(opacity, 0.1), size, delay: Math.random() * 5, duration: Math.random() * 4 + 3 };
  });

  const renderParticles = (particles: any[]) => particles.map(p => (
    <motion.div
      key={p.id}
      className="absolute rounded-full bg-white"
      style={{
        left: `calc(50% + ${p.x}px)`,
        top: `calc(50% + ${p.y}px)`,
        width: p.size,
        height: p.size,
        boxShadow: `0 0 ${p.size * 5}px ${p.size * 1.5}px rgba(255,255,255,0.8)`,
      }}
      animate={{
        opacity: [0, p.opacity, p.opacity * 0.2, p.opacity, 0],
        scale: [0.3, 1.2, 0.6, 1.4, 0.3],
      }}
      transition={{
        duration: p.duration,
        repeat: Infinity,
        delay: p.delay,
        ease: 'easeInOut',
      }}
    />
  ));

  return (
    <>
      <div className="absolute inset-0 pointer-events-none overflow-visible" style={{ zIndex: 0 }}>
        {renderParticles(ambientParticles)}
      </div>
      <div className="absolute inset-0 pointer-events-none overflow-visible" style={{ zIndex: 1 }}>
        {renderParticles(particlesBehind)}
      </div>
      <div className="absolute inset-0 pointer-events-none overflow-visible" style={{ zIndex: 30 }}>
        {renderParticles(particlesInFront)}
      </div>
    </>
  );
}

/* ── 1. Creator Hub ──────────────────────────────────────────────────────── */
function CreatorHub({ profile, onEnterExhibition }: { profile: User; onEnterExhibition: () => void }) {
  const isVerified = profile.creatorProfile?.verified || false;

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      className="w-full flex flex-col pt-24 pb-24"
    >
      <div className="mx-auto max-w-screen-xl px-6 w-full flex-1 flex flex-col lg:flex-row items-center justify-center gap-16 lg:gap-24 relative z-10 py-12">

        {/* Avatar + Info */}
        <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
          <div className="w-32 h-32 lg:w-48 lg:h-48 rounded-full bg-[#111] overflow-hidden border-2 border-[rgba(255,255,255,0.05)] mb-6 relative">
            {profile.avatar ? (
              <Image src={profile.avatar} alt={profile.displayName || profile.username} fill className="object-cover" unoptimized />
            ) : (
              <Image src="/images/default-avatar.png" alt="Guest Profile" fill className="object-cover bg-gradient-to-tr from-[#D4D4D4] to-[#FFFFFF]" unoptimized />
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
            <button onClick={() => useUIStore.getState().openUploadWizard()}
              className="bg-[#FDFCFB] text-[#0A0A0A] px-6 py-2.5 font-heading text-[10px] uppercase tracking-widest font-bold hover:bg-[#E8E8E8] transition-colors flex items-center gap-2">
              <PenTool className="w-3 h-3" /> Upload Concept
            </button>
            <button className="border border-[rgba(255,255,255,0.1)] text-[#FDFCFB] px-6 py-2.5 font-heading text-[10px] uppercase tracking-widest hover:bg-[rgba(255,255,255,0.05)] transition-colors flex items-center gap-2">
              <ImageIcon className="w-3 h-3" /> Manage Portfolio
            </button>
            <button onClick={() => useUIStore.getState().openSettings()}
              className="border border-[rgba(255,255,255,0.05)] text-[#8D8D8D] w-10 h-10 flex items-center justify-center hover:bg-[rgba(255,255,255,0.02)] transition-colors shrink-0">
              <Settings className="w-4 h-4" />
            </button>
          </div>
          <div className="mt-4 flex w-full justify-center lg:justify-start">
            <button className="w-full max-w-[340px] border border-[rgba(255,255,255,0.1)] py-2.5 font-heading text-[10px] uppercase tracking-widest text-[#FDFCFB] hover:bg-[rgba(255,255,255,0.05)] transition-colors">
              Apply to Showroom
            </button>
          </div>
        </div>

        {/* Floating Lantern + dense particle halo */}
        <div
          className="w-full max-w-sm flex items-center justify-center group cursor-pointer relative"
          onClick={onEnterExhibition}
          style={{ minHeight: 460 }}
        >
          <ParticleField />
          <motion.div
            animate={{ y: [-15, 15, -15] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            className="relative z-20 w-full transition-transform duration-[1500ms] ease-out group-hover:scale-[1.05]"
            style={{ height: '380px' }}
          >
            <Image src="/images/lantern.png" alt="Enter Exhibition" fill sizes="380px"
              className="object-contain drop-shadow-[0_0_40px_rgba(255,255,255,0.25)] opacity-85 group-hover:opacity-100 transition-opacity duration-700"
              unoptimized />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none -z-10">
              <div className="w-[70%] h-[70%] bg-[#FDFCFB]/8 blur-[100px] rounded-full transition-all duration-1000 group-hover:bg-[#FDFCFB]/20 group-hover:blur-[140px]" />
            </div>
            <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 font-heading text-[10px] uppercase tracking-[0.3em] text-[#FDFCFB] whitespace-nowrap">
              Enter Exhibition
            </div>
          </motion.div>
        </div>

      </div>
    </motion.div>
  );
}

/* ── Infinite CSS-driven Scrolling Belt ──────────────────────────────────── */
type ProtoItem = { id: string; src: string; creator: string; handle: string; title: string };

function getSizeStyles(size: RowSize) {
  switch (size) {
    case 'small': return { w: 140, h: 180, gap: 12 };
    case 'large': return { w: 260, h: 340, gap: 16 };
    case 'medium': 
    default: return { w: 180, h: 240, gap: 12 };
  }
}

function ScrollingRow({ items, rtl, speed, size, onSelect }: { items: ProtoItem[]; rtl: boolean; speed: number; size: RowSize; onSelect: (item: ProtoItem) => void }) {
  const { w, h, gap } = getSizeStyles(size);
  const CARD_W = w + gap; 
  const singleLen = items.length / 2; // we doubled items
  const totalPx = singleLen * CARD_W;

  // Inline keyframes so the animation is truly seamless
  const animName = `scroll-${rtl ? 'rtl' : 'ltr'}-${speed}-${size}`;
  const keyframes = rtl
    ? `@keyframes ${animName} { from { transform: translateX(-${totalPx}px); } to { transform: translateX(0); } }`
    : `@keyframes ${animName} { from { transform: translateX(0); } to { transform: translateX(-${totalPx}px); } }`;

  return (
    <>
      <style>{keyframes}</style>
      <div className="overflow-hidden w-full select-none">
        <div
          className="flex will-change-transform"
          style={{
            gap: `${gap}px`,
            animation: `${animName} ${speed}s linear infinite`,
            width: 'max-content',
          }}
        >
          {items.map((item, i) => (
            <button
              key={`${item.id}-${i}`}
              onClick={() => onSelect(item)}
              className="relative shrink-0 overflow-hidden group focus:outline-none"
              style={{ width: w, height: h }}
            >
              <Image src={item.src} alt={item.title} fill
                className="object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                unoptimized />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <p className="font-heading text-[9px] uppercase tracking-widest text-[#FDFCFB] leading-tight truncate">{item.title}</p>
                <p className="font-mono text-[8px] text-[#8D8D8D] truncate">{item.creator}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </>
  );
}

/* ── Popup Card ──────────────────────────────────────────────────────────── */
function PopupCard({ item, onClose }: { item: ProtoItem; onClose: () => void }) {
  return (
    <AnimatePresence>
      <motion.div
        key="popup-overlay"
        className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/75 backdrop-blur-sm"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          key="popup-card"
          className="relative bg-[#0A0A0A] border border-[rgba(255,255,255,0.08)] overflow-hidden shadow-2xl max-w-md w-full mx-4"
          initial={{ scale: 0.85, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.85, opacity: 0, y: 30 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          onClick={e => e.stopPropagation()}
        >
          <div className="relative w-full" style={{ height: 340 }}>
            <Image src={item.src} alt={item.title} fill className="object-cover" unoptimized />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent" />
          </div>
          <div className="p-6">
            <p className="font-heading text-[9px] uppercase tracking-[0.4em] text-[#8D8D8D] mb-1">Creator</p>
            <h2 className="font-heading text-2xl uppercase tracking-wide text-[#FDFCFB] mb-1">{item.creator}</h2>
            <p className="font-mono text-[11px] text-[#555] mb-4">{item.handle}</p>
            <div className="border-t border-[rgba(255,255,255,0.05)] pt-4">
              <p className="font-heading text-[9px] uppercase tracking-[0.3em] text-[#8D8D8D] mb-1">Collection</p>
              <p className="font-sans text-sm text-[#E8E8E8]">{item.title}</p>
            </div>
          </div>
          <button onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-black/50 backdrop-blur-sm border border-[rgba(255,255,255,0.1)] rounded-full hover:bg-black/80 transition-colors">
            <X className="w-3.5 h-3.5 text-[#8D8D8D]" />
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

/* ── 2. Exhibition Wall ──────────────────────────────────────────────────── */
function ExhibitionWall({ onBack }: { profile: User; concepts: Concept[]; onBack: () => void }) {
  const [rows] = useState(buildRows);
  const [selected, setSelected] = useState<ProtoItem | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
      className="w-full min-h-screen bg-[#050505] pt-28 pb-16 overflow-hidden"
    >
      {/* Header */}
      <div className="mx-auto max-w-screen-xl px-6 mb-12">
        <p className="font-heading text-[10px] uppercase tracking-[0.4em] text-[#8D8D8D] mb-3">Creator Portfolio</p>
        <h2 className="font-display italic text-5xl lg:text-7xl text-[#FDFCFB]">The Exhibition</h2>
        <p className="font-sans text-sm text-[#4A4A4A] mt-3 max-w-md">
          Concepts submitted by creators to the Ashen archive. Click any piece to reveal its origin.
        </p>
      </div>

      {/* 10 floating belts */}
      <div className="flex flex-col gap-3">
        {rows.map((row, i) => (
          <ScrollingRow key={i} items={row.items} rtl={row.rtl} speed={row.speed} size={row.size} onSelect={setSelected} />
        ))}
      </div>

      {/* Portaled UI elements to escape Framer Motion's transform stacking context */}
      {mounted && createPortal(
        <>
          {/* Back button */}
          <button onClick={onBack}
            className="fixed bottom-8 right-6 lg:bottom-12 lg:right-12 z-50 flex items-center gap-3 bg-[#050505]/90 backdrop-blur-md border border-[rgba(255,255,255,0.1)] px-7 py-3.5 rounded-2xl shadow-2xl hover:bg-[#111] hover:border-[rgba(255,255,255,0.2)] hover:scale-105 transition-all duration-300 group">
            <ArrowLeft className="w-5 h-5 text-[#8D8D8D] group-hover:text-[#FDFCFB] group-hover:-translate-x-1 transition-all duration-300" />
            <span className="font-heading uppercase text-[11px] tracking-[0.2em] font-semibold text-[#8D8D8D] group-hover:text-[#FDFCFB] transition-colors">Return</span>
          </button>

          {selected && <PopupCard item={selected} onClose={() => setSelected(null)} />}
        </>,
        document.body
      )}
    </motion.div>
  );
}
