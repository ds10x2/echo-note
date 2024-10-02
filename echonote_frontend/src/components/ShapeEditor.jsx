// ShapeEditor.jsx
import React, { useEffect, useState } from "react";
import * as St from "@/components/styles/ShapeEditor.style";
import shapeStore from "@/stores/shapeStore";
import drawingTypeStore from "@/stores/drawingTypeStore";
import EditButton from "@components/common/EditButton";

const ShapeEditor = ({ currentCircles, currentPageRecs }) => {
  const { setRectangles, property } = shapeStore();
  const { mode } = drawingTypeStore();

  const [isDrawing, setIsDrawing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [draggingIndex, setDraggingIndex] = useState(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [currentRect, setCurrentRect] = useState(null);

  const [currentRects, setCurrentRects] = useState(currentPageRecs);
  const [selectedRectId, setSelectedRectId] = useState(null);

  useEffect(() => {
    setCurrentRects(currentPageRecs);
    setSelectedRectId(null);
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
      setSelectedRectId(clickedIndex);
    } else {
      setIsDrawing(true);
      const startX = e.nativeEvent.offsetX;
      const startY = e.nativeEvent.offsetY;

      setCurrentRect({
        x: startX,
        y: startY,
        startX: startX,
        startY: startY,
        width: 0,
        height: 0,
        property: property,
      });
      setSelectedRectId(null);
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
      setSelectedRectId(null);
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

  const handleDelete = () => {
    if (selectedRectId !== null) {
      const updatedRects = currentRects.filter(
        (_, index) => index !== selectedRectId
      );
      setCurrentRects(updatedRects);
      setRectangles(updatedRects);
      setSelectedRectId(null);
    }
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
            className="rectangle"
            onClick={() => setSelectedRectId(index)} // 클릭 시 선택된 ID 설정
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
      {selectedRectId !== null && (
        <St.ButtonContainer
          $top={
            currentRects[selectedRectId].y +
            currentRects[selectedRectId].height +
            10 // 도형의 아래에 약간의 여백 추가
          }
          $left={
            currentRects[selectedRectId].x +
            currentRects[selectedRectId].width / 2
          }
        >
          <EditButton buttonText="삭제" onClick={handleDelete} />
        </St.ButtonContainer>
      )}
    </St.ShapeContainer>
  );
};

export default ShapeEditor;
