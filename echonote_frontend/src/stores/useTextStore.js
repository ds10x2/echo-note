import { create } from "zustand";

const useTextStore = create((set, get) => ({
  textItems: [],
  isTextMode: false,

  addTextItem: (item) =>
    set((state) => ({
      textItems: [...state.textItems, item],
    })),

  updateTextItem: (id, newText) =>
    set((state) => ({
      textItems: state.textItems.map((item) =>
        item.id === id ? { ...item, text: newText } : item
      ),
    })),

  finishEditing: (id) =>
    set((state) => ({
      textItems: state.textItems.filter((item) => {
        if (item.id === id) {
          if (item.text.trim() === "") return false;
          item.isEditing = false;
        }
        return true;
      }),
    })),

  setIsTextMode: (isTextMode) => set(() => ({ isTextMode })),

  updateTextItemPosition: (id, x, y) =>
    set((state) => ({
      textItems: state.textItems.map((item) =>
        item.id === id ? { ...item, x, y } : item
      ),
    })),

  setIsDragging: (id, isDragging, offsetX = 0, offsetY = 0) =>
    set((state) => ({
      textItems: state.textItems.map((item) =>
        item.id === id ? { ...item, isDragging, offsetX, offsetY } : item
      ),
    })),

  dragTextItem: (id, newX, newY) =>
    set((state) => ({
      textItems: state.textItems.map((item) =>
        item.id === id ? { ...item, x: newX, y: newY } : item
      ),
    })),

  resetDraggingState: () =>
    set((state) => ({
      textItems: state.textItems.map((item) =>
        item.isDragging ? { ...item, isDragging: false } : item
      ),
    })),

  resetTextItems: () => set(() => ({ textItems: [] })),
}));

export default useTextStore;
