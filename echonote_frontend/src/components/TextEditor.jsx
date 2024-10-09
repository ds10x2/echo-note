import React, { useEffect, useRef, useState, useCallback } from "react";
import * as St from "./styles/TextEditor.style";
import textStore from "@stores/textStore";
import drawingTypeStore from "@/stores/drawingTypeStore";

// 텍스트박스 컴포넌트를 메모이제이션
const TextBox = React.memo(
  ({
    item,
    handleTouchStart,
    handleKeyDown,
    updateCurTextItem,
    handleBlur,
    isSelected,
  }) => {
    return (
      <St.TextBox
        key={item.id}
        data-id={item.id}
        x={item.x}
        y={item.y}
        isEditing={item.isEditing}
        isDragging={item.isDragging}
        className="text-box"
        onTouchStart={(e) => handleTouchStart(e, item.id)}
        isSelected={isSelected}
        style={{
          fontSize: `${item.fontSize}px`,
        }}
      >
        {item.isEditing ? (
          <St.TextArea
            value={item.text}
            autoFocus
            onChange={(e) => updateCurTextItem(item.id, e.target.value)}
            onBlur={() => handleBlur(item.id)}
            onKeyDown={(e) => handleKeyDown(e, item.id)}
            style={{ fontSize: `${item.fontSize}px` }}
          />
        ) : (
          <St.TextDetail fontSize={item.fontSize}>{item.text}</St.TextDetail>
        )}
      </St.TextBox>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.item === nextProps.item &&
      prevProps.selectedItemId === nextProps.selectedItemId
    );
  }
);

const TextEditor = ({
  hasDraggedRef,
  isDraggingRef,
  currentPageItems,
  scale,
  parentContainerRef,
}) => {
  const {
    updateTextItem,
    finishEditing,
    updateTextItemPosition,
    addTextItem,
    resetDraggingState,
    setSelectedText,
    selectedText, // 전역에서 선택된 텍스트를 가져옴
  } = textStore();

  const { mode } = drawingTypeStore();

  const [curItems, setCurItems] = useState(currentPageItems);
  const [updatedItems, setUpdatedItems] = useState([]);
  const containerRef = useRef();

  // 현재 페이지 아이템이 변경되었을 때만 상태를 업데이트
  useEffect(() => {
    if (JSON.stringify(currentPageItems) !== JSON.stringify(curItems)) {
      setCurItems(currentPageItems);
    }
  }, [currentPageItems]);

  useEffect(() => {
    if (!mode.text) setSelectedText(null); // 모드가 변경될 때 선택된 텍스트 해제
  }, [mode, setSelectedText]);

  const handleAddTextBox = useCallback(
    (e) => {
      if (isDraggingRef.current || hasDraggedRef.current) return;

      const clientX = e.touches[0].clientX;
      const clientY = e.touches[0].clientY;

      const containerRect = containerRef.current.getBoundingClientRect();
      const parentScrollLeft = parentContainerRef.current.scrollLeft;
      const parentScrollTop = parentContainerRef.current.scrollTop;

      const x = (clientX + parentScrollLeft - containerRect.left) / scale;
      const y = (clientY + parentScrollTop - containerRect.top) / scale;

      addTextItem({
        id: Date.now(),
        x,
        y,
        text: "",
        isEditing: true,
        isDragging: false,
        offsetX: 0,
        offsetY: 0,
        fontSize: textStore.getState().fontProperty.fontSize,
      });

      setSelectedText(null);
    },
    [
      addTextItem,
      isDraggingRef,
      hasDraggedRef,
      scale,
      parentContainerRef,
      setSelectedText,
    ]
  );

  const handleTouchEvent = useCallback(
    (e) => {
      if (mode.text) {
        const clickedTextBox = e.target.closest(".text-box");
        if (clickedTextBox) {
          const clickedItemId = parseInt(clickedTextBox.dataset.id, 10);
          if (
            curItems.some((item) => item.id === clickedItemId && item.isEditing)
          ) {
            return;
          }
          setSelectedText(clickedItemId);
        } else {
          handleAddTextBox(e);
        }
      }
    },
    [handleAddTextBox, curItems, mode.text, setSelectedText]
  );

  useEffect(() => {
    const container = containerRef.current;

    if (mode.text) {
      container.addEventListener("touchstart", handleTouchEvent);
    }

    return () => {
      container.removeEventListener("touchstart", handleTouchEvent);
    };
  }, [handleTouchEvent, mode.text]);

  const handleTouchStart = (e, id) => {
    e.stopPropagation();

    const nowItem = curItems.find((item) => item.id === id);

    if (nowItem.isEditing && selectedText.id === id) {
      return;
    }

    isDraggingRef.current = true;
    hasDraggedRef.current = false;
    setSelectedText(id);

    const clientX = e.touches[0].clientX;
    const clientY = e.touches[0].clientY;

    const parentScrollLeft = parentContainerRef.current.scrollLeft;
    const parentScrollTop = parentContainerRef.current.scrollTop;

    const offsetX =
      clientX +
      parentScrollLeft -
      (nowItem.x * scale + containerRef.current.offsetLeft);
    const offsetY =
      clientY +
      parentScrollTop -
      (nowItem.y * scale + containerRef.current.offsetTop);

    setCurItems((items) =>
      items.map((item) =>
        item.id === id ? { ...item, isDragging: true, offsetX, offsetY } : item
      )
    );

    document.body.style.userSelect = "none";
  };

  const handleTouchMove = (e) => {
    if (isDraggingRef.current) {
      const clientX = e.touches[0].clientX;
      const clientY = e.touches[0].clientY;

      setCurItems((items) =>
        items.map((item) => {
          if (item.isDragging) {
            let newX = (clientX - item.offsetX) / scale;
            let newY = (clientY - item.offsetY) / scale;

            const containerRect = containerRef.current.getBoundingClientRect();
            const containerWidth = containerRect.width / scale;
            const containerHeight = containerRect.height / scale;

            const textBoxWidth = 100;
            const textBoxHeight = item.fontSize;

            if (newX < 0) newX = 0;
            else if (newX + textBoxWidth > containerWidth)
              newX = containerWidth - textBoxWidth;

            if (newY < 0) newY = 0;
            else if (newY + textBoxHeight > containerHeight)
              newY = containerHeight - textBoxHeight;

            return {
              ...item,
              x: newX,
              y: newY,
            };
          }
          return item;
        })
      );

      hasDraggedRef.current = true;
    }
  };

  const handleTouchEnd = () => {
    if (isDraggingRef.current) {
      isDraggingRef.current = false;

      setCurItems((items) => {
        return items.map((item) => {
          if (item.isDragging) {
            setUpdatedItems((prevItems) => [
              ...prevItems,
              { id: item.id, x: item.x, y: item.y },
            ]);
            return { ...item, isDragging: false };
          }
          return item;
        });
      });

      resetDraggingState();

      if (hasDraggedRef.current) {
        setTimeout(() => {
          hasDraggedRef.current = false;
        }, 50);
      }
    }

    document.body.style.userSelect = "auto";
  };

  // 상태 업데이트 최적화: 업데이트가 있을 때만 실행되도록 설정
  useEffect(() => {
    if (updatedItems.length > 0) {
      updatedItems.forEach(({ id, x, y }) => {
        updateTextItemPosition(id, x, y);
      });
      setUpdatedItems([]);
    }
  }, [updatedItems]);

  useEffect(() => {
    const container = containerRef.current;
    container.addEventListener("touchmove", handleTouchMove);
    container.addEventListener("touchend", handleTouchEnd);

    return () => {
      container.removeEventListener("touchmove", handleTouchMove);
      container.removeEventListener("touchend", handleTouchEnd);
    };
  }, []);

  const handleKeyDown = (e, id) => {
    if (e.key === "Enter") {
      if (e.ctrlKey) {
        e.preventDefault();
        updateCurTextItem(
          id,
          curItems.find((item) => item.id === id).text + "\n"
        );
      } else {
        e.preventDefault();
        updateTextItem(id, curItems.find((item) => item.id === id).text);
        finishEditing(id);
      }
    }
  };

  const updateCurTextItem = (id, newText) => {
    setCurItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, text: newText } : item
      )
    );
  };

  const handleBlur = (id) => {
    const currentItem = curItems.find((item) => item.id === id);
    if (!currentItem.text.trim()) {
      setCurItems(curItems.filter((item) => item.id !== id));
      deleteTextItem(id);
    } else {
      updateTextItem(id, currentItem.text);
      finishEditing(id);
    }
    setSelectedText(null);
  };

  return (
    <St.TextContainer ref={containerRef} mode={mode.text}>
      {curItems.map((item) => (
        <TextBox
          key={item.id}
          item={item}
          handleTouchStart={handleTouchStart}
          handleKeyDown={handleKeyDown}
          updateCurTextItem={updateCurTextItem}
          handleBlur={handleBlur}
          selectedItemId={selectedText.id}
          isSelected={selectedText.id === item.id}
        />
      ))}
    </St.TextContainer>
  );
};

export default TextEditor;
