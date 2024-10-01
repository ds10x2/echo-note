import { create } from "zustand";
const drawingTypeStore = create((set, get) => ({
  mode: {
    text: false,
    shape: false,
  },
  nowMode: "",

  //텍스트
  setMode: (mode) => set(() => ({ mode })),
  setTextMode: () =>
    set((state) => ({
      mode: {
        ...state.mode, // 기존 mode의 다른 속성은 유지
        text: !state.mode.text, // text의 값을 토글
      },
    })),

  //도형

  setShapeMode: () =>
    set((state) => ({
      mode: {
        ...state.mode,
        shape: !state.mode.shape,
      },
    })),
}));
export default drawingTypeStore;
