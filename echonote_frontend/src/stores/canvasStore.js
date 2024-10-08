import { create } from "zustand";
import pageStore from "@stores/pageStore";

// Canvas 관련 상태 관리
const canvasStore = create((set, get) => ({
  savedCanvasPaths: {}, // 페이지별 저장된 경로 데이터
  savedCanvasImages: {}, // 페이지별 저장된 이미지 데이터
  historyStack: [], // 전체 PDF에 대한 히스토리 스택
  redoStack: [], // 전체 PDF에 대한 redo 스택

  setCanvasPath: (page, data, updateHistory = true) => {
    const { savedCanvasPaths, historyStack } = get();
    const newSavedPaths = { ...savedCanvasPaths, [page]: data };

    if (updateHistory) {
      // 현재 페이지의 기존 데이터를 가져오고, 없을 경우 빈 배열로 설정
      const previousData = savedCanvasPaths[page]
        ? JSON.stringify(savedCanvasPaths[page])
        : "[]";

      // 히스토리 스택 업데이트
      const newHistoryStack = [
        ...historyStack,
        {
          page,
          data: JSON.parse(previousData),
        },
      ];
      set({
        savedCanvasPaths: newSavedPaths,
        historyStack: newHistoryStack,
        redoStack: [], // 새로운 변경이 발생하면 redo 스택 초기화
      });
    } else {
      set({
        savedCanvasPaths: newSavedPaths,
      });
    }
  },

  // 저장된 경로 데이터를 불러오는 함수
  getCanvasPath: (page) => get().savedCanvasPaths[page] || [],

  // 이미지 데이터를 저장하는 함수
  setCanvasImage: (page, image) =>
    set((state) => ({
      savedCanvasImages: { ...state.savedCanvasImages, [page]: image },
    })),

  // 저장된 이미지 데이터를 불러오는 함수
  getCanvasImage: (page) => get().savedCanvasImages[page] || null,

  // undo 기능
  undo: () => {
    const { historyStack, redoStack, savedCanvasPaths } = get();
    const { setCurrentPage } = pageStore.getState();
    if (historyStack.length === 0) return;

    const newHistoryStack = [...historyStack];
    const lastChange = newHistoryStack.pop(); // 이전 상태 가져오기

    if (lastChange) {
      const currentPaths = savedCanvasPaths[lastChange.page] || [];
      const newRedoStack = [
        ...redoStack,
        {
          page: lastChange.page,
          data: JSON.parse(JSON.stringify(currentPaths)),
        },
      ];

      const updatedPaths = [...lastChange.data];
      if (updatedPaths.length > 0) {
        updatedPaths.pop();
      }

      set({
        savedCanvasPaths: {
          ...savedCanvasPaths,
          [lastChange.page]: updatedPaths,
        },
        historyStack: newHistoryStack,
        redoStack: newRedoStack,
      });
      setCurrentPage(lastChange.page);
    }
  },

  // redo 기능
  redo: () => {
    const { redoStack, savedCanvasPaths } = get();
    const { setCurrentPage } = pageStore.getState();
    if (redoStack.length === 0) {
      console.log("Redo stack is empty. No action taken.");
      return;
    }

    const newRedoStack = [...redoStack];
    const nextChange = newRedoStack.pop(); // 다음 상태 가져오기

    if (nextChange) {
      // savedCanvasPaths 업데이트 (히스토리 업데이트 없이)
      set({
        savedCanvasPaths: {
          ...savedCanvasPaths,
          [nextChange.page]: nextChange.data,
        },
        redoStack: newRedoStack, // 갱신된 redoStack 적용
      });
      setCurrentPage(nextChange.page);
    }
  },

  // 현재 페이지의 경로 데이터를 초기화하는 함수
  clearCanvasPath: (page) => {
    const { savedCanvasPaths, historyStack } = get();
    const newHistoryStack = [
      ...historyStack,
      { page, data: JSON.parse(JSON.stringify(savedCanvasPaths[page])) || [] },
    ];
    set({
      savedCanvasPaths: { ...savedCanvasPaths, [page]: [] },
      historyStack: newHistoryStack,
      redoStack: [], // 새로운 변경이 발생하면 redo 스택 초기화
    });
  },

  // reset 기능: 현재 페이지의 데이터를 초기화하고, 관련된 히스토리를 삭제
  resetCanvasPath: (page) => {
    const { savedCanvasPaths } = get();
    const filteredHistory = get().historyStack.filter(
      (entry) => entry.page !== page
    );
    const filteredRedo = get().redoStack.filter((entry) => entry.page !== page);

    set({
      savedCanvasPaths: { ...savedCanvasPaths, [page]: [] },
      historyStack: filteredHistory,
      redoStack: filteredRedo,
    });
  },
}));

export default canvasStore;
