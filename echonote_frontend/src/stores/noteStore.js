import { create } from "zustand";

export const useNoteStore = create((set) => ({
  note_id: 0,
  note_name: null,
  pdf_path: null,
  record_path: null,
  stt_status: "processing",

  // 상태 업데이트 함수
  setNoteDetail: (note) =>
    set({
      note_id: Number(note.note_id),
      note_name: note.note_name,
      pdf_path: note.pdf_path,
      record_path: note.record_path,
      stt_status: note.stt_status,
    }),

  setRecordPath: (url) => set({ record_path: url }),
  setSTTStatus: (state) => set({ stt_status: state }),
}));
