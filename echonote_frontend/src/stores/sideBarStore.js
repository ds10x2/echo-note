import { create } from "zustand";

const useSidebarStore = create((set) => ({
  isPdfBarOpened: false,
  isSTTBarOpened: false,
  isRecordingBarOpened: false,

  togglePdfBar: () =>
    set((state) => ({ isPdfBarOpened: !state.isPdfBarOpened })),

  toggleSTTBar: () =>
    set((state) => ({ isSTTBarOpened: !state.isSTTBarOpened })),

  toggleRecordingBar: () =>
    set((state) => ({ isRecordingBarOpened: !state.isRecordingBarOpened })),
}));

const useSearchStore = create((set) => ({
  currentIndex: 0,
  setCurrentIndex: (index) => set({ currentIndex: index }),
  searchResults: [],
  setSearchResults: (results) => set({ searchResults: results }),
}));

export { useSidebarStore, useSearchStore };
