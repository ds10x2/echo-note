import { create } from "zustand";

// Canvas 관련 상태 관리
const canvasStore = create((set, get) => ({
  savedCanvasPath: null, // 저장된 경로 데이터
  savedCanvasImage: null, // 저장된 이미지 데이터

  // 경로 데이터를 저장하는 함수
  setCanvasPath: (data) => set(() => ({ savedCanvasPath: data })),

  // 저장된 경로 데이터를 불러오는 함수
  getCanvasPath: () => get().savedCanvasPath,

  // 이미지 데이터를 저장하는 함수
  setCanvasImage: (image) => set(() => ({ savedCanvasImage: image })),

  // 저장된 이미지 데이터를 불러오는 함수
  getCanvasImage: () => get().savedCanvasImage,

  // 경로 데이터를 초기화하는 함수
  clearCanvasPath: () => set(() => ({ savedCanvasPath: null })),
}));

export default canvasStore;
