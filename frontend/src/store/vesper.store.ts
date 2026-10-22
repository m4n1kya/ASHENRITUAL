/**
 * @fileoverview ASHENRITUAL Architecture
 * @module vesper.store.ts
 */
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

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
  type:
    | 'route'
    | 'product'
    | 'chapter'
    | 'collection'
    | 'forge'
    | 'showrooms'
    | 'sanctum'
    | 'beyond'
    | 'shop'
    | 'cart';
  target: string;
}

export interface VesperRecommendationData {
  type: 'ritual' | 'products' | 'none';
  products: {
    id: string;
    reason: string;
    confidence: number;
  }[];
}

export interface VesperChatSession {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  messages: VesperMessage[];
}

interface VesperState {
  sessions: VesperChatSession[];
  currentSessionId: string | null;
  messages: VesperMessage[];
  isOpen: boolean;

  // Session actions
  createNewSession: () => string;
  selectSession: (sessionId: string) => void;
  deleteSession: (sessionId: string) => void;
  clearAllSessions: () => void;

  // Message actions (synced with active session)
  addMessage: (msg: VesperMessage) => void;
  updateMessage: (id: string, updates: Partial<VesperMessage>) => void;
  clearMessages: () => void;
  setIsOpen: (isOpen: boolean) => void;
}

export function formatSessionTime(timestamp: number): string {
  if (!timestamp) return 'Recent';
  const now = Date.now();
  const diff = Math.max(0, now - timestamp);
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 3600000);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days}d ago`;
  return new Date(timestamp).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

let sessionCounter = 0;
export function generateSessionId(): string {
  sessionCounter = (sessionCounter + 1) % 1000000;
  return `session-${Date.now()}-${sessionCounter}-${Math.random().toString(36).substring(2, 7)}`;
}

export const useVesperStore = create<VesperState>()(
  persist(
    (set, get) => ({
      sessions: [],
      currentSessionId: null,
      messages: [],
      isOpen: false,

      createNewSession: () => {
        const newId = generateSessionId();
        set({
          currentSessionId: newId,
          messages: [],
        });
        return newId;
      },

      selectSession: (sessionId: string) => {
        const session = get().sessions.find((s) => s.id === sessionId);
        if (session) {
          set({
            currentSessionId: session.id,
            messages: session.messages,
          });
        }
      },

      deleteSession: (sessionId: string) => {
        const remaining = get().sessions.filter((s) => s.id !== sessionId);
        const isCurrent = get().currentSessionId === sessionId;
        set({
          sessions: remaining,
          ...(isCurrent
            ? {
                currentSessionId: remaining[0]?.id || null,
                messages: remaining[0]?.messages || [],
              }
            : {}),
        });
      },

      clearAllSessions: () => {
        set({
          sessions: [],
          currentSessionId: null,
          messages: [],
        });
      },

      addMessage: (msg) => {
        set((state) => {
          let currentId = state.currentSessionId;
          let nextSessions = [...state.sessions];

          let sessionIndex = currentId
            ? nextSessions.findIndex((s) => s.id === currentId)
            : -1;

          if (sessionIndex === -1) {
            currentId = currentId || generateSessionId();
            const title =
              msg.role === 'user'
                ? msg.content.trim().slice(0, 36) || 'New Consultation'
                : 'Consultation';

            const newSession: VesperChatSession = {
              id: currentId,
              title,
              createdAt: Date.now(),
              updatedAt: Date.now(),
              messages: [msg],
            };

            nextSessions = [newSession, ...nextSessions];
            return {
              currentSessionId: currentId,
              messages: [msg],
              sessions: nextSessions,
            };
          } else {
            const existingSession = nextSessions[sessionIndex];
            const isFirstUserMsg =
              msg.role === 'user' &&
              !existingSession.messages.some((m) => m.role === 'user');

            const updatedSession: VesperChatSession = {
              ...existingSession,
              title: isFirstUserMsg
                ? msg.content.trim().slice(0, 36) || existingSession.title
                : existingSession.title,
              updatedAt: Date.now(),
              messages: [...existingSession.messages, msg],
            };

            nextSessions.splice(sessionIndex, 1);
            nextSessions = [updatedSession, ...nextSessions];

            return {
              currentSessionId: currentId,
              messages: updatedSession.messages,
              sessions: nextSessions,
            };
          }
        });
      },

      updateMessage: (id, updates) => {
        set((state) => {
          const nextMessages = state.messages.map((m) =>
            m.id === id ? { ...m, ...updates } : m
          );

          const nextSessions = state.sessions.map((s) => {
            if (s.id === state.currentSessionId) {
              return {
                ...s,
                updatedAt: Date.now(),
                messages: nextMessages,
              };
            }
            return s;
          });

          return {
            messages: nextMessages,
            sessions: nextSessions,
          };
        });
      },

      clearMessages: () => {
        set({
          currentSessionId: null,
          messages: [],
        });
      },

      setIsOpen: (isOpen) => set({ isOpen }),
    }),
    {
      name: 'vesper-storage',
      version: 1,
      storage: createJSONStorage(() => localStorage),
      migrate: (persistedState: any) => {
        if (!persistedState) return persistedState;
        const state = persistedState as any;
        const hasExistingMessages =
          Array.isArray(state.messages) && state.messages.length > 0;
        const hasSessions =
          Array.isArray(state.sessions) && state.sessions.length > 0;

        if (hasExistingMessages && !hasSessions) {
          const firstUser = state.messages.find((m: any) => m.role === 'user');
          const title =
            firstUser?.content?.trim()?.slice(0, 36) || 'Previous Consultation';
          const initialSession: VesperChatSession = {
            id: `legacy-${Date.now()}`,
            title,
            createdAt: Date.now(),
            updatedAt: Date.now(),
            messages: state.messages,
          };
          return {
            ...state,
            sessions: [initialSession],
            currentSessionId: initialSession.id,
          };
        }
        return state;
      },
    }
  )
);
