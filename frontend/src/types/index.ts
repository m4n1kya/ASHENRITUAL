// ─── Product Domain ────────────────────────────────────────────────────────────

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface Review {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  user?: Pick<User, 'id' | 'email'>;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  stock: number;
  categoryId: string;
  category: Category;
  reviews?: Review[];
  tags?: string[];
  createdAt?: string;
}

// ─── Collections / Chapters ────────────────────────────────────────────────────

export interface Chapter {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  products?: Product[];
}

// ─── Orders / Archive ──────────────────────────────────────────────────────────

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'refunded';

export interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  product: Product;
}

export interface Archive {
  id: string;
  total: number;
  status: OrderStatus;
  createdAt: string;
  updatedAt?: string;
  items: OrderItem[];
  shippingAddress?: Address;
}

// ─── Auth / User ───────────────────────────────────────────────────────────────

export type UserRole = 'USER' | 'CREATOR' | 'SHOWROOM_OWNER' | 'MODERATOR' | 'ADMIN';

export interface User {
  id: string;
  email: string;
  username: string;
  displayName: string | null;
  avatar: string | null;
  banner: string | null;
  bio: string | null;
  location: string | null;
  role: UserRole;
  createdAt?: string;
  creatorProfile?: Creator;
}

export interface Creator {
  id: string;
  userId: string;
  verified: boolean;
  specialization: string | null;
  concepts?: Concept[];
}

export type ConceptStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';

export interface Concept {
  id: string;
  creatorId: string;
  title: string;
  slug: string;
  description: string | null;
  image: string;
  status: ConceptStatus;
  materials: string[];
  software: string[];
  tags: string[];
  createdAt: string;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

// ─── Cart ──────────────────────────────────────────────────────────────────────

export interface Showroom {
  id: string;
  name: string;
  slug: string;
  city: string;
  state: string;
  country: string;
  description: string;
  history: string | null;
  specialization: string | null;
  knownFor: string | null;
  image: string | null;
  logo: string | null;
  verification: string | null;
  hours: string | null;
  _count?: {
    creators: number;
    products: number;
  };
}

export interface CartItem {
  product: Product;
  quantity: number;
}

// ─── API Response Wrappers ─────────────────────────────────────────────────────

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

// ─── VESPER (AI Wardrobe Intelligence) ─────────────────────────────────────────

export interface VesperMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: string;
}

export interface VesperSession {
  id: string;
  messages: VesperMessage[];
  createdAt: string;
}

