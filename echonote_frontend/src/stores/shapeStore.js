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
  setFill: (fill) => {
    set((state) => ({
      property: {
        ...state.property,
        fill: fill,
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

  setStroke: (stroke) => {
    set((state) => ({
      property: {
        ...state.property,
        stroke: stroke,
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
}));

export default shapeStore;
