import { create } from "zustand";

// Canvas 관련 상태 관리
const canvasStore = create((set, get) => ({
  savedCanvasPath: null, // 저장된 SVG 데이터

  // SVG 데이터를 저장하는 함수
  setCanvasPath: (data) => set(() => ({ savedCanvasPath: data })),

  // 저장된 SVG 데이터를 불러오는 함수 (set 사용 불필요)
  getCanvasPath: () => get().savedCanvasPath,

  // 저장된 SVG 데이터를 초기화하는 함수
  clearCanvasPath: () => set(() => ({ savedCanvasPath: null })),
}));

export default canvasStore;
