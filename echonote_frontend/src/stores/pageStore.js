import { create } from "zustand";

const pageStore = create((set, get) => ({
  currentPage: 1, // 현재 페이지 상태 추가

  setCurrentPage: (page) => set(() => ({ currentPage: page })),
}));

export default pageStore;
