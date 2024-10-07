import { create } from "zustand";

export const useAudioStore = create((set) => ({
  startTime: null,
  setStartTime: (time) => set({ startTime: time }),
}));
