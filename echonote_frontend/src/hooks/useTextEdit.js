import { useState } from "react";

export const useTextEdit = (textItems, setTextItems, containerRef) => {
  const addTextItem = (e) => {
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    const containerRect = containerRef.current.getBoundingClientRect();
    const x = clientX - containerRect.left;
    const y = clientY - containerRect.top;

    setTextItems((prevItems) => [
      ...prevItems,
      {
        id: Date.now(),
        x,
        y,
        text: "",
        isEditing: true,
        isDragging: false,
        offsetX: 0,
        offsetY: 0,
        fontSize: 16,
      },
    ]);
  };

  //내용 편집
  const updateTextItem = (id, newText) => {
    setTextItems((items) =>
      items.map((item) => (item.id === id ? { ...item, text: newText } : item))
    );
  };

  //편집 완료
  const finishEditing = (id) => {
    setTextItems((items) =>
      items.filter((item) => {
        if (item.id === id) {
          if (item.text.trim() === "") {
            return false;
          }
          item.isEditing = false;
        }
        return true;
      })
    );
  };

  //엔터 처리
  const handleKeyDown = (e, id) => {
    if (e.key === "Enter") {
      if (e.ctrlKey) {
        e.preventDefault();
        updateTextItem(
          id,
          textItems.find((item) => item.id === id).text + "\n"
        );
      } else {
        e.preventDefault();
        finishEditing(id);
      }
    }
  };

  return {
    textItems,
    addTextItem,
    updateTextItem,
    finishEditing,
    setTextItems, // 외부에서 직접 설정할 수 있도록 함
    handleKeyDown,
  };
};
