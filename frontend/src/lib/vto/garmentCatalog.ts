/**
 * @fileoverview ASHENRITUAL Vesper Mirror — Garment Catalogue & Asset Mapping
 * @module garmentCatalog.ts
 */

export interface TryOnProduct {
  id: string;
  name: string;
  subtitle: string;
  category: "jackets" | "shirts" | "tshirts" | "suits";
  price: number;
  image: string;
  description: string;
  stock: number;
  is3DSupported: boolean;
  model3DPath?: string;
  overlay2DPath: string;
  fitProfile: "Snug" | "Standard" | "Relaxed";
  colors: string[];
}

export const ASHEN_TRYON_CATALOGUE: TryOnProduct[] = [
  // ─── 1. BIKER & LEATHER JACKETS (3D MESH) ──────────────────────────────────
  {
    id: "obsidian-biker-jacket",
    name: "Obsidian Biker Jacket",
    subtitle: "Architectural Outerwear",
    category: "jackets",
    price: 14300,
    image: "/images/clothes/Jackets/cmm19047_black_xl.webp",
    description: "Structured biker silhouette in obsidian faux-leather. Asymmetric zip. Designed to command.",
    stock: 10,
    is3DSupported: true,
    model3DPath: "/3dmodels/garments/leatherjacket.glb",
    overlay2DPath: "/images/clothes/Jackets/cmm19047_black_xl.webp",
    fitProfile: "Standard",
    colors: ["#0A0A0A", "#1C1C1C"],
  },

  // ─── 2. BOMBER & SHELL JACKETS (3D MESH) ───────────────────────────────────
  {
    id: "ash-bomber-jacket",
    name: "Ash Bomber Jacket",
    subtitle: "Minimalist Utility Shell",
    category: "jackets",
    price: 11490,
    image: "/images/clothes/Jackets/bmm91526_black_xl.webp",
    description: "Minimal bomber in washed black nylon. Ribbed cuffs and hem. Zero logos, pure form.",
    stock: 18,
    is3DSupported: true,
    model3DPath: "/3dmodels/garments/baseballjacket.glb",
    overlay2DPath: "/images/clothes/Jackets/bmm91526_black_xl.webp",
    fitProfile: "Relaxed",
    colors: ["#141414", "#262626"],
  },
  {
    id: "structured-shell-jacket",
    name: "Structured Shell Jacket",
    subtitle: "Sharp Shoulder Technical Shell",
    category: "jackets",
    price: 12490,
    image: "/images/clothes/Jackets/cmm28234_black_xl.webp",
    description: "Minimal shell jacket with architectural shoulders. Engineered for clean silhouettes.",
    stock: 8,
    is3DSupported: true,
    model3DPath: "/3dmodels/garments/baseballjacket.glb",
    overlay2DPath: "/images/clothes/Jackets/cmm28234_black_xl.webp",
    fitProfile: "Standard",
    colors: ["#0C0C0C"],
  },

  // ─── 3. OVERCOATS & PUFFERS (3D MESH) ──────────────────────────────────────
  {
    id: "charcoal-overcoat",
    name: "Charcoal Overcoat",
    subtitle: "Heavyweight Double-Breasted",
    category: "jackets",
    price: 18990,
    image: "/images/clothes/Jackets/cmm25223_charcoal_xl.webp",
    description: "Double-breasted overcoat in heavyweight charcoal wool-blend. The architecture of restraint.",
    stock: 12,
    is3DSupported: true,
    model3DPath: "/3dmodels/garments/puffajacket.glb",
    overlay2DPath: "/images/clothes/Jackets/cmm25223_charcoal_xl.webp",
    fitProfile: "Relaxed",
    colors: ["#242426", "#141416"],
  },

  // ─── 4. T-SHIRTS (3D MESH) ────────────────────────────────────────────────
  {
    id: "void-black-tee",
    name: "Void Black Tee",
    subtitle: "Heavyweight Boxy Cut",
    category: "tshirts",
    price: 1990,
    image: "/images/clothes/Tshirts/cmm19350_black_xl.webp",
    description: "Heavyweight 280 GSM cotton T-shirt in void black. No print, no logo. Presence through absence.",
    stock: 60,
    is3DSupported: true,
    model3DPath: "/3dmodels/garments/basictee.glb",
    overlay2DPath: "/images/clothes/Tshirts/cmm19350_black_xl.webp",
    fitProfile: "Standard",
    colors: ["#0A0A0A"],
  },
  {
    id: "tobacco-washed-tee",
    name: "Tobacco Washed Tee",
    subtitle: "Mineral-Washed Essential",
    category: "tshirts",
    price: 2290,
    image: "/images/clothes/Tshirts/cmm25324_tobacco_xl.webp",
    description: "Garment-washed in a rich tobacco tone. Relaxed drape with refined neck ribbing.",
    stock: 45,
    is3DSupported: true,
    model3DPath: "/3dmodels/garments/basictee.glb",
    overlay2DPath: "/images/clothes/Tshirts/cmm25324_tobacco_xl.webp",
    fitProfile: "Relaxed",
    colors: ["#3D2E24", "#241B15"],
  },

  // ─── 5. SHIRTS & OVERSHIRTS (3D MESH) ──────────────────────────────────────
  {
    id: "graphite-overshirt",
    name: "Graphite Overshirt",
    subtitle: "Concealed Placket Layer",
    category: "shirts",
    price: 4999,
    image: "/images/clothes/Shirts/cmm24428_black_xl.webp",
    description: "A structured overshirt in matte graphite cotton. Designed to layer without excess volume.",
    stock: 35,
    is3DSupported: true,
    model3DPath: "/3dmodels/garments/smartshirttop.glb",
    overlay2DPath: "/images/clothes/Shirts/cmm24428_black_xl.webp",
    fitProfile: "Standard",
    colors: ["#1F1F21", "#121213"],
  },
  {
    id: "charcoal-mandarin-shirt",
    name: "Charcoal Mandarin Shirt",
    subtitle: "Band Collar Minimalist Cut",
    category: "shirts",
    price: 3499,
    image: "/images/clothes/Shirts/cmm25434_black_xl.webp",
    description: "Band collar. Minimal seams. Pre-washed for a lived-in softness that holds its shape.",
    stock: 42,
    is3DSupported: true,
    model3DPath: "/3dmodels/garments/smartshirttop.glb",
    overlay2DPath: "/images/clothes/Shirts/cmm25434_black_xl.webp",
    fitProfile: "Snug",
    colors: ["#1B1B1D"],
  },

  // ─── 6. TAILORED SUITS (3D MESH) ──────────────────────────────────────────
  {
    id: "slate-grey-power-suit",
    name: "Slate Grey Power Suit",
    subtitle: "Peak Lapel Structured Wool",
    category: "suits",
    price: 24990,
    image: "/images/clothes/Suit/m5056611947048_grey_xl.webp",
    description: "Structured two-piece in slate grey wool-blend. Peak lapel. Architectural tailoring at its peak.",
    stock: 6,
    is3DSupported: true,
    model3DPath: "/3dmodels/garments/suitjacket.glb",
    overlay2DPath: "/images/clothes/Suit/m5056611947048_grey_xl.webp",
    fitProfile: "Snug",
    colors: ["#3D4044", "#26282B"],
  },
  {
    id: "charcoal-evening-suit",
    name: "Charcoal Evening Suit",
    subtitle: "Satin-Trimmed Ceremonial Cut",
    category: "suits",
    price: 26990,
    image: "/images/clothes/Suit/m5059646314410_charcoal_xl.webp",
    description: "Evening suit in deep charcoal. Satin lapel trim. The discipline of dressing well, perfected.",
    stock: 5,
    is3DSupported: true,
    model3DPath: "/3dmodels/garments/suitjacket.glb",
    overlay2DPath: "/images/clothes/Suit/m5059646314410_charcoal_xl.webp",
    fitProfile: "Snug",
    colors: ["#1A1A1C"],
  },

  // ─── 7. KNITWEAR & FIELD JACKETS (3D MESH) ────────────────────────────────
  {
    id: "shadow-field-jacket",
    name: "Shadow Field Jacket",
    subtitle: "Brushed Cotton Multi-Pocket",
    category: "jackets",
    price: 8990,
    image: "/images/clothes/Jackets/cmm28233_black_xl.webp",
    description: "Four-pocket field jacket in brushed cotton. Hidden hardware. Built for movement without compromise.",
    stock: 15,
    is3DSupported: true,
    model3DPath: "/3dmodels/garments/cableknitjumper.glb",
    overlay2DPath: "/images/clothes/Jackets/cmm28233_black_xl.webp",
    fitProfile: "Standard",
    colors: ["#141416"],
  },
];
