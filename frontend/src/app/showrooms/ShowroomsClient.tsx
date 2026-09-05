"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  MotionValue,
} from "framer-motion";
import { CheckCircle, MapPin, Search, ChevronDown, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { Showroom } from "@/types";

/* ══════════════════════════════════════════════════════════════════════════
   SHOWROOMS — DISCOVERY JOURNEY
   ══════════════════════════════════════════════════════════════════════════ */

const FALLBACK_SHOWROOMS: Showroom[] = [
  {
    id: "1",
    name: "AshenRitual Flagship",
    slug: "ashenritual-flagship-mumbai",
    country: "India",
    state: "Maharashtra",
    city: "Mumbai",
    description: "Our primary flagship location in the heart of Mumbai.",
    history: null,
    specialization: "Bespoke tailoring",
    knownFor: "Flagship experience",
    image: null,
    logo: null,
    verification: "verified",
    hours: "10 AM - 8 PM",
  },
  {
    id: "2",
    name: "The Souled Store",
    slug: "the-souled-store-mumbai",
    country: "India",
    state: "Maharashtra",
    city: "Mumbai",
    description:
      "India's largest pop culture merchandise destination, bringing fandom to life.",
    history: null,
    specialization: "Pop culture apparel",
    knownFor: "Graphic tees & oversized fits",
    image:
      "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?q=80&w=1000&auto=format&fit=crop",
    logo: null,
    verification: "verified",
    hours: "11 AM - 9 PM",
  },
  {
    id: "3",
    name: "H&M",
    slug: "hm-new-delhi",
    country: "India",
    state: "Delhi",
    city: "New Delhi",
    description:
      "Global fashion brand offering the latest styles and inspiration for all.",
    history: null,
    specialization: "Fast fashion",
    knownFor: "Trendy collections",
    image:
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1000&auto=format&fit=crop",
    logo: null,
    verification: "verified",
    hours: "10 AM - 10 PM",
  },
  {
    id: "4",
    name: "Westside",
    slug: "westside-bangalore",
    country: "India",
    state: "Karnataka",
    city: "Bangalore",
    description:
      "Tata's premier retail destination offering exclusive brands and contemporary fashion.",
    history: null,
    specialization: "Contemporary Indian & Western wear",
    knownFor: "Nuon & Utsa collections",
    image:
      "https://images.unsplash.com/photo-1582015752624-e8b1c75e3711?q=80&w=1000&auto=format&fit=crop",
    logo: null,
    verification: "verified",
    hours: "11 AM - 9 PM",
  },
  {
    id: "5",
    name: "Zara",
    slug: "zara-mumbai",
    country: "India",
    state: "Maharashtra",
    city: "Mumbai",
    description:
      "One of the largest international fashion companies, keeping up with the latest trends.",
    history: null,
    specialization: "High street fashion",
    knownFor: "Fast trend adaptation",
    image:
      "https://images.unsplash.com/photo-1555529771-835f59fc5efe?q=80&w=1000&auto=format&fit=crop",
    logo: null,
    verification: "verified",
    hours: "11 AM - 10 PM",
  },
  {
    id: "6",
    name: "The Armoury",
    slug: "the-armoury-hong-kong",
    country: "Hong Kong",
    state: "Hong Kong",
    city: "Hong Kong",
    description:
      "An international destination for classic artisanal menswear and bespoke tailoring.",
    history: null,
    specialization: "Classic artisanal menswear",
    knownFor: "Sartorial craftsmanship",
    image:
      "https://images.unsplash.com/photo-1550684376-efcbd6e3f031?q=80&w=1000&auto=format&fit=crop",
    logo: null,
    verification: "verified",
    hours: "11 AM - 8 PM",
  },
  {
    id: "7",
    name: "SuitSupply",
    slug: "suitsupply-amsterdam",
    country: "Netherlands",
    state: "North Holland",
    city: "Amsterdam",
    description:
      "European brand renowned for its expertly crafted men's suits and modern tailoring.",
    history: null,
    specialization: "Men's suits & tailoring",
    knownFor: "Made-to-measure",
    image:
      "https://images.unsplash.com/photo-1603252109303-2751441dd157?q=80&w=1000&auto=format&fit=crop",
    logo: null,
    verification: "verified",
    hours: "10 AM - 7 PM",
  },
];

export function ShowroomsClient({
  initialShowrooms,
}: {
  initialShowrooms: Showroom[];
}) {
  const activeShowrooms =
    initialShowrooms.length > 0 ? initialShowrooms : FALLBACK_SHOWROOMS;
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef });

  const [selection, setSelection] = useState({
    country: "",
    state: "",
    city: "",
  });
  const [isLoaded, setIsLoaded] = useState(false);

  // Extract unique locations from live data
  const locations = useMemo(() => {
    const data = {
      countries: Array.from(
        new Set(activeShowrooms.map((s) => s.country)),
      ).sort(),
      statesByCountry: {} as Record<string, string[]>,
      citiesByState: {} as Record<string, string[]>,
    };

    activeShowrooms.forEach((s) => {
      if (!data.statesByCountry[s.country])
        data.statesByCountry[s.country] = [];
      if (!data.statesByCountry[s.country].includes(s.state))
        data.statesByCountry[s.country].push(s.state);

      if (!data.citiesByState[s.state]) data.citiesByState[s.state] = [];
      if (!data.citiesByState[s.state].includes(s.city))
        data.citiesByState[s.state].push(s.city);
    });

    return data;
  }, [activeShowrooms]);

  useEffect(() => {
    let validLocationFound = false;
    const saved = localStorage.getItem("ashen_showroom_location");

    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Do case-insensitive check just in case
        const matchedCountry = locations.countries.find(
          (c) => c.toLowerCase() === parsed.country?.toLowerCase(),
        );

        if (matchedCountry) {
          const matchedState =
            locations.statesByCountry[matchedCountry]?.find(
              (s) => s.toLowerCase() === parsed.state?.toLowerCase(),
            ) || "";
          const matchedCity = matchedState
            ? locations.citiesByState[matchedState]?.find(
                (c) => c.toLowerCase() === parsed.city?.toLowerCase(),
              ) || ""
            : "";

          setSelection({
            country: matchedCountry,
            state: matchedState,
            city: matchedCity,
          });
          validLocationFound = true;
        }
      } catch {}
    }

    if (!validLocationFound && locations.countries.length > 0) {
      // Default to first available country and state
      const country = locations.countries[0];
      const state = locations.statesByCountry[country]?.[0] || "";
      const city = locations.citiesByState[state]?.[0] || "";
      setSelection({ country, state, city });
    }

    setIsLoaded(true);
  }, [locations]);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(
        "ashen_showroom_location",
        JSON.stringify(selection),
      );
    }
  }, [selection, isLoaded]);

  return (
    <div
      ref={containerRef}
      className="w-full bg-background selection:bg-[#FDFCFB] selection:text-[#0A0A0A] overflow-hidden min-h-screen pb-32"
    >
      <HeroSection scrollYProgress={scrollYProgress} />

      <div className="mx-auto max-w-screen-2xl px-6 lg:px-12 mt-16 lg:mt-32">
        {/* Dropdown Discovery Layer */}
        <div className="mb-24 border-b border-[rgba(255,255,255,0.05)] pb-12 relative z-50">
          <h2 className="font-heading text-[10px] uppercase tracking-[0.4em] text-[#4A4A4A] mb-8">
            Set Location
          </h2>
          <div className="flex flex-col md:flex-row gap-8 lg:gap-16 w-full">
            <div className="w-full md:flex-1">
              <PremiumDropdown
                value={selection.country}
                options={locations.countries}
                onChange={(v) =>
                  setSelection({ country: v, state: "", city: "" })
                }
                placeholder="Select Country"
              />
            </div>

            <AnimatePresence>
              {selection.country && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="w-full md:flex-1"
                >
                  <PremiumDropdown
                    value={selection.state}
                    options={locations.statesByCountry[selection.country] || []}
                    onChange={(v) =>
                      setSelection({ ...selection, state: v, city: "" })
                    }
                    placeholder="Select State"
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {selection.state && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="w-full md:flex-1"
                >
                  <PremiumDropdown
                    value={selection.city}
                    options={locations.citiesByState[selection.state] || []}
                    onChange={(v) => setSelection({ ...selection, city: v })}
                    placeholder="Select City"
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="min-h-[50vh] relative z-10">
          <AnimatePresence mode="wait">
            {isLoaded && selection.city ? (
              <ShowroomGrid
                key={`grid-${selection.city}`}
                city={selection.city}
                showrooms={activeShowrooms}
              />
            ) : isLoaded ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center h-64 border border-[rgba(255,255,255,0.02)] bg-[#050505]"
              >
                <p className="font-heading text-xs uppercase tracking-widest text-[#8D8D8D]">
                  Awaiting location selection
                </p>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

/* ── 1. Hero ─────────────────────────────────────────────────────────────── */
function HeroSection({
  scrollYProgress,
}: {
  scrollYProgress: MotionValue<number>;
}) {
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  return (
    <section className="relative flex h-screen w-full items-center justify-center overflow-hidden border-b border-[rgba(255,255,255,0.03)]">
      <motion.div
        style={{ y, opacity }}
        className="absolute inset-0 z-0 bg-[#050505]"
      >
        <Image
          src="/images/showrooms/showroom-hero-dark.jpg"
          alt="Showrooms Hero"
          fill
          className="object-cover opacity-80"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#050505]/40 to-background z-10" />
      </motion.div>

      <div className="relative z-10 flex flex-col items-center text-center px-6 pointer-events-none">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="font-heading text-[10px] font-semibold uppercase tracking-[0.5em] text-[#8D8D8D] mb-6"
        >
          The Network
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="font-heading text-5xl md:text-7xl lg:text-[110px] font-bold uppercase tracking-tighter text-[#FDFCFB]"
        >
          SHOWROOMS
        </motion.h1>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mt-8 max-w-xl space-y-4"
        >
          <p className="font-display italic text-xl text-[#E8E8E8] md:text-2xl">
            Discover verified menswear houses across the globe.
          </p>
          <p className="font-sans text-[13px] tracking-wide text-[#8D8D8D] leading-relaxed max-w-md mx-auto">
            Every showroom represents its own identity, craftsmanship, and
            curated catalogue. Browse by location and experience menswear beyond
            conventional online shopping.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

/* ── 2. Premium Dropdown ─────────────────────────────────────────────────── */
function PremiumDropdown({
  value,
  options,
  onChange,
  placeholder,
}: {
  value: string;
  options: string[];
  onChange: (v: string) => void;
  placeholder: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="relative w-full"
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setOpen(false);
      }}
    >
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between border-b border-[rgba(255,255,255,0.15)] hover:border-[#FDFCFB] pb-4 text-left focus:outline-none transition-colors duration-300 group"
      >
        <span
          className={cn(
            "font-heading uppercase text-sm tracking-[0.2em] transition-colors",
            value
              ? "text-[#FDFCFB]"
              : "text-[#8D8D8D] group-hover:text-[#A8A8A8]",
          )}
        >
          {value || placeholder}
        </span>
        <ChevronDown
          className={cn(
            "w-4 h-4 transition-transform duration-500 ease-[0.22,1,0.36,1]",
            open
              ? "text-[#FDFCFB] rotate-180"
              : "text-[#8D8D8D] group-hover:text-[#FDFCFB]",
          )}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: 5, filter: "blur(2px)" }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="absolute top-full left-0 w-full mt-2 bg-[#050505] border border-[rgba(255,255,255,0.05)] shadow-2xl z-[999] overflow-hidden"
          >
            {options.map((opt, i) => (
              <motion.button
                key={opt}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  delay: i * 0.05,
                  duration: 0.4,
                  ease: [0.22, 1, 0.36, 1],
                }}
                onClick={() => {
                  onChange(opt);
                  setOpen(false);
                }}
                className={cn(
                  "w-full text-left px-6 py-4 font-heading uppercase text-xs tracking-[0.2em] transition-colors",
                  value === opt
                    ? "text-[#FDFCFB] bg-[rgba(255,255,255,0.05)]"
                    : "text-[#8D8D8D] hover:text-[#FDFCFB] hover:bg-[#0A0A0A]",
                )}
              >
                {opt}
              </motion.button>
            ))}
            {options.length === 0 && (
              <div className="px-6 py-4 font-heading uppercase text-xs tracking-widest text-[#4A4A4A]">
                No options available
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── 3. Showroom Grid ────────────────────────────────────────────────────── */
function ShowroomGrid({
  city,
  showrooms,
}: {
  city: string;
  showrooms: Showroom[];
}) {
  const filtered = showrooms.filter((s) => s.city === city);

  if (filtered.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="flex flex-col items-center justify-center py-24 border border-[rgba(255,255,255,0.02)] bg-[#050505]"
      >
        <h3 className="font-heading text-lg uppercase tracking-widest text-[#4A4A4A] mb-2">
          No Showrooms
        </h3>
        <p className="font-sans text-xs text-[#4A4A4A]">
          There are currently no verified showrooms in {city}.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="flex items-center justify-between mb-12">
        <h2 className="font-display italic text-2xl text-[#E8E8E8]">
          Showrooms in {city}
        </h2>
        <div className="flex gap-4">
          <button className="text-[10px] font-heading uppercase tracking-widest text-[#8D8D8D] hover:text-[#FDFCFB] transition-colors flex items-center gap-2">
            <Search className="w-3 h-3" /> Filter Specialization
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-12 lg:gap-16">
        {filtered.map((store, i) => (
          <Link key={store.id} href={`/showrooms/${store.slug}`}>
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{
                delay: i * 0.1,
                duration: 0.8,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="group cursor-pointer relative"
            >
              {/* Image Container */}
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#050505] border border-[rgba(255,255,255,0.02)] group-hover:border-[rgba(255,255,255,0.1)] transition-colors duration-700">
                {store.image ? (
                  <Image
                    src={store.image}
                    alt={store.name}
                    fill
                    className="object-cover grayscale opacity-70 group-hover:opacity-100 group-hover:scale-[1.03] transition-all duration-[2000ms] ease-[0.22,1,0.36,1]"
                  />
                ) : (
                  <div className="absolute inset-0 bg-[#0A0A0A]" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-80 group-hover:opacity-40 transition-opacity duration-700" />

                {/* Logo & Verified Badge Overlay */}
                <div className="absolute top-4 w-full px-4 flex justify-between items-start">
                  <div className="w-10 h-10 bg-[#111] border border-[rgba(255,255,255,0.1)] rounded-full overflow-hidden relative shadow-2xl">
                    {store.logo && (
                      <Image
                        src={store.logo}
                        alt="Logo"
                        fill
                        className="object-cover"
                      />
                    )}
                  </div>
                  {store.verification && (
                    <div className="flex items-center gap-1.5 bg-[#050505]/80 backdrop-blur-md px-3 py-1.5 border border-[rgba(255,255,255,0.1)]">
                      <CheckCircle className="w-3 h-3 text-[#FDFCFB]" />
                      <span className="font-heading text-[8px] uppercase tracking-[0.2em] text-[#FDFCFB]">
                        Verified
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Info Panel */}
              <div className="pt-6 relative">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-heading text-2xl uppercase tracking-wide text-[#FDFCFB] mb-1 group-hover:text-white transition-colors">
                      {store.name}
                    </h3>
                    <div className="flex items-center gap-2 text-[10px] font-mono tracking-widest text-[#8D8D8D] uppercase">
                      <MapPin className="w-3 h-3" />
                      {store.city}, {store.state}
                    </div>
                  </div>
                  <div className="text-right flex flex-col items-end gap-2">
                    <span className="inline-block border border-[#333] px-3 py-1 text-[9px] font-heading uppercase tracking-widest text-[#A8A8A8] group-hover:border-[#666] group-hover:text-[#E8E8E8] transition-colors">
                      {store.knownFor || "Showroom"}
                    </span>
                    <div className="flex items-center gap-1.5 text-[#8D8D8D] text-[10px] font-mono uppercase tracking-widest">
                      <Users className="w-3 h-3" />
                      {store._count?.creators || 0} Designers
                    </div>
                  </div>
                </div>
                <p className="font-sans text-[13px] text-[#A8A8A8] leading-relaxed line-clamp-2 pr-8 mt-4">
                  {store.specialization || store.description}
                </p>
              </div>
            </motion.div>
          </Link>
        ))}
      </div>
    </motion.div>
  );
}
