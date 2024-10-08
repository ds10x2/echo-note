import { create } from "zustand";

// Canvas 관련 상태 관리
const canvasStore = create((set, get) => ({
  savedCanvasPaths: {}, // 페이지별 저장된 경로 데이터
  undoStacks: {}, // 페이지별 undo 스택
  redoStacks: {}, // 페이지별 redo 스택

  // 경로 데이터를 저장하는 함수
  setCanvasPath: (page, data) => {
    set((state) => {
      const newUndoStack = [...(state.undoStacks[page] || []), data];
      return {
        savedCanvasPaths: { ...state.savedCanvasPaths, [page]: data },
        undoStacks: { ...state.undoStacks, [page]: newUndoStack },
        redoStacks: { ...state.redoStacks, [page]: [] }, // 새로운 경로가 추가되면 redo 스택 초기화
      };
    });
    // console.log(get().savedCanvasPaths);
    // console.log(get().undoStacks);
    // console.log(get().redoStacks);
  },

  // 저장된 경로 데이터를 불러오는 함수
  getCanvasPath: (page) => get().savedCanvasPaths[page] || null,

  undo: (page) => {
    set((state) => {
      const { undoStacks, redoStacks, savedCanvasPaths } = state;
      const pageUndoStack = undoStacks[page] || [];

      if (pageUndoStack.length > 0) {
        const newRedoStack = [
          ...(redoStacks[page] || []),
          savedCanvasPaths[page],
        ];
        const newUndoStack = pageUndoStack.slice(0, -1);
        const previousPath = newUndoStack[newUndoStack.length - 1] || null;

        return {
          savedCanvasPaths: { ...savedCanvasPaths, [page]: previousPath },
          undoStacks: { ...undoStacks, [page]: newUndoStack },
          redoStacks: { ...redoStacks, [page]: newRedoStack },
        };
      }
      return state;
    });

    // console.log(get().savedCanvasPaths);
    // console.log(get().undoStacks);
    // console.log(get().redoStacks);
  },

  redo: (page) => {
    set((state) => {
      const { undoStacks, redoStacks, savedCanvasPaths } = state;
      const pageRedoStack = redoStacks[page] || [];

      if (pageRedoStack.length > 0) {
        const nextPath = pageRedoStack[pageRedoStack.length - 1];
        const newUndoStack = [...(undoStacks[page] || []), nextPath];
        const newRedoStack = pageRedoStack.slice(0, -1);

        return {
          savedCanvasPaths: { ...savedCanvasPaths, [page]: nextPath },
          undoStacks: { ...undoStacks, [page]: newUndoStack },
          redoStacks: { ...redoStacks, [page]: newRedoStack },
        };
      }
      return state;
    });
    // console.log(get().savedCanvasPaths);
    // console.log(get().undoStacks);
    // console.log(get().redoStacks);
  },

  // 경로 데이터를 초기화하는 함수
  clearCanvasPath: (page) => {
    const currentPath = get().savedCanvasPaths[page];
    set((state) => ({
      savedCanvasPaths: { ...state.savedCanvasPaths, [page]: null },
      undoStacks: {
        ...state.undoStacks,
        [page]: [...(state.undoStacks[page] || []), currentPath],
      },
      redoStacks: { ...state.redoStacks, [page]: [] },
    }));
  },
}));

export default canvasStore;
