import { create } from "zustand";

export const useAudioStore = create((set) => ({
  startTime: null,
  recordTime: null,
  setStartTime: (time) => set({ startTime: time }),
  setRecordTime: (time) => set({ recordTime: time }),
}));
