// shapeStore.js
import { create } from "zustand";

const shapeStore = create((set, get) => ({
  rectangles: {}, // 페이지별로 사각형을 관리하기 위해 객체로 변경
  currentPage: 1,

  addRectangle: (rectangle, page) => {
    set((state) => ({
      rectangles: {
        ...state.rectangles,
        [page]: [...(state.rectangles[page] || []), rectangle],
      },
    }));
  },

  updateRectangle: (index, newRect, page) => {
    set((state) => ({
      rectangles: {
        ...state.rectangles,
        [page]: state.rectangles[page].map((rect, i) =>
          i === index ? newRect : rect
        ),
      },
    }));
  },

  setRectangles: (page, rects) => {
    set((state) => ({
      rectangles: {
        ...state.rectangles,
        [page]: rects,
      },
    }));
  },

  getRectangles: (page) => {
    return get().rectangles[page] || [];
  },

  setCurrentPage: (page) => set(() => ({ currentPage: page })),
}));

export default shapeStore;
