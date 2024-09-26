import { create } from "zustand";

const useSidebarStore = create((set) => ({
  isPdfBarOpened: false,
  isSTTBarOpened: false,

  // PdfBar 열림/닫힘 상태 변경
  togglePdfBar: () =>
    set((state) => ({ isPdfBarOpened: !state.isPdfBarOpened })),

  // STTBar 열림/닫힘 상태 변경
  toggleSTTBar: () =>
    set((state) => ({ isSTTBarOpened: !state.isSTTBarOpened })),
}));

export default useSidebarStore;
