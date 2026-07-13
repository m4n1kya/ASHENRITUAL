"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const chapters = [
  {
    id: "fw26",
    title: "Forged Today",
    description: "The latest arrivals for the modern wardrobe.",
    image: "/images/product.png",
    link: "/chapters/forged-today",
  },
  {
    id: "essentials",
    title: "The Foundation",
    description: "Timeless silhouettes that never speak out of turn.",
    image: "/images/texture.png",
    link: "/chapters/foundation",
  },
];

export function FeaturedChapters() {
  return (
    <section className="bg-background px-6 py-24 md:px-16 lg:px-32 lg:py-32">
      <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
        <div className="max-w-2xl">
          <motion.h2 
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="font-heading text-5xl uppercase tracking-tighter text-primary md:text-7xl"
          >
            Curated Chapters
          </motion.h2>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-4 font-sans text-lg text-muted-foreground"
          >
            Explore collections designed for restraint, precision, and architectural elegance.
          </motion.p>
        </div>
        <Link href="/catalog" className="group flex items-center gap-2 text-sm uppercase tracking-widest text-primary transition-colors hover:text-muted-foreground">
          View All Chapters <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
        </Link>
      </div>

      <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:gap-12">
        {chapters.map((chapter, index) => (
          <Link key={chapter.id} href={chapter.link} className="group block">
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.8, delay: index * 0.2, ease: "easeOut" }}
              className="relative aspect-[4/5] overflow-hidden bg-card"
            >
              <Image
                src={chapter.image}
                alt={chapter.title}
                fill
                className="object-cover object-center transition-transform duration-1000 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/20 transition-opacity duration-500 group-hover:bg-black/40" />
              <div className="absolute inset-x-0 bottom-0 flex flex-col p-8 bg-gradient-to-t from-background/90 to-transparent">
                <h3 className="font-heading text-4xl uppercase tracking-tight text-primary">
                  {chapter.title}
                </h3>
                <p className="mt-2 font-sans text-sm text-secondary-foreground">
                  {chapter.description}
                </p>
              </div>
            </motion.div>
          </Link>
        ))}
      </div>
    </section>
  );
}
