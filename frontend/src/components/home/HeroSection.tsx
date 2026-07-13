"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative h-screen w-full overflow-hidden bg-background">
      {/* Background Image */}
      <motion.div 
        initial={{ scale: 1.05, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.6 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="absolute inset-0 z-0"
      >
        <Image
          src="/images/hero.png"
          alt="ASHENRITUAL Cinematic Fashion"
          fill
          priority
          className="object-cover object-center"
          quality={100}
        />
        {/* Gradient Overlay for Text Readability and Mood */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-background/50" />
      </motion.div>

      {/* Content */}
      <div className="relative z-10 flex h-full flex-col justify-end px-6 pb-24 md:px-16 md:pb-32 lg:px-32">
        <div className="max-w-3xl">
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
            className="font-heading text-6xl uppercase tracking-tighter text-primary sm:text-8xl lg:text-9xl"
          >
            Confidence <br />
            <span className="text-muted-foreground">is quiet.</span>
          </motion.h1>
          
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.7, ease: "easeOut" }}
            className="mt-6 max-w-xl font-sans text-lg font-light leading-relaxed text-secondary-foreground md:text-xl"
          >
            Luxury doesn't need to shout. Every piece is intentional. Fashion is identity, not attention.
          </motion.p>

          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.9, ease: "easeOut" }}
            className="mt-10 flex flex-col items-start gap-6 sm:flex-row sm:items-center"
          >
            <Link
              href="/shop"
              className="group flex h-14 items-center justify-center gap-4 bg-primary px-10 text-sm font-medium uppercase tracking-widest text-primary-foreground transition-all hover:bg-white/90"
            >
              Explore The Ritual
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/vesper"
              className="group flex h-14 items-center justify-center gap-4 border border-border bg-transparent px-10 text-sm font-medium uppercase tracking-widest text-primary transition-all hover:bg-white/5"
            >
              Consult VESPER
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

