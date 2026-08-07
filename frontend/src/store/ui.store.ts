import { create } from 'zustand';

interface UIState {
  isSettingsOpen: boolean;
  isSearchOpen: boolean;
  isUploadWizardOpen: boolean;
  openSettings: () => void;
  closeSettings: () => void;
  toggleSettings: () => void;
  openSearch: () => void;
  closeSearch: () => void;
  toggleSearch: () => void;
  openUploadWizard: () => void;
  closeUploadWizard: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  isSettingsOpen: false,
  isSearchOpen: false,
  isUploadWizardOpen: false,
  openSettings: () => set({ isSettingsOpen: true }),
  closeSettings: () => set({ isSettingsOpen: false }),
  toggleSettings: () => set((state) => ({ isSettingsOpen: !state.isSettingsOpen })),
  openSearch: () => set({ isSearchOpen: true }),
  closeSearch: () => set({ isSearchOpen: false }),
  toggleSearch: () => set((state) => ({ isSearchOpen: !state.isSearchOpen })),
  openUploadWizard: () => set({ isUploadWizardOpen: true }),
  closeUploadWizard: () => set({ isUploadWizardOpen: false }),
}));
