import { create } from "zustand";

export const useAudioStore = create((set) => ({
  createTime: null,
  startTime: null,
  setStartTime: (time) => set({ startTime: time }),
  setCreatetime: (time) => set({ createTime: time }),
}));
