import { create } from "zustand";

const pageStore = create((set, get) => ({
  currentPage: 1, // 현재 페이지 상태 추가
  pages: 1, // 최대 페이지 수 상태 추가

  setCurrentPage: (page) => set(() => ({ currentPage: page })),
  setPages: (totalPages) => set(() => ({ pages: totalPages })),

  nextPage: () => {
    const { currentPage, pages } = get();
    if (currentPage < pages) {
      set(() => ({ currentPage: currentPage + 1 }));
    }
  },

  prevPage: () => {
    const { currentPage } = get();
    if (currentPage > 1) {
      set(() => ({ currentPage: currentPage - 1 }));
    }
  },
}));

export default pageStore;
