/**
 * @fileoverview ASHENRITUAL Architecture
 * @module vesper.store.ts
 */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface VesperMessage {
  id: string;
  role: 'user' | 'model';
  content: string; // The text content
  actions?: VesperAction[];
  recommendations?: VesperRecommendationData;
  isStreaming?: boolean;
}

export interface VesperAction {
  label: string;
  type: 'route' | 'product' | 'chapter' | 'collection' | 'forge' | 'showrooms' | 'sanctum' | 'beyond' | 'shop' | 'cart';
  target: string;
}

export interface VesperRecommendationData {
  type: 'ritual' | 'products' | 'none';
  products: {
    id: string;
    reason: string;
    confidence: number;
    // We will hydrate product details (name, price, image) via a separate API call or it can be returned by backend
    // For now, we assume the backend returns basic product info or we fetch it. 
    // Wait, the backend currently only returns ID and Reason according to the schema. We should fetch details or pass them from backend.
    // Let's assume the backend provides enough to render the card, or the frontend fetches the rest.
  }[];
}

interface VesperState {
  messages: VesperMessage[];
  isOpen: boolean; // For global overlay if needed
  addMessage: (msg: VesperMessage) => void;
  updateMessage: (id: string, updates: Partial<VesperMessage>) => void;
  clearMessages: () => void;
  setIsOpen: (isOpen: boolean) => void;
}

export const useVesperStore = create<VesperState>()(
  persist(
    (set) => ({
      messages: [],
      isOpen: false,
      addMessage: (msg) => set((state) => ({ messages: [...state.messages, msg] })),
      updateMessage: (id, updates) => set((state) => ({
        messages: state.messages.map((m) => m.id === id ? { ...m, ...updates } : m)
      })),
      clearMessages: () => set({ messages: [] }),
      setIsOpen: (isOpen) => set({ isOpen }),
    }),
    {
      name: 'vesper-storage',
      // Only persist messages for a short time or keep it across reloads.
      // We will clear it explicitly on logout.
    }
  )
);
