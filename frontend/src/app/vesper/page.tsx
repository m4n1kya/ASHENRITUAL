'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, ArrowRight, ChevronDown } from 'lucide-react';
import { useAuthStore } from '@/store/auth.store';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import type { Product } from '@/types';

const EASE = [0.4, 0, 0.2, 1] as const;

// ── Types ─────────────────────────────────────────────────────────────────

interface VesperParams {
  occasion: string;
  weather: string;
  dressCode: string;
  palette: string;
  silhouette: string;
}

interface VesperRecommendation {
  id: string;
  title: string;
  description: string;
  stylingNotes: string;
  products: Product[]; // The actual matched products
}

// ── Options ────────────────────────────────────────────────────────────────

const OPTIONS = {
  occasion: ['Formal Gala', 'Creative Agency', 'Travel & Transit', 'Evening Dinner', 'Everyday Minimal'],
  weather: ['Deep Winter', 'Transitional Autumn', 'Spring Rain', 'High Summer Heat'],
  dressCode: ['Strictly Formal', 'Smart Casual', 'Avant-Garde', 'Utilitarian'],
  palette: ['Monochrome (Black/White)', 'Earth & Stone', 'Midnight & Navy', 'Brutalist Grey'],
  silhouette: ['Oversized & Relaxed', 'Tailored & Sharp', 'Draped & Fluid'],
};

// ── Components ─────────────────────────────────────────────────────────────

export default function VesperPage() {
  const { token } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [params, setParams] = useState<VesperParams>({
    occasion: '',
    weather: '',
    dressCode: '',
    palette: '',
    silhouette: '',
  });
  
  const [recommendation, setRecommendation] = useState<VesperRecommendation | null>(null);

  // Lock Vesper to dark mode for atmosphere
  useEffect(() => {
    const html = document.documentElement;
    const prev = html.getAttribute('data-theme') ?? 'dark';
    const prevClass = html.className;
    html.setAttribute('data-theme', 'dark');
    html.classList.add('dark');
    return () => {
      html.setAttribute('data-theme', prev);
      html.className = prevClass;
    };
  }, []);

  const handleConsult = async () => {
    if (!token) {
      toast.error('Authentication Required', { description: 'Sign in to access Vesper Intelligence.' });
      return;
    }

    // Validate all selected
    if (Object.values(params).some(v => !v)) {
      toast.error('Incomplete Parameters', { description: 'Provide all context for accurate curation.' });
      return;
    }

    setLoading(true);
    try {
      // Mocking the API call for now. 
      // The backend will receive these params, query Gemini for structured JSON, and map it to DB products.
      /*
      const res = await api.post<VesperRecommendation>(
        '/vesper/consult',
        params,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setRecommendation(res);
      */
      
      // MOCK DELAY & RESPONSE
      await new Promise(r => setTimeout(r, 2500));
      setRecommendation({
        id: 'curation-001',
        title: 'The Architect\'s Uniform',
        description: 'A restrained, structural approach balancing strict formality with fluid comfort.',
        stylingNotes: 'Anchor the silhouette with the tailored coat. Layer the draped tee underneath to soften the rigid geometry. Keep accessories brutalist and minimal.',
        products: [] // Mock products would go here in reality
      });
      
    } catch (err) {
      toast.error('Intelligence Offline', { description: 'Vesper is currently unresponsive.' });
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setRecommendation(null);
    setParams({ occasion: '', weather: '', dressCode: '', palette: '', silhouette: '' });
  };

  return (
    <main className="flex min-h-screen flex-col bg-background pt-16 texture-grain relative">
      {/* Background Texture */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <Image
          src="/images/natural-texture.jpg"
          alt="Natural Texture"
          fill
          className="object-cover opacity-30 mix-blend-overlay"
          quality={100}
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-background" />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-1 flex-col px-8 py-16 lg:px-12">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16 flex flex-col items-center text-center"
        >
          <p className="font-heading text-[10px] font-medium uppercase tracking-[0.4em] text-muted-foreground">
            Wardrobe Intelligence
          </p>
          <h1 className="mt-4 font-heading text-4xl font-bold uppercase tracking-[0.1em] text-foreground md:text-6xl">
            Vesper
          </h1>
          {!recommendation && (
            <p className="mt-6 max-w-lg text-sm leading-relaxed text-muted-foreground">
              Define the parameters of your environment. Vesper will curate a precise, structural uniform tailored to the context.
            </p>
          )}
        </motion.div>

        <AnimatePresence mode="wait">
          {!recommendation ? (
            /* ── PARAMETER FORM ── */
            <motion.div
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: EASE }}
              className="mx-auto w-full max-w-2xl space-y-12"
            >
              {Object.entries(OPTIONS).map(([key, options], i) => (
                <motion.div 
                  key={key}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="group relative border-b border-border pb-8"
                >
                  <label className="mb-4 block font-heading text-[10px] font-medium uppercase tracking-[0.25em] text-foreground/70">
                    0{i + 1} — {key.replace(/([A-Z])/g, ' $1').trim()}
                  </label>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-2">
                    {options.map((opt) => {
                      const isSelected = params[key as keyof VesperParams] === opt;
                      return (
                        <button
                          key={opt}
                          onClick={() => setParams(p => ({ ...p, [key]: opt }))}
                          className={cn(
                            "flex items-center justify-between border px-5 py-4 text-left text-xs transition-all duration-300",
                            isSelected 
                              ? "border-foreground bg-foreground text-background" 
                              : "border-border bg-transparent text-muted-foreground hover:border-foreground/50 hover:text-foreground"
                          )}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              ))}

              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="flex justify-center pt-8"
              >
                <button
                  onClick={handleConsult}
                  disabled={loading}
                  className="group relative flex h-14 items-center justify-center overflow-hidden border border-border bg-transparent px-12 font-heading text-[11px] font-semibold uppercase tracking-[0.3em] text-foreground transition-all duration-500 hover:border-foreground hover:bg-foreground hover:text-background disabled:opacity-50"
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      Consult Vesper
                      <ArrowRight className="ml-4 h-3.5 w-3.5 transition-transform duration-500 group-hover:translate-x-1" />
                    </>
                  )}
                </button>
              </motion.div>
            </motion.div>
          ) : (
            /* ── EDITORIAL RESULT ── */
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: EASE }}
              className="w-full"
            >
              <div className="mx-auto max-w-4xl border border-border bg-card/40 p-8 backdrop-blur-md md:p-16">
                <div className="mb-12 border-b border-border pb-12">
                  <h2 className="font-gothic text-4xl text-foreground md:text-5xl lg:text-6xl">
                    {recommendation.title}
                  </h2>
                  <p className="mt-6 max-w-2xl font-serif text-lg leading-relaxed text-muted-foreground md:text-xl">
                    {recommendation.description}
                  </p>
                </div>

                <div className="grid gap-12 lg:grid-cols-2">
                  <div>
                    <h3 className="mb-6 font-heading text-[10px] font-semibold uppercase tracking-[0.3em] text-foreground">
                      Styling Directive
                    </h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {recommendation.stylingNotes}
                    </p>
                  </div>
                  <div>
                    <h3 className="mb-6 font-heading text-[10px] font-semibold uppercase tracking-[0.3em] text-foreground">
                      The Pieces
                    </h3>
                    <div className="space-y-4">
                      {/* Placeholder for actual mapped products */}
                      <div className="flex items-center gap-4 border border-border bg-background/50 p-4">
                        <div className="h-16 w-12 bg-border/50" />
                        <div>
                          <p className="font-heading text-[10px] font-bold uppercase tracking-[0.2em] text-foreground">Obsidian Overcoat</p>
                          <p className="text-xs text-muted-foreground">Outerwear</p>
                        </div>
                        <button className="ml-auto text-[10px] uppercase tracking-widest hover:text-foreground">View</button>
                      </div>
                      <div className="flex items-center gap-4 border border-border bg-background/50 p-4">
                        <div className="h-16 w-12 bg-border/50" />
                        <div>
                          <p className="font-heading text-[10px] font-bold uppercase tracking-[0.2em] text-foreground">Structured Trouser</p>
                          <p className="text-xs text-muted-foreground">Bottoms</p>
                        </div>
                        <button className="ml-auto text-[10px] uppercase tracking-widest hover:text-foreground">View</button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-16 flex justify-center pt-8 border-t border-border">
                  <button
                    onClick={reset}
                    className="text-[10px] font-medium uppercase tracking-[0.3em] text-muted-foreground hover:text-foreground"
                  >
                    Reset Parameters
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
