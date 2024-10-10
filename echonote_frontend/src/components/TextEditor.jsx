import React, { useEffect, useRef, useState, useCallback } from "react";
import * as St from "./styles/TextEditor.style";
import textStore from "@stores/textStore";
import drawingTypeStore from "@/stores/drawingTypeStore";
import { useAudioStore } from "@/stores/recordStore";

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
        x={item.detail.x}
        y={item.detail.y}
        isEditing={item.detail.isEditing}
        isDragging={item.detail.isDragging}
        className="text-box"
        onTouchStart={(e) => handleTouchStart(e, item.id)}
        isSelected={isSelected}
        style={{
          fontSize: `${item.detail.fontSize}px`,
        }}
      >
        {item.detail.isEditing ? (
          <St.TextArea
            value={item.detail.text}
            autoFocus
            onChange={(e) => updateCurTextItem(item.id, e.target.value)}
            onBlur={() => handleBlur(item.id)}
            onKeyDown={(e) => handleKeyDown(e, item.id)}
            style={{ fontSize: `${item.detail.fontSize}px` }}
          />
        ) : (
          <St.TextDetail fontSize={item.detail.fontSize}>
            {item.detail.text}
          </St.TextDetail>
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
    deleteTextItem,
    finishEditing,
    updateTextItemPosition,
    addTextItem,
    resetDraggingState,
    setSelectedText,
    selectedText,
  } = textStore();
  const { recordTime } = useAudioStore();

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
        detail: {
          x,
          y,
          text: "",
          isEditing: true,
          isDragging: false,
          offsetX: 0,
          offsetY: 0,
          fontSize: textStore.getState().fontProperty.fontSize,
          timestamp: recordTime,
        },
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
      recordTime,
    ]
  );

  const handleTouchEvent = useCallback(
    (e) => {
      if (mode.text) {
        const clickedTextBox = e.target.closest(".text-box");
        if (clickedTextBox) {
          const clickedItemId = parseInt(clickedTextBox.dataset.id, 10);
          if (
            curItems.some(
              (item) => item.id === clickedItemId && item.detail.isEditing
            )
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

    if (nowItem.detail.isEditing && selectedText.id === id) {
      return;
    }

    // isDraggingRef.current = true;
    // hasDraggedRef.current = false;
    setSelectedText(id);

    // const clientX = e.touches[0].clientX;
    // const clientY = e.touches[0].clientY;

    // const containerRect = containerRef.current.getBoundingClientRect();
    // const parentScrollLeft = parentContainerRef.current.scrollLeft;
    // const parentScrollTop = parentContainerRef.current.scrollTop;

    // // Scale 적용: 좌표 계산 시 스케일을 명확히 반영
    // const x = (clientX + parentScrollLeft - containerRect.left) / scale;
    // const y = (clientY + parentScrollTop - containerRect.top) / scale;

    // const offsetX = x - nowItem.detail.x;
    // const offsetY = y - nowItem.detail.y;

    // setCurItems((items) =>
    //   items.map((item) =>
    //     item.id === id
    //       ? {
    //           ...item,
    //           detail: { ...item.detail, isDragging: true, offsetX, offsetY },
    //         }
    //       : item
    //   )
    // );

    // document.body.style.userSelect = "none";
  };

  const handleTouchMove = (e) => {
    if (isDraggingRef.current) {
      e.preventDefault(); // 스크롤 방지

      const clientX = e.touches[0].clientX;
      const clientY = e.touches[0].clientY;

      const containerRect = containerRef.current.getBoundingClientRect();
      const parentScrollLeft = parentContainerRef.current.scrollLeft;
      const parentScrollTop = parentContainerRef.current.scrollTop;

      const x = (clientX + parentScrollLeft - containerRect.left) / scale;
      const y = (clientY + parentScrollTop - containerRect.top) / scale;

      setCurItems((items) =>
        items.map((item) => {
          if (item.detail.isDragging) {
            let newX = x - item.detail.offsetX;
            let newY = y - item.detail.offsetY;

            const containerWidth = containerRect.width / scale;
            const containerHeight = containerRect.height / scale;

            const textBoxWidth = 100;
            const textBoxHeight = item.detail.fontSize;

            if (newX < 0) newX = 0;
            else if (newX + textBoxWidth > containerWidth)
              newX = containerWidth - textBoxWidth;

            if (newY < 0) newY = 0;
            else if (newY + textBoxHeight > containerHeight)
              newY = containerHeight - textBoxHeight;

            return {
              ...item,
              detail: { ...item.detail, x: newX, y: newY },
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
          if (item.detail.isDragging) {
            setUpdatedItems((prevItems) => [
              ...prevItems,
              { id: item.id, x: item.detail.x, y: item.detail.y },
            ]);
            return { ...item, detail: { ...item.detail, isDragging: false } };
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

  // useEffect(() => {
  //   const container = containerRef.current;
  //   window.addEventListener("touchmove", handleTouchMove, { passive: false });
  //   window.addEventListener("touchend", handleTouchEnd);

  //   return () => {
  //     window.removeEventListener("touchmove", handleTouchMove);
  //     window.removeEventListener("touchend", handleTouchEnd);
  //   };
  // }, []);

  const handleKeyDown = (e, id) => {
    if (e.key === "Enter") {
      if (e.ctrlKey) {
        e.preventDefault();
        updateCurTextItem(
          id,
          curItems.find((item) => item.id === id).detail.text + "\n"
        );
      } else {
        e.preventDefault();
        updateTextItem(id, curItems.find((item) => item.id === id).detail.text);
        finishEditing(id);
      }
    }
  };

  const updateCurTextItem = (id, newText) => {
    setCurItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id
          ? { ...item, detail: { ...item.detail, text: newText } }
          : item
      )
    );
  };

  const handleBlur = (id) => {
    const currentItem = curItems.find((item) => item.id === id);
    if (!currentItem.detail.text.trim()) {
      setCurItems(curItems.filter((item) => item.id !== id));
      deleteTextItem(id);
    } else {
      updateTextItem(id, currentItem.detail.text);
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
