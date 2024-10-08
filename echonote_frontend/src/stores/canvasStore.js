import { create } from "zustand";

// Canvas 관련 상태 관리
const canvasStore = create((set, get) => ({
  savedCanvasPaths: {}, // 페이지별 저장된 경로 데이터

  // 경로 데이터를 저장하는 함수
  setCanvasPath: (page, data) =>
    set((state) => ({
      savedCanvasPaths: { ...state.savedCanvasPaths, [page]: data },
    })),

  // 저장된 경로 데이터를 불러오는 함수
  getCanvasPath: (page) => get().savedCanvasPaths[page] || null,

  // 경로 데이터를 초기화하는 함수
  clearCanvasPath: (page) =>
    set((state) => {
      const { [page]: _, ...rest } = state.savedCanvasPaths;
      return { savedCanvasPaths: rest };
    }),
}));

export default canvasStore;
