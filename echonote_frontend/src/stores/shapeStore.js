import { create } from "zustand";
import { theme } from "@/shared/styles/theme";

const shapeStore = create((set, get) => ({
  rectangles: {},
  circles: {},
  currentPage: 1,
  property: {
    fill: true,
    fillColor: theme.colors.shapeFillDefaultColor,
    stroke: true,
    strokeColor: theme.colors.shapeStrokeDefaultColor,
    strokeWidth: 1,
  },

  selectedShape: { id: null, type: null }, // detail 제거

  // 선택된 도형 설정
  setSelectedShape: (id, type) => {
    const { selectedShape } = get();
    if (selectedShape.id !== id || selectedShape.type !== type) {
      set(() => ({
        selectedShape: { id, type }, // id와 type만 저장
      }));
    }
  },

  addRectangle: (rectangle) => {
    const currentPage = get().currentPage;
    set((state) => ({
      rectangles: {
        ...state.rectangles,
        [currentPage]: [...(state.rectangles[currentPage] || []), rectangle],
      },
    }));
  },

  addCircle: (circle) => {
    const currentPage = get().currentPage;
    set((state) => ({
      circles: {
        ...state.circles,
        [currentPage]: [...(state.circles[currentPage] || []), circle],
      },
    }));
  },

  updateRectangle: (index, newRect) => {
    const currentPage = get().currentPage;
    set((state) => ({
      rectangles: {
        ...state.rectangles,
        [currentPage]: state.rectangles[currentPage].map((rect, i) =>
          i === index ? newRect : rect
        ),
      },
    }));
  },

  updateCircle: (index, newCircle) => {
    const currentPage = get().currentPage;
    set((state) => ({
      circles: {
        ...state.circles,
        [currentPage]: state.circles[currentPage].map((circle, i) =>
          i === index ? newCircle : circle
        ),
      },
    }));
  },

  setRectangles: (rects) => {
    const currentPage = get().currentPage;
    set((state) => ({
      rectangles: {
        ...state.rectangles,
        [currentPage]: rects,
      },
    }));
  },

  setCircles: (circles) => {
    const currentPage = get().currentPage;
    set((state) => ({
      circles: {
        ...state.circles,
        [currentPage]: circles,
      },
    }));
  },

  getRectangles: () => {
    const currentPage = get().currentPage;
    return get().rectangles[currentPage] || [];
  },

  getCircles: () => {
    const currentPage = get().currentPage;
    return get().circles[currentPage] || [];
  },

  getProperty: () => {
    const property = get().property;
    return property;
  },

  setProperty: (property) => {
    set(() => ({
      property: property,
    }));
  },

  setCurrentPageForShape: (page) => set(() => ({ currentPage: page })),

  // Individual property setters
  setFill: () => {
    set((state) => ({
      property: {
        ...state.property,
        fill: !state.property.fill, // 현재 fill 상태를 반전
      },
    }));
  },

  setFillColor: (fillColor) => {
    set((state) => ({
      property: {
        ...state.property,
        fillColor: fillColor,
      },
    }));
  },

  setStroke: () => {
    set((state) => ({
      property: {
        ...state.property,
        stroke: !state.property.stroke, // 현재 stroke 상태를 반전
      },
    }));
  },

  setStrokeColor: (strokeColor) => {
    set((state) => ({
      property: {
        ...state.property,
        strokeColor: strokeColor,
      },
    }));
  },

  setStrokeWidth: (strokeWidth) => {
    set((state) => ({
      property: {
        ...state.property,
        strokeWidth: strokeWidth,
      },
    }));
  },

  resetTimestamps: (page) => {
    set((state) => ({
      rectangles: {
        ...state.rectangles,
        [page]: state.rectangles[page]?.map((rect) => ({
          ...rect,
          detail: {
            ...rect.detail,
            timestamp: null, // 타임스탬프를 null로 초기화
          },
        })),
      },
    }));

    set((state) => ({
      circles: {
        ...state.circles,
        [page]: state.circles[page]?.map((circle) => ({
          ...circle,
          detail: {
            ...circle.detail,
            timestamp: null, // 타임스탬프를 null로 초기화
          },
        })),
      },
    }));
  },

  removeRectangle: (index) => {
    const currentPage = get().currentPage;
    set((state) => ({
      rectangles: {
        ...state.rectangles,
        [currentPage]: state.rectangles[currentPage].filter(
          (_, i) => i !== index
        ),
      },
    }));
  },

  removeCircle: (index) => {
    const currentPage = get().currentPage;
    set((state) => ({
      circles: {
        ...state.circles,
        [currentPage]: state.circles[currentPage].filter((_, i) => i !== index),
      },
    }));
  },
}));

export default shapeStore;
