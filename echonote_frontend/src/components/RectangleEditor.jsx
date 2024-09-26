import React, { useState } from "react";
import {
  StyledSVG,
  StyledRectangle,
  CurrentRectangle,
} from "./styles/RectangleEditor.style";

const DraggableRectangleEditor = () => {
  const [rectangles, setRectangles] = useState([]); // 그려진 사각형 목록
  const [isDrawing, setIsDrawing] = useState(false); // 현재 드래그로 사각형을 그리고 있는지 여부
  const [isDragging, setIsDragging] = useState(false); // 이미 생성된 사각형을 이동 중인지 여부
  const [currentRect, setCurrentRect] = useState(null); // 현재 그리고 있는 사각형의 정보
  const [draggingIndex, setDraggingIndex] = useState(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e) => {
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

  const handleMouseMove = (e) => {
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
      setRectangles(updatedRectangles);
    }
  };

  const handleMouseUp = () => {
    if (isDrawing && currentRect) {
      setRectangles([...rectangles, currentRect]);
      setCurrentRect(null);
    }
    setIsDrawing(false);
    setIsDragging(false);
    setDraggingIndex(null);
  };

  return (
    <StyledSVG
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {rectangles.map((rect, index) => (
        <StyledRectangle
          key={index}
          x={rect.x}
          y={rect.y}
          width={Math.abs(rect.width)}
          height={Math.abs(rect.height)}
        />
      ))}
      {currentRect && (
        <CurrentRectangle
          x={currentRect.x}
          y={currentRect.y}
          width={Math.abs(currentRect.width)}
          height={Math.abs(currentRect.height)}
        />
      )}
    </StyledSVG>
  );
};

export default DraggableRectangleEditor;
