import React, { useEffect, useRef, useState } from "react";
import * as St from "@/components/styles/ShapeEditor.style";
import shapeStore from "@/stores/shapeStore";
import drawingTypeStore from "@/stores/drawingTypeStore"; // drawingTypeStore 가져오기

const ShapeEditor = ({ scale, hasDraggedRef, isDraggingRef }) => {
  const {
    addRectangle,
    updateRectangle,
    getRectangles,
    setRectangles,
    currentPage,
  } = shapeStore();
  const { mode } = drawingTypeStore(); // drawingTypeStore의 mode 가져오기

  const [isDrawing, setIsDrawing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [draggingIndex, setDraggingIndex] = useState(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [currentRect, setCurrentRect] = useState(null);

  const rectangles = getRectangles(currentPage); // 현재 페이지의 사각형 가져오기

  const handleMouseDownRec = (e) => {
    if (!mode.shape) return; // 모드가 shape가 아닐 때는 이벤트 무시

    e.stopPropagation();

    const clickedIndex = rectangles.findIndex(
      (rect) =>
        e.nativeEvent.offsetX >= rect.x &&
        e.nativeEvent.offsetX <= rect.x + rect.width &&
        e.nativeEvent.offsetY >= rect.y &&
        e.nativeEvent.offsetY <= rect.y + rect.height
    );

    if (clickedIndex !== -1) {
      setIsDragging(true);
      setDraggingIndex(clickedIndex);
      setOffset({
        x: e.nativeEvent.offsetX - rectangles[clickedIndex].x,
        y: e.nativeEvent.offsetY - rectangles[clickedIndex].y,
      });
    } else {
      setIsDrawing(true);
      const startX = e.nativeEvent.offsetX;
      const startY = e.nativeEvent.offsetY;
      setCurrentRect({ x: startX, y: startY, width: 0, height: 0 });
    }
  };

  const handleMouseMoveRec = (e) => {
    if (isDrawing) {
      const newWidth = e.nativeEvent.offsetX - currentRect.x;
      const newHeight = e.nativeEvent.offsetY - currentRect.y;
      setCurrentRect({
        ...currentRect,
        width: newWidth,
        height: newHeight,
      });
    }

    if (isDragging && draggingIndex !== null) {
      const updatedRectangles = rectangles.map((rect, index) => {
        if (index === draggingIndex) {
          return {
            ...rect,
            x: e.nativeEvent.offsetX - offset.x,
            y: e.nativeEvent.offsetY - offset.y,
          };
        }
        return rect;
      });
      setRectangles(currentPage, updatedRectangles);
    }
  };

  const handleMouseUpRec = () => {
    if (isDrawing && currentRect) {
      addRectangle(currentRect, currentPage); // 사각형 추가 시 현재 페이지 전달
      setCurrentRect(null);
    }
    setIsDrawing(false);
    setIsDragging(false);
    setDraggingIndex(null);
  };

  return (
    <St.ShapeContainer modeShape={mode.shape}>
      <St.StyledSVG
        onMouseDown={handleMouseDownRec}
        onMouseMove={handleMouseMoveRec}
        onMouseUp={handleMouseUpRec}
        onMouseLeave={handleMouseUpRec}
      >
        {rectangles.map((rect, index) => (
          <St.StyledRectangle
            key={index}
            x={rect.x}
            y={rect.y}
            width={Math.abs(rect.width)}
            height={Math.abs(rect.height)}
          />
        ))}
        {currentRect && (
          <St.CurrentRectangle
            x={currentRect.x}
            y={currentRect.y}
            width={Math.abs(currentRect.width)}
            height={Math.abs(currentRect.height)}
          />
        )}
      </St.StyledSVG>
    </St.ShapeContainer>
  );
};

export default ShapeEditor;
