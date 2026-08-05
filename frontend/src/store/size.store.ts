import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type BodyType = 'Athletic Slim' | 'Athletic Broad' | 'Slender' | 'Average' | 'Stocky' | 'Unknown';
export type PreferredFit = 'Slim' | 'Regular' | 'Relaxed' | 'Oversized';

export interface BodyMeasurements {
  heightCm: number;
  weightKg: number;
  shoulderWidthCm: number;
  chestCircumferenceCm: number;
  waistCircumferenceCm: number;
  sleeveLengthCm: number;
  neckCircumferenceCm: number;
}

export interface BodyProfile {
  id: string;
  measurements: BodyMeasurements;
  bodyType: BodyType;
  preferredFit: PreferredFit;
  gender: string;
  confidenceScore: number;
  lastUpdated: string;
}

export interface SizeRecommendation {
  recommendedSize: string; // e.g., 'M'
  confidence: number;      // e.g., 94
  fitNotes: string;        // Editorial note about the fit
  alternativeSize?: string;
  alternativeNotes?: string;
}

interface SizeState {
  // The persistent global profile
  profile: BodyProfile | null;
  
  // Ephemeral state during scanning/analysis
  isScanning: boolean;
  scanProgress: number; // 0 to 100
  scanStatusText: string;
  
  // Actions
  setProfile: (profile: BodyProfile) => void;
  clearProfile: () => void;
  updateMeasurements: (partial: Partial<BodyMeasurements>) => void;
  
  // Scanning Actions
  setScanning: (isScanning: boolean, status?: string) => void;
  setScanProgress: (progress: number, status?: string) => void;
}

export const useSizeStore = create<SizeState>()(
  persist(
    (set) => ({
      profile: null,
      isScanning: false,
      scanProgress: 0,
      scanStatusText: '',
      
      setProfile: (profile) => set({ profile }),
      
      clearProfile: () => set({ profile: null }),
      
      updateMeasurements: (partial) => set((state) => ({
        profile: state.profile 
          ? { 
              ...state.profile, 
              measurements: { ...state.profile.measurements, ...partial },
              lastUpdated: new Date().toISOString()
            } 
          : null
      })),
      
      setScanning: (isScanning, status = 'Initializing...') => set({ 
        isScanning, 
        scanStatusText: isScanning ? status : '',
        scanProgress: isScanning ? 0 : 100
      }),
      
      setScanProgress: (progress, status) => set((state) => ({ 
        scanProgress: progress,
        scanStatusText: status || state.scanStatusText
      })),
    }),
    {
      name: 'ashen-size-storage',
      storage: createJSONStorage(() => localStorage),
      // Don't persist scanning state
      partialize: (state) => ({ profile: state.profile }),
    }
  )
);
