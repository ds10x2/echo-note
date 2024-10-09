import { create } from "zustand";

const textStore = create((set, get) => ({
  textItems: {}, // 페이지별로 textItems를 관리하기 위해 객체로 변경
  currentPage: 1, // 현재 페이지 상태 추가
  isTextMode: false,
  fontProperty: {
    fontSize: 10,
  },
  selectedText: { id: null },

  setFontSize: (newFontSize) => {
    set((state) => ({
      fontProperty: {
        ...state.fontProperty,
        fontSize: newFontSize, // fontSize만 업데이트
      },
    }));
  },

  addTextItem: (item) => {
    const currentPage = get().currentPage;
    set((state) => ({
      textItems: {
        ...state.textItems,
        [currentPage]: [...(state.textItems[currentPage] || []), item],
      },
    }));
  },

  updateTextItem: (id, newText) => {
    const currentPage = get().currentPage;
    set((state) => ({
      textItems: {
        ...state.textItems,
        [currentPage]: state.textItems[currentPage].map((item) =>
          item.id === id ? { ...item, text: newText } : item
        ),
      },
    }));
  },

  finishEditing: (id) => {
    const currentPage = get().currentPage;
    set((state) => ({
      textItems: {
        ...state.textItems,
        [currentPage]: state.textItems[currentPage].filter((item) => {
          if (item.id === id) {
            if (item.text.trim() === "") return false;
            item.isEditing = false;
          }
          return true;
        }),
      },
    }));
  },

  setIsTextMode: (isTextMode) => set(() => ({ isTextMode })),

  updateTextItemPosition: (id, x, y) => {
    const currentPage = get().currentPage;
    set((state) => ({
      textItems: {
        ...state.textItems,
        [currentPage]: state.textItems[currentPage].map((item) =>
          item.id === id ? { ...item, x, y } : item
        ),
      },
    }));
  },

  setIsDragging: (id, isDragging, offsetX = 0, offsetY = 0) => {
    const currentPage = get().currentPage;
    set((state) => ({
      textItems: {
        ...state.textItems,
        [currentPage]: state.textItems[currentPage].map((item) =>
          item.id === id ? { ...item, isDragging, offsetX, offsetY } : item
        ),
      },
    }));
  },

  dragTextItem: (id, newX, newY) => {
    const currentPage = get().currentPage;
    set((state) => ({
      textItems: {
        ...state.textItems,
        [currentPage]: state.textItems[currentPage].map((item) =>
          item.id === id ? { ...item, x: newX, y: newY } : item
        ),
      },
    }));
  },

  resetDraggingState: () => {
    const currentPage = get().currentPage;
    set((state) => ({
      textItems: {
        ...state.textItems,
        [currentPage]: state.textItems[currentPage].map((item) =>
          item.isDragging ? { ...item, isDragging: false } : item
        ),
      },
    }));
  },

  deleteTextItem: (id) => {
    const currentPage = get().currentPage;
    set((state) => ({
      textItems: {
        ...state.textItems,
        [currentPage]: state.textItems[currentPage].filter(
          (item) => item.id !== id
        ),
      },
    }));
  },

  resetTextItems: () => set(() => ({ textItems: {} })),

  getTextItemById: (id) => {
    const currentPage = get().currentPage;
    return get().textItems[currentPage]?.find((item) => item.id === id);
  },

  getCurrentPageItems: () => {
    const currentPage = get().currentPage;
    return get().textItems[currentPage] || [];
  },

  setCurrentPageForText: (page) => set(() => ({ currentPage: page })),

  setSelectedText: (id) => {
    set((state) => ({
      selectedText: { id }, // 선택된 텍스트 상태 업데이트
    }));
  },

  editTextItem: () => {
    const { selectedText, currentPage, textItems } = get();
    const items = textItems[currentPage] || [];
    set((state) => ({
      textItems: {
        ...state.textItems,
        [currentPage]: items.map((item) =>
          item.id === selectedText.id ? { ...item, isEditing: true } : item
        ),
      },
    }));
  },
}));

export default textStore;
