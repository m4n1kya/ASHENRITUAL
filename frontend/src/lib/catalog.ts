/**
 * @fileoverview ASHENRITUAL Permanent Archival Catalog
 * @module catalog.ts
 *
 * Provides a resilient, statically-typed fallback collection for ASHENRITUAL.
 * Guarantees zero downtime, offline capability, and instant rendering even during
 * backend cold starts, network interruptions, or static generation phases.
 */

import type { Product, Category } from "@/types";

export const ASHEN_CATEGORIES: Category[] = [
  { id: "cat-outerwear", name: "Outerwear", slug: "outerwear" },
  { id: "cat-suits", name: "Suits", slug: "suits" },
  { id: "cat-shirts", name: "Shirts", slug: "shirts" },
  { id: "cat-tshirts", name: "T-Shirts", slug: "tshirts" },
  { id: "cat-trousers", name: "Trousers", slug: "trousers" },
  { id: "cat-footwear", name: "Footwear", slug: "footwear" },
  { id: "cat-coats", name: "Coats", slug: "coats" },
];

export const ASHEN_PRODUCTS: Product[] = [
  // ── Outerwear / Jackets ─────────────────────────────────────────────────────
  {
    id: "prod-charcoal-overcoat",
    name: "Charcoal Overcoat",
    description: "Double-breasted overcoat in heavyweight charcoal wool-blend. Knee-length. The architecture of restraint.",
    price: 18990,
    images: ["/images/clothes/Jackets/cmm25223_charcoal_xl.webp"],
    stock: 12,
    categoryId: "cat-outerwear",
    category: { id: "cat-outerwear", name: "Outerwear", slug: "outerwear" },
    tags: ["outerwear", "wool", "winter", "tailored"],
  },
  {
    id: "prod-ash-bomber-jacket",
    name: "Ash Bomber Jacket",
    description: "Minimal bomber in washed black nylon. Ribbed cuffs and hem. No logos, no excess.",
    price: 11490,
    images: ["/images/clothes/Jackets/bmm91526_black_xl.webp"],
    stock: 18,
    categoryId: "cat-outerwear",
    category: { id: "cat-outerwear", name: "Outerwear", slug: "outerwear" },
    tags: ["outerwear", "jacket", "minimal"],
  },
  {
    id: "prod-shadow-field-jacket",
    name: "Shadow Field Jacket",
    description: "Four-pocket field jacket in brushed cotton. Hidden zippers. Designed for movement without compromise.",
    price: 8990,
    images: ["/images/clothes/Jackets/cmm28233_black_xl.webp"],
    stock: 15,
    categoryId: "cat-outerwear",
    category: { id: "cat-outerwear", name: "Outerwear", slug: "outerwear" },
    tags: ["outerwear", "cotton", "structured"],
  },
  {
    id: "prod-obsidian-biker-jacket",
    name: "Obsidian Biker Jacket",
    description: "Structured biker silhouette in obsidian faux-leather. Asymmetric zip. Designed to command.",
    price: 14300,
    images: ["/images/clothes/Jackets/cmm19047_black_xl.webp"],
    stock: 10,
    categoryId: "cat-outerwear",
    category: { id: "cat-outerwear", name: "Outerwear", slug: "outerwear" },
    tags: ["outerwear", "leather", "biker"],
  },
  {
    id: "prod-grey-technical-jacket",
    name: "Grey Technical Jacket",
    description: "Lightweight technical shell in heather grey. Clean construction. Built for the city, not the mountain.",
    price: 9990,
    images: ["/images/clothes/Jackets/bmm10251_grey_xl.webp"],
    stock: 22,
    categoryId: "cat-outerwear",
    category: { id: "cat-outerwear", name: "Outerwear", slug: "outerwear" },
    tags: ["outerwear", "shell", "technical"],
  },
  {
    id: "prod-void-utility-jacket",
    name: "Void Utility Jacket",
    description: "Cropped utility jacket in void black. Oversized pockets. The quietest statement.",
    price: 10490,
    images: ["/images/clothes/Jackets/cmm27650_black_xl.webp"],
    stock: 14,
    categoryId: "cat-outerwear",
    category: { id: "cat-outerwear", name: "Outerwear", slug: "outerwear" },
    tags: ["outerwear", "utility", "black"],
  },
  {
    id: "prod-structured-shell-jacket",
    name: "Structured Shell Jacket",
    description: "Minimal shell jacket with architectural shoulders. Zero branding. Pure form.",
    price: 12490,
    images: ["/images/clothes/Jackets/cmm28234_black_xl.webp"],
    stock: 8,
    categoryId: "cat-outerwear",
    category: { id: "cat-outerwear", name: "Outerwear", slug: "outerwear" },
    tags: ["outerwear", "structured", "shell"],
  },

  // ── Suits ───────────────────────────────────────────────────────────────────
  {
    id: "prod-slate-grey-power-suit",
    name: "Slate Grey Power Suit",
    description: "Structured two-piece in slate grey wool-blend. Peak lapel. This is the suit that closes deals.",
    price: 24990,
    images: ["/images/clothes/Suit/m5056611947048_grey_xl.webp"],
    stock: 6,
    categoryId: "cat-suits",
    category: { id: "cat-suits", name: "Suits", slug: "suits" },
    tags: ["suit", "wool", "tailored", "formal"],
  },
  {
    id: "prod-light-brown-two-piece-suit",
    name: "Light Brown Two-Piece Suit",
    description: "Tailored two-piece suit in warm light brown. Notch lapel. Single-button closure. Authority without effort.",
    price: 22990,
    images: ["/images/clothes/Suit/m5056441127092_light brown_xl.webp"],
    stock: 8,
    categoryId: "cat-suits",
    category: { id: "cat-suits", name: "Suits", slug: "suits" },
    tags: ["suit", "tailored", "luxury"],
  },
  {
    id: "prod-grey-slim-suit",
    name: "Grey Slim Suit",
    description: "Slim-fit suit in a refined grey herringbone. Contemporary lapel. Cut for the intentional man.",
    price: 19990,
    images: ["/images/clothes/Suit/m5056772578747_grey_xl.webp"],
    stock: 10,
    categoryId: "cat-suits",
    category: { id: "cat-suits", name: "Suits", slug: "suits" },
    tags: ["suit", "slim", "herringbone"],
  },
  {
    id: "prod-charcoal-evening-suit",
    name: "Charcoal Evening Suit",
    description: "Evening suit in deep charcoal. Satin lapel trim. The ritual of dressing well, perfected.",
    price: 26990,
    images: ["/images/clothes/Suit/m5059646314410_charcoal_xl.webp"],
    stock: 5,
    categoryId: "cat-suits",
    category: { id: "cat-suits", name: "Suits", slug: "suits" },
    tags: ["suit", "evening", "charcoal"],
  },
  {
    id: "prod-black-formal-suit",
    name: "Black Formal Suit",
    description: "Classic black suit. Single-breasted. Two-button. The one suit you will always reach for.",
    price: 21990,
    images: ["/images/clothes/Suit/m5059646423853_black_xl_2.webp"],
    stock: 12,
    categoryId: "cat-suits",
    category: { id: "cat-suits", name: "Suits", slug: "suits" },
    tags: ["suit", "black", "formal"],
  },

  // ── Shirts ──────────────────────────────────────────────────────────────────
  {
    id: "prod-graphite-overshirt",
    name: "Graphite Overshirt",
    description: "A structured overshirt in matte graphite cotton. Concealed button placket. Designed to layer without volume.",
    price: 4999,
    images: ["/images/clothes/Shirts/cmm24428_black_xl.webp"],
    stock: 35,
    categoryId: "cat-shirts",
    category: { id: "cat-shirts", name: "Shirts", slug: "shirts" },
    tags: ["shirts", "overshirt", "graphite"],
  },
  {
    id: "prod-charcoal-mandarin-shirt",
    name: "Charcoal Mandarin Shirt",
    description: "Band collar. Minimal seams. Washed once for a lived-in softness that never wrinkles under pressure.",
    price: 3499,
    images: ["/images/clothes/Shirts/cmm25434_black_xl.webp"],
    stock: 42,
    categoryId: "cat-shirts",
    category: { id: "cat-shirts", name: "Shirts", slug: "shirts" },
    tags: ["shirts", "mandarin", "linen"],
  },
  {
    id: "prod-formal-navy-shirt",
    name: "Formal Navy Shirt",
    description: "Pure European linen in a deep navy tone. Relaxed fit. The kind of shirt that speaks before you do.",
    price: 3999,
    images: ["/images/clothes/Shirts/6eb00b0b-0d6f-4242-803d-f3ec66a32ca81718972526500-DENNISON-Men-Navy-Blue-Comfort-Regular-Fit-Solid-Formal-Shir-1.webp"],
    stock: 28,
    categoryId: "cat-shirts",
    category: { id: "cat-shirts", name: "Shirts", slug: "shirts" },
    tags: ["shirts", "navy", "formal"],
  },

  // ── T-Shirts ────────────────────────────────────────────────────────────────
  {
    id: "prod-void-black-tee",
    name: "Void Black Tee",
    description: "Heavyweight cotton T-shirt in void black. No print, no logo. Presence through absence.",
    price: 1990,
    images: ["/images/clothes/Tshirts/cmm19350_black_xl.webp"],
    stock: 60,
    categoryId: "cat-tshirts",
    category: { id: "cat-tshirts", name: "T-Shirts", slug: "tshirts" },
    tags: ["tshirts", "cotton", "black"],
  },
  {
    id: "prod-tobacco-washed-tee",
    name: "Tobacco Washed Tee",
    description: "Garment-washed in a rich tobacco tone. Relaxed fit. The kind of shirt you never take off.",
    price: 2290,
    images: ["/images/clothes/Tshirts/cmm25324_tobacco_xl.webp"],
    stock: 45,
    categoryId: "cat-tshirts",
    category: { id: "cat-tshirts", name: "T-Shirts", slug: "tshirts" },
    tags: ["tshirts", "relaxed", "washed"],
  },
  {
    id: "prod-white-minimal-tee",
    name: "White Minimal Tee",
    description: "Clean white in 220gsm cotton. Dropped shoulder. The white tee, done correctly.",
    price: 1790,
    images: ["/images/clothes/Tshirts/cmm25976_white_xl.webp"],
    stock: 55,
    categoryId: "cat-tshirts",
    category: { id: "cat-tshirts", name: "T-Shirts", slug: "tshirts" },
    tags: ["tshirts", "white", "staple"],
  },

  // ── Trousers ────────────────────────────────────────────────────────────────
  {
    id: "prod-architectural-grey-trouser",
    name: "Architectural Grey Trouser",
    description: "Wide-leg trouser in heavy grey cotton twill. Pleated front. Sits at the natural waist. Built for presence.",
    price: 5499,
    images: ["/images/clothes/Trousers/cmm17128_grey_xl.webp"],
    stock: 20,
    categoryId: "cat-trousers",
    category: { id: "cat-trousers", name: "Trousers", slug: "trousers" },
    tags: ["trousers", "pleated", "grey"],
  },

  // ── Footwear ────────────────────────────────────────────────────────────────
  {
    id: "prod-carbon-derby",
    name: "Carbon Derby",
    description: "Full-grain leather derby in deep carbon. Minimal stitching. Blake-stitched sole for a clean profile.",
    price: 9499,
    images: ["/images/clothes/Shoes/bmm40163_black_xl.webp"],
    stock: 22,
    categoryId: "cat-footwear",
    category: { id: "cat-footwear", name: "Footwear", slug: "footwear" },
    tags: ["footwear", "leather", "derby"],
  },
  {
    id: "prod-obsidian-oxford",
    name: "Obsidian Oxford",
    description: "Sleek Oxford in obsidian leather. Cap-toe construction. The shoe that requires no introduction.",
    price: 11490,
    images: ["/images/clothes/Shoes/cmm18272_black_xl.webp"],
    stock: 18,
    categoryId: "cat-footwear",
    category: { id: "cat-footwear", name: "Footwear", slug: "footwear" },
    tags: ["footwear", "oxford", "formal"],
  },
  {
    id: "prod-navy-suede-loafer",
    name: "Navy Suede Loafer",
    description: "Penny loafer in deep navy suede. Leather sole. For those who prefer to arrive quietly.",
    price: 8490,
    images: ["/images/clothes/Shoes/cmm18275_navy_xl.webp"],
    stock: 25,
    categoryId: "cat-footwear",
    category: { id: "cat-footwear", name: "Footwear", slug: "footwear" },
    tags: ["footwear", "loafer", "suede"],
  },
  {
    id: "prod-matte-minimal-sneaker",
    name: "Matte Minimal Sneaker",
    description: "Low-top in matte black leather. Tonal sole. Designed to disappear into any outfit.",
    price: 6999,
    images: ["/images/clothes/Shoes/cmm20242_black_xl_1.webp"],
    stock: 38,
    categoryId: "cat-footwear",
    category: { id: "cat-footwear", name: "Footwear", slug: "footwear" },
    tags: ["footwear", "sneaker", "minimal"],
  },
  {
    id: "prod-shadow-chelsea-boot",
    name: "Shadow Chelsea Boot",
    description: "Chelsea boot in shadow-toned leather. Elastic side panel. Every room quiets when you enter.",
    price: 9990,
    images: ["/images/clothes/Shoes/cmm22531_black_xl.webp"],
    stock: 16,
    categoryId: "cat-footwear",
    category: { id: "cat-footwear", name: "Footwear", slug: "footwear" },
    tags: ["footwear", "boot", "chelsea"],
  },

  // ── Coats ───────────────────────────────────────────────────────────────────
  {
    id: "prod-noir-longline-coat",
    name: "Noir Longline Coat",
    description: "Floor-grazing coat in matte black wool. Minimal lapel. This is not outerwear. This is armour.",
    price: 28990,
    images: ["/images/clothes/Coat/cmm14610_black_xl.webp"],
    stock: 7,
    categoryId: "cat-coats",
    category: { id: "cat-coats", name: "Coats", slug: "coats" },
    tags: ["coats", "wool", "longline"],
  },
];

export interface CatalogQueryOptions {
  category?: string;
  sort?: string;
  query?: string;
  page?: number;
  limit?: number;
}

export interface CatalogQueryResult {
  data: Product[];
  total: number;
  totalPages: number;
  page: number;
  limit: number;
}

/**
 * Filters, sorts, and paginates the ASHEN catalog with pure deterministic logic.
 */
export function filterAndSortCatalog(options: CatalogQueryOptions = {}): CatalogQueryResult {
  const {
    category = "",
    sort = "newest",
    query = "",
    page = 1,
    limit = 12,
  } = options;

  let filtered = [...ASHEN_PRODUCTS];

  // 1. Category Filter
  if (category && category !== "all") {
    const targetSlug = category.toLowerCase().trim();
    filtered = filtered.filter((p) => {
      return (
        p.category?.slug?.toLowerCase() === targetSlug ||
        p.categoryId?.toLowerCase() === targetSlug ||
        p.tags?.some((t) => t.toLowerCase() === targetSlug)
      );
    });
  }

  // 2. Search Query Filter
  if (query && query.trim() !== "") {
    const q = query.toLowerCase().trim();
    filtered = filtered.filter((p) => {
      return (
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category?.name.toLowerCase().includes(q) ||
        p.tags?.some((t) => t.toLowerCase().includes(q))
      );
    });
  }

  // 3. Sorting
  if (sort === "price_asc") {
    filtered.sort((a, b) => a.price - b.price);
  } else if (sort === "price_desc") {
    filtered.sort((a, b) => b.price - a.price);
  }

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const validPage = Math.min(Math.max(1, page), totalPages);
  const startIndex = (validPage - 1) * limit;
  const paginatedData = filtered.slice(startIndex, startIndex + limit);

  return {
    data: paginatedData,
    total,
    totalPages,
    page: validPage,
    limit,
  };
}

/**
 * Retrieves a product by ID or partial match.
 */
export function getCatalogProductById(id: string): Product | null {
  const exact = ASHEN_PRODUCTS.find((p) => p.id === id);
  if (exact) return exact;

  const normalized = id.toLowerCase().replace(/[^a-z0-9]/g, "");
  return (
    ASHEN_PRODUCTS.find((p) =>
      p.id.toLowerCase().replace(/[^a-z0-9]/g, "") === normalized ||
      p.name.toLowerCase().replace(/[^a-z0-9]/g, "") === normalized
    ) || null
  );
}
