import { create } from "zustand";

export const useAudioStore = create((set) => ({
  createTime: null,
  startTime: null,
  isRecording: false,
  setStartTime: (time) => set({ startTime: time }),
  setCreatetime: (time) => set({ createTime: time }),
  setIsRecording: (state) => set({ isRecording: state }),
  setRecordTime: (time) => set({ recordTime: time }),
}));
