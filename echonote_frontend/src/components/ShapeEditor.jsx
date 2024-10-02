import React, { useEffect, useRef, useState } from "react";
import * as St from "@/components/styles/ShapeEditor.style";
import shapeStore from "@/stores/shapeStore";
import drawingTypeStore from "@/stores/drawingTypeStore";

const ShapeEditor = ({ currentCircles, currentPageRecs }) => {
  const { setRectangles, property } = shapeStore();
  const { mode } = drawingTypeStore();

  const [isDrawing, setIsDrawing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [draggingIndex, setDraggingIndex] = useState(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [currentRect, setCurrentRect] = useState(null);

  const [currentRects, setCurrentRects] = useState(currentPageRecs);

  useEffect(() => {
    setCurrentRects(currentPageRecs);
  }, [currentPageRecs]);

  const handleMouseDownRec = (e) => {
    if (!mode.shape) return;

    e.stopPropagation();

    const clickedIndex = currentRects.findIndex(
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
        x: e.nativeEvent.offsetX - currentRects[clickedIndex].x,
        y: e.nativeEvent.offsetY - currentRects[clickedIndex].y,
      });
    } else {
      setIsDrawing(true);
      const startX = e.nativeEvent.offsetX;
      const startY = e.nativeEvent.offsetY;

      // 새로운 사각형에 기본 속성 추가
      setCurrentRect({
        x: startX,
        y: startY,
        width: 0,
        height: 0,
        property: property,
      });
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
      const updatedRectangles = currentRects.map((rect, index) => {
        if (index === draggingIndex) {
          return {
            ...rect,
            x: e.nativeEvent.offsetX - offset.x,
            y: e.nativeEvent.offsetY - offset.y,
          };
        }
        return rect;
      });
      setCurrentRects(updatedRectangles);
    }
  };

  const handleMouseUpRec = () => {
    if (isDrawing && currentRect) {
      setCurrentRects([...currentRects, currentRect]);
      setCurrentRect(null);
    }
    setIsDrawing(false);
    setIsDragging(false);
    setDraggingIndex(null);

    setRectangles(currentRects);
  };

  return (
    <St.ShapeContainer modeShape={mode.shape}>
      <St.StyledSVG
        onMouseDown={handleMouseDownRec}
        onMouseMove={handleMouseMoveRec}
        onMouseUp={handleMouseUpRec}
        onMouseLeave={handleMouseUpRec}
      >
        {currentRects.map((rect, index) => (
          <St.StyledRectangle
            key={index}
            x={rect.x}
            y={rect.y}
            width={Math.abs(rect.width)}
            height={Math.abs(rect.height)}
            fill={rect.property.fill ? rect.property.fillColor : "none"}
            stroke={rect.property.stroke ? rect.property.strokeColor : "none"}
            strokeWidth={rect.property.stroke ? rect.property.strokeWidth : 0}
          />
        ))}
        {currentRect && (
          <St.CurrentRectangle
            x={currentRect.x}
            y={currentRect.y}
            width={Math.abs(currentRect.width)}
            height={Math.abs(currentRect.height)}
            fill={
              currentRect.property.fill
                ? currentRect.property.fillColor
                : "none"
            }
            stroke={
              currentRect.property.stroke
                ? currentRect.property.strokeColor
                : "none"
            }
            strokeWidth={
              currentRect.property.stroke ? currentRect.property.strokeWidth : 0
            }
          />
        )}
      </St.StyledSVG>
    </St.ShapeContainer>
  );
};

export default ShapeEditor;
