import { create } from "zustand";
const drawingTypeStore = create((set, get) => ({
  mode: {
    text: false,
    shape: false,
    pen: false,
  },
  shapeMode: {
    rectangle: true,
    circle: false,
  },
  nowMode: "",

  //텍스트
  setTextMode: () =>
    set((state) => ({
      mode: {
        text: !state.mode.text, // text의 값을 토글
        shape: false,
        pen: false,
      },
    })),

  //도형
  setShapeMode: () =>
    set((state) => ({
      mode: {
        text: false,
        shape: !state.mode.shape,
        pen: false,
      },
    })),

  //그리기 모드
  setPenMode: () =>
    set((state) => ({
      mode: {
        text: false,
        shape: false,
        pen: !state.mode.pen,
      },
    })),

  setRectangleMode: () =>
    set(() => ({
      shapeMode: {
        rectangle: true,
        circle: false,
      },
    })),

  setCircleMode: () =>
    set(() => ({
      shapeMode: {
        rectangle: false,
        circle: true,
      },
    })),
}));
export default drawingTypeStore;
