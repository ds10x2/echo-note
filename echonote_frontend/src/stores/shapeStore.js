import { create } from "zustand";

const shapeStore = create((set, get) => ({
  shapeItems: {}, // 페이지별로 관리
  currentPage: 1, // 현재 페이지 상태 추가
  isRecMode: false,

  resetTextItems: () => set(() => ({ shapeItems: {} })),

  getCurrentPageItems: () => {
    const currentPage = get().currentPage;
    return get().shapeItems[currentPage] || [];
  },

  setCurrentPage: (page) => set(() => ({ currentPage: page })),

  setIsRecMode: (isRecMode) => set(() => ({ isRecMode })),
}));

export default shapeStore;
