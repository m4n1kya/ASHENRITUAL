/**
 * @fileoverview ASHENRITUAL Architecture
 * @module CreatorProfileClient.tsx
 */
"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { MapPin, ArrowRight } from "lucide-react";
import Link from "next/link";

export function CreatorProfileClient({
  creatorId: _creatorId,
}: {
  creatorId: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef });

  const creator = {
    name: "Aryan Kuro",
    location: "Pithoragarh, India",
    specialization: "Minimal Menswear",
    bio: "Independent designer focusing on absolute reduction and architectural tailoring.",
    philosophy:
      "Fashion is not merely about covering the body, but structuring it. I believe in designing garments that act as a rigid, enduring second skin. My process rejects seasonal obsolescence in favor of permanent, monolithic concepts.",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop",
    banner:
      "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=1972&auto=format&fit=crop",
  };

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);

  return (
    <div
      ref={containerRef}
      className="w-full bg-background selection:bg-[#FDFCFB] selection:text-[#0A0A0A] overflow-hidden min-h-screen"
    >
      {/* ── Banner ─────────────────────────────────────────────────────────── */}
      <section className="relative h-[60vh] w-full overflow-hidden border-b border-[rgba(255,255,255,0.03)]">
        <motion.div style={{ y, opacity }} className="absolute inset-0 z-0">
          <Image
            src={creator.banner}
            alt="Banner"
            fill
            className="object-cover grayscale opacity-30"
            priority
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        </motion.div>

        <div className="absolute bottom-0 left-0 w-full z-10 px-6 lg:px-12 pb-16 translate-y-12">
          <div className="mx-auto max-w-screen-2xl flex items-end gap-8">
            <div className="w-32 h-32 lg:w-48 lg:h-48 rounded-full bg-[#111] overflow-hidden border-4 border-background relative shrink-0">
              <Image
                src={creator.avatar}
                alt={creator.name}
                fill
                className="object-cover grayscale"
                unoptimized
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── Profile Content ────────────────────────────────────────────────── */}
      <section className="w-full py-16 px-6 lg:px-12 mx-auto max-w-screen-2xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          <div className="lg:col-span-4 space-y-12">
            <div>
              <h1 className="font-heading text-4xl lg:text-5xl uppercase tracking-wider text-[#FDFCFB] mb-2">
                {creator.name}
              </h1>
              <p className="font-mono text-[10px] uppercase tracking-widest text-[#8D8D8D] flex items-center gap-2 mb-6">
                <MapPin className="w-3 h-3" /> {creator.location}
              </p>
              <p className="font-sans text-sm text-[#A8A8A8] leading-relaxed">
                {creator.bio}
              </p>
            </div>

            <div className="p-8 border border-[rgba(255,255,255,0.05)] bg-[#050505]">
              <h3 className="font-heading text-[10px] uppercase tracking-[0.3em] text-[#8D8D8D] mb-6">
                Affiliated Showrooms
              </h3>
              <Link href="/showrooms/shr_01" className="group block">
                <div className="flex items-center justify-between border-b border-[rgba(255,255,255,0.05)] pb-4">
                  <div>
                    <p className="font-heading text-sm uppercase tracking-widest text-[#E8E8E8] group-hover:text-[#FDFCFB] transition-colors">
                      Atelier Kuro
                    </p>
                    <p className="font-mono text-[9px] uppercase tracking-widest text-[#4A4A4A] mt-1">
                      Pithoragarh
                    </p>
                  </div>
                  <ArrowRight className="w-3 h-3 text-[#4A4A4A] group-hover:text-[#FDFCFB] transition-colors group-hover:translate-x-1 duration-300" />
                </div>
              </Link>
            </div>

            <div className="pt-8">
              <h3 className="font-heading text-[10px] uppercase tracking-[0.3em] text-[#8D8D8D] mb-6 border-b border-[rgba(255,255,255,0.08)] pb-4">
                Collections
              </h3>
              <div className="space-y-5 flex flex-col">
                {[
                  "WINTER 2027",
                  "MONOLITH",
                  "NOIR",
                  "VOID",
                  "ARCHITECTURE OF SILENCE",
                ].map((col) => (
                  <Link
                    key={col}
                    href="#"
                    className="font-heading text-sm uppercase tracking-[0.15em] text-[#A8A8A8] hover:text-[#FDFCFB] hover:translate-x-1 transition-all duration-300"
                  >
                    {col}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-8 lg:pl-12">
            <h2 className="font-display italic text-3xl text-[#FDFCFB] mb-6">
              The Manifesto
            </h2>
            <p className="font-sans text-xl text-[#8D8D8D] leading-relaxed mb-24 max-w-2xl">
              &quot;{creator.philosophy}&quot;
            </p>

            {/* Exhibition Gallery */}
            <div className="space-y-24">
              {/* Concept Section */}
              <div>
                <h3 className="font-heading text-lg uppercase tracking-widest text-[#FDFCFB] mb-8 border-b border-[rgba(255,255,255,0.05)] pb-4">
                  Prototype Archive
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="group cursor-pointer">
                      <div className="aspect-[3/4] bg-[#0A0A0A] overflow-hidden mb-4 border border-[rgba(255,255,255,0.02)] group-hover:border-[rgba(255,255,255,0.1)] transition-colors">
                        <div className="w-full h-full bg-[#111] animate-pulse" />{" "}
                        {/* Placeholder Image */}
                      </div>
                      <p className="font-heading text-xs uppercase tracking-widest text-[#E8E8E8] group-hover:text-[#FDFCFB]">
                        Prototype 00{i}
                      </p>
                      <p className="font-mono text-[9px] tracking-widest text-[#4A4A4A] mt-1 uppercase">
                        Not for sale
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
