import { create } from "zustand";
const drawingTypeStore = create((set, get) => ({
  mode: {
    text: false,
    shape: false,
  },
  nowMode: "",

  setMode: (mode) => set(() => ({ mode })),
  isTextMode: () => {
    const mode = get().mode; // 현재 상태의 mode 값을 가져옴
    return mode.text;
  },
  setTextMode: () =>
    set((state) => ({
      mode: {
        ...state.mode, // 기존 mode의 다른 속성은 유지
        text: !state.mode.text, // text의 값을 토글
      },
    })),
}));
export default drawingTypeStore;
