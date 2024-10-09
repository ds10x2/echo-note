import { create } from "zustand";

export const useNoteStore = create((set) => ({
  note_id: 0,
  pdf_path: null,
  record_path: null,

  // 상태 업데이트 함수
  setNoteDetail: (note) =>
    set({
      note_id: note.note_id,
      pdf_path: note.pdf_path,
      record_path: note.record_path,
    }),
}));
