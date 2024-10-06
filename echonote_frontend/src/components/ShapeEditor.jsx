import React, { useEffect, useState, useCallback } from "react";
import * as St from "@/components/styles/ShapeEditor.style";
import shapeStore from "@/stores/shapeStore";
import drawingTypeStore from "@/stores/drawingTypeStore";
import EditButton from "@components/common/EditButton";

const ShapeEditor = ({ currentPageCircles, currentPageRecs }) => {
  const { setRectangles, setCircles, property } = shapeStore();
  const { mode, shapeMode } = drawingTypeStore();

  const [isDrawing, setIsDrawing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [draggingIndex, setDraggingIndex] = useState(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [currentRect, setCurrentRect] = useState(null);
  const [currentCircle, setCurrentCircle] = useState(null);

  const [currentRects, setCurrentRects] = useState(currentPageRecs);
  const [currentCircles, setCurrentCircles] = useState(currentPageCircles);
  const [selectedShape, setSelectedShape] = useState({ id: null, type: null });

  useEffect(() => {
    setCurrentRects(currentPageRecs);
    setCurrentCircles(currentPageCircles);
    setSelectedShape({ id: null, type: null });
  }, [currentPageRecs, currentPageCircles]);

  const handleMouseDownRec = useCallback(
    (e) => {
      if (!mode.shape) return;
      e.stopPropagation();

      const clickedRectIndex = currentRects.findIndex(
        (rect) =>
          e.nativeEvent.offsetX >= rect.x &&
          e.nativeEvent.offsetX <= rect.x + rect.width &&
          e.nativeEvent.offsetY >= rect.y &&
          e.nativeEvent.offsetY <= rect.y + rect.height
      );

      const clickedCircleIndex = currentCircles.findIndex((circle) => {
        const dx = e.nativeEvent.offsetX - circle.cx;
        const dy = e.nativeEvent.offsetY - circle.cy;
        const distance = Math.sqrt(dx * dx + dy * dy);
        return distance <= circle.r;
      });

      if (clickedRectIndex !== -1) {
        setIsDragging(true);
        setDraggingIndex(clickedRectIndex);
        setOffset({
          x: e.nativeEvent.offsetX - currentRects[clickedRectIndex].x,
          y: e.nativeEvent.offsetY - currentRects[clickedRectIndex].y,
        });
        setSelectedShape({ id: clickedRectIndex, type: "rectangle" });
      } else if (clickedCircleIndex !== -1) {
        setIsDragging(true);
        setDraggingIndex(clickedCircleIndex);
        setOffset({
          x: e.nativeEvent.offsetX - currentCircles[clickedCircleIndex].cx,
          y: e.nativeEvent.offsetY - currentCircles[clickedCircleIndex].cy,
        });
        setSelectedShape({ id: clickedCircleIndex, type: "circle" });
      } else if (shapeMode.rectangle) {
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
        setSelectedShape({ id: null, type: null });
      } else if (shapeMode.circle) {
        setIsDrawing(true);
        const startX = e.nativeEvent.offsetX;
        const startY = e.nativeEvent.offsetY;

        setCurrentCircle({
          cx: startX,
          cy: startY,
          r: 0,
          property: property,
        });
        setSelectedShape({ id: null, type: null });
      }
    },
    [
      currentRects,
      currentCircles,
      mode.shape,
      shapeMode.rectangle,
      shapeMode.circle,
    ]
  );

  const handleMouseMoveRec = useCallback(
    (e) => {
      if (isDrawing && currentRect) {
        const newX = e.nativeEvent.offsetX;
        const newY = e.nativeEvent.offsetY;
        const newWidth = newX - currentRect.startX;
        const newHeight = newY - currentRect.startY;

        setCurrentRect({
          ...currentRect,
          x: newWidth < 0 ? newX : currentRect.startX,
          y: newHeight < 0 ? newY : currentRect.startY,
          width: Math.abs(newWidth),
          height: Math.abs(newHeight),
        });
      } else if (isDrawing && currentCircle) {
        const newX = e.nativeEvent.offsetX;
        const newY = e.nativeEvent.offsetY;
        const dx = newX - currentCircle.cx;
        const dy = newY - currentCircle.cy;
        const newRadius = Math.sqrt(dx * dx + dy * dy);

        setCurrentCircle({
          ...currentCircle,
          r: newRadius,
        });
      }

      if (isDragging && draggingIndex !== null) {
        if (selectedShape.type === "rectangle") {
          const updatedRects = currentRects.map((rect, index) => {
            if (index === draggingIndex) {
              return {
                ...rect,
                x: e.nativeEvent.offsetX - offset.x,
                y: e.nativeEvent.offsetY - offset.y,
              };
            }
            return rect;
          });
          setCurrentRects(updatedRects);
        } else if (selectedShape.type === "circle") {
          const updatedCircles = currentCircles.map((circle, index) => {
            if (index === draggingIndex) {
              return {
                ...circle,
                cx: e.nativeEvent.offsetX - offset.x,
                cy: e.nativeEvent.offsetY - offset.y,
              };
            }
            return circle;
          });
          setCurrentCircles(updatedCircles);
        }
      }
    },
    [
      isDrawing,
      currentRect,
      currentCircle,
      isDragging,
      draggingIndex,
      offset,
      selectedShape,
      currentRects,
      currentCircles,
    ]
  );

  const handleMouseUpRec = useCallback(() => {
    if (isDrawing && currentRect) {
      setCurrentRects((prevRects) => [...prevRects, currentRect]);
      setCurrentRect(null);
      setIsDrawing(false);
    }

    if (isDrawing && currentCircle) {
      setCurrentCircles((prevCircles) => [...prevCircles, currentCircle]);
      setCurrentCircle(null);
      setIsDrawing(false);
    }

    if (isDragging) {
      setIsDragging(false);
      setDraggingIndex(null);
    }

    setRectangles(currentRects);
    setCircles(currentCircles);
  }, [
    isDrawing,
    currentRect,
    currentCircle,
    isDragging,
    currentRects,
    currentCircles,
    setRectangles,
    setCircles,
  ]);

  const handleDelete = useCallback(() => {
    if (selectedShape.id !== null) {
      if (selectedShape.type === "rectangle") {
        const updatedRects = currentRects.filter(
          (_, index) => index !== selectedShape.id
        );
        setCurrentRects(updatedRects);
        setRectangles(updatedRects);
      } else if (selectedShape.type === "circle") {
        const updatedCircles = currentCircles.filter(
          (_, index) => index !== selectedShape.id
        );
        setCurrentCircles(updatedCircles);
        setCircles(updatedCircles);
      }
      setSelectedShape({ id: null, type: null });
    }
  }, [selectedShape, currentRects, currentCircles, setRectangles, setCircles]);

  return (
    <St.ShapeContainer $modeShape={mode.shape}>
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
            width={rect.width}
            height={rect.height}
            fill={rect.property.fill ? rect.property.fillColor : "none"}
            stroke={rect.property.stroke ? rect.property.strokeColor : "none"}
            strokeWidth={rect.property.stroke ? rect.property.strokeWidth : 0}
            onClick={() => setSelectedShape({ id: index, type: "rectangle" })}
          />
        ))}
        {currentCircles.map((circle, index) => (
          <St.StyledCircle
            key={index}
            cx={circle.cx}
            cy={circle.cy}
            r={circle.r}
            fill={circle.property.fill ? circle.property.fillColor : "none"}
            stroke={
              circle.property.stroke ? circle.property.strokeColor : "none"
            }
            strokeWidth={
              circle.property.stroke ? circle.property.strokeWidth : 0
            }
            onClick={() => setSelectedShape({ id: index, type: "circle" })}
          />
        ))}
        {currentRect && (
          <St.CurrentRectangle
            x={currentRect.x}
            y={currentRect.y}
            width={currentRect.width}
            height={currentRect.height}
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
        {currentCircle && (
          <St.CurrentCircle
            cx={currentCircle.cx}
            cy={currentCircle.cy}
            r={currentCircle.r}
            fill={
              currentCircle.property.fill
                ? currentCircle.property.fillColor
                : "none"
            }
            stroke={
              currentCircle.property.stroke
                ? currentCircle.property.strokeColor
                : "none"
            }
            strokeWidth={
              currentCircle.property.stroke
                ? currentCircle.property.strokeWidth
                : 0
            }
          />
        )}
      </St.StyledSVG>
      {selectedShape.id !== null && (
        <St.ButtonContainer
          $top={
            currentRects[selectedShape.id]?.y ||
            currentCircles[selectedShape.id]?.cy ||
            0
          }
          $left={
            (currentRects[selectedShape.id]?.x ||
              currentCircles[selectedShape.id]?.cx ||
              0) + 10
          }
        >
          <EditButton buttonText="삭제" onClick={handleDelete} />
        </St.ButtonContainer>
      )}
    </St.ShapeContainer>
  );
};

export default ShapeEditor;
