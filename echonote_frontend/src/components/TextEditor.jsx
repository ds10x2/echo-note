import React, { useEffect, useRef, useState } from "react";
import * as St from "./styles/TextEditor.style";

import EditButton from "@components/common/EditButton";
import textStore from "@stores/textStore";
import drawingTypeStore from "@/stores/drawingTypeStore";

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
  } = textStore();

  const { setTextMode, mode } = drawingTypeStore();

  const [curItems, setCurItems] = useState(currentPageItems);
  const [updatedItems, setUpdatedItems] = useState([]);
  const containerRef = useRef();
  const [selectedItemId, setSelectedItemId] = useState(null); // 선택된 텍스트박스 ID 상태

  const handleAddTextBox = (e) => {
    if (isDraggingRef.current || hasDraggedRef.current) return;

    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

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
      fontSize: 16,
    });

    setSelectedItemId(null); // 새로운 텍스트 박스 추가 시 기존 선택된 상태를 해제
  };

  const handleClickEvent = (e) => {
    if (mode.text) {
      if (!e.target.closest(".text-box")) {
        handleAddTextBox(e);
      } else {
        setSelectedItemId(null); // 다른 곳을 클릭하면 선택 해제
      }
    }
  };

  useEffect(() => {
    const container = containerRef.current;

    if (mode.text) {
      container.addEventListener("mousedown", handleClickEvent);
    }

    return () => {
      container.removeEventListener("mousedown", handleClickEvent);
    };
  }, [mode.text]);

  useEffect(() => {
    setCurItems(currentPageItems);
  }, [currentPageItems]);

  const handleMouseDown = (e, id) => {
    e.stopPropagation();
    isDraggingRef.current = true;
    hasDraggedRef.current = false;
    setSelectedItemId(id); // 텍스트박스 클릭 시 해당 ID를 선택

    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    const parentScrollLeft = parentContainerRef.current.scrollLeft;
    const parentScrollTop = parentContainerRef.current.scrollTop;

    const item = curItems.find((item) => item.id === id);
    const offsetX =
      clientX +
      parentScrollLeft -
      (item.x * scale + containerRef.current.offsetLeft);
    const offsetY =
      clientY +
      parentScrollTop -
      (item.y * scale + containerRef.current.offsetTop);

    setCurItems((items) =>
      items.map((item) =>
        item.id === id
          ? {
              ...item,
              isDragging: true,
              offsetX: offsetX,
              offsetY: offsetY,
            }
          : item
      )
    );

    document.body.style.userSelect = "none";
  };

  const handleMouseMove = (e) => {
    if (isDraggingRef.current) {
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;

      setCurItems((items) =>
        items.map((item) => {
          if (item.isDragging) {
            let newX = clientX - item.offsetX;
            let newY = clientY - item.offsetY;

            const containerRect = containerRef.current.getBoundingClientRect();
            const containerWidth = containerRect.width;
            const containerHeight = containerRect.height;

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

  const handleMouseUp = () => {
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
    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mouseup", handleMouseUp);
    container.addEventListener("touchmove", handleMouseMove);
    container.addEventListener("touchend", handleMouseUp);

    return () => {
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mouseup", handleMouseUp);
      container.removeEventListener("touchmove", handleMouseMove);
      container.removeEventListener("touchend", handleMouseUp);
    };
  }, []);

  const handleKeyDown = (e, id) => {
    if (e.key === "Enter") {
      if (e.ctrlKey) {
        e.preventDefault();
        updateTextItem(id, curItems.find((item) => item.id === id).text + "\n");
      } else {
        e.preventDefault();
        finishEditing(id);
      }
    }
  };

  const calculateMinWidth = (text, fontSize) => {
    const lines = text.split("\n");
    const longestLine = lines.reduce(
      (a, b) => (a.length > b.length ? a : b),
      ""
    );
    return fontSize * longestLine.length;
  };

  return (
    <St.TextContainer ref={containerRef} mode={mode.text}>
      {curItems.map((item) => (
        <St.TextBox
          key={item.id}
          x={item.x}
          y={item.y}
          isEditing={item.isEditing}
          isDragging={item.isDragging}
          className="text-box"
          onMouseDown={(e) => handleMouseDown(e, item.id)}
          onTouchStart={(e) => handleMouseDown(e, item.id)}
          style={{
            fontSize: `${item.fontSize}px`,
          }}
          minWidth={calculateMinWidth(item.text, item.fontSize)}
        >
          {item.isEditing ? (
            <St.TextArea
              value={item.text}
              autoFocus
              onChange={(e) => updateTextItem(item.id, e.target.value)}
              onBlur={() => finishEditing(item.id)}
              onKeyDown={(e) => handleKeyDown(e, item.id)}
              style={{ fontSize: `${item.fontSize}px` }}
            />
          ) : (
            <St.TextDetail fontSize={item.fontSize}>{item.text}</St.TextDetail>
          )}
          {selectedItemId === item.id && (
            <St.ButtonContainer>
              <EditButton buttonText="삭제" />
            </St.ButtonContainer>
          )}
        </St.TextBox>
      ))}
    </St.TextContainer>
  );
};

export default TextEditor;
