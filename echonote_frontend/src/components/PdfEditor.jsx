import React, { useState, useEffect, useRef } from "react";
import * as St from "./styles/PdfEditor.style";

const PdfEditor = ({ canvasSize }) => {
  const containerRef = useRef();
  const [textItems, setTextItems] = useState([]);
  const [isTextMode, setIsTextMode] = useState(false);
  const isDraggingRef = useRef(false);
  const hasDraggedRef = useRef(false);

  const addTextBox = (e) => {
    if (!isTextMode || isDraggingRef.current || hasDraggedRef.current) return;

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

  const handleMouseUp = () => {
    isDraggingRef.current = false;

    setTextItems((items) =>
      items.map((item) =>
        item.isDragging ? { ...item, isDragging: false } : item
      )
    );

    if (hasDraggedRef.current) {
      setTimeout(() => {
        hasDraggedRef.current = false;
      }, 50);
    }
  };

  const updateTextItem = (id, newText) => {
    setTextItems((items) =>
      items.map((item) => (item.id === id ? { ...item, text: newText } : item))
    );
  };

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

  const handleMouseDown = (e, id) => {
    e.stopPropagation();
    isDraggingRef.current = true;
    hasDraggedRef.current = false;

    const clientX = e.clientX;
    const clientY = e.clientY;

    setTextItems((items) =>
      items.map((item) =>
        item.id === id
          ? {
              ...item,
              isDragging: true,
              offsetX: clientX - item.x,
              offsetY: clientY - item.y,
            }
          : item
      )
    );
  };

  const handleTouchStart = (e, id) => {
    e.stopPropagation();
    isDraggingRef.current = true;
    hasDraggedRef.current = false;

    const clientX = e.touches[0].clientX;
    const clientY = e.touches[0].clientY;

    setTextItems((items) =>
      items.map((item) =>
        item.id === id
          ? {
              ...item,
              isDragging: true,
              offsetX: clientX - item.x,
              offsetY: clientY - item.y,
            }
          : item
      )
    );
  };

  const handleMouseMove = (e) => {
    if (isDraggingRef.current) {
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;

      const containerRect = containerRef.current.getBoundingClientRect();
      const containerWidth = containerRect.width;
      const containerHeight = containerRect.height;

      setTextItems((items) =>
        items.map((item) => {
          if (item.isDragging) {
            let newX = clientX - item.offsetX;
            let newY = clientY - item.offsetY;

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

  return (
    <St.PdfEditorContainer
      ref={containerRef}
      onClick={addTextBox} // onClick 이벤트로 addTextBox 호출
      width={canvasSize.width}
      height={canvasSize.height}
    >
      <button
        onClick={() => setIsTextMode(!isTextMode)}
        style={{ position: "absolute", top: 10, left: 10, zIndex: 10 }}
      >
        {isTextMode ? "Text Mode On" : "Text Mode Off"}
      </button>
      {textItems.map((item) => (
        <St.TextBox
          key={item.id}
          x={item.x}
          y={item.y}
          isEditing={item.isEditing}
          isDragging={item.isDragging}
          onMouseDown={(e) => handleMouseDown(e, item.id)}
          onTouchStart={(e) => handleTouchStart(e, item.id)}
          style={{
            fontSize: `${item.fontSize}px`,
          }}
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
        </St.TextBox>
      ))}
    </St.PdfEditorContainer>
  );
};

export default PdfEditor;
