import { create } from "zustand";

const pageStore = create((set, get) => ({
  currentPage: 1, // 현재 페이지 상태 추가
  pages: 1, // 최대 페이지 수 상태 추가
  scale: 1, // 줌 스케일 초기 상태
  originSize: { width: 0, height: 0 }, // 초기값 설정

  // originSize 설정 메서드
  setOriginSize: (width, height) => {
    const currentSize = get().originSize;
    if (currentSize.width !== width || currentSize.height !== height) {
      set({ originSize: { width, height } });
    }
  },

  // 페이지 상태 업데이트
  setCurrentPage: (page) => set({ currentPage: page }),
  setPages: (totalPages) => set({ pages: totalPages }),

  // 다음 페이지로 이동
  nextPage: () => {
    const { currentPage, pages } = get();
    if (currentPage < pages) {
      set({ currentPage: currentPage + 1 });
    }
  },

  // 이전 페이지로 이동
  prevPage: () => {
    const { currentPage } = get();
    if (currentPage > 1) {
      set({ currentPage: currentPage - 1 });
    }
  },

  // 줌인
  zoomIn: () => {
    const { scale } = get();
    if (scale < 7) {
      set({ scale: scale + 0.5 });
    }
  },

  // 줌아웃
  zoomOut: () => {
    const { scale } = get();
    if (scale > 0.5) {
      set({ scale: scale - 0.5 });
    }
  },
}));

export default pageStore;
