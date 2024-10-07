import React, { useEffect, useRef, useState, useCallback } from "react";
import * as St from "@/components/styles/ShapeEditor.style";
import shapeStore from "@/stores/shapeStore";
import drawingTypeStore from "@/stores/drawingTypeStore";
import EditButton from "@components/common/EditButton";

const ShapeEditor = ({
  currentPageCircles,
  currentPageRecs,
  scale,
  parentContainerRef,
}) => {
  const { setRectangles, setCircles, property } = shapeStore();
  const { mode, shapeMode } = drawingTypeStore();

  const svgRef = useRef(null);
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

  const handleDelete = (e) => {
    e.stopPropagation();
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
  };

  const handleMouseDownRec = useCallback(
    (e) => {
      e.stopPropagation();
      setIsDragging(true);

      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;

      const container = svgRef.current.getBoundingClientRect();
      const scaleFactor = 1 / scale; // scale을 반영하여 계산

      const x = (clientX - container.left) * scaleFactor; // scale 적용
      const y = (clientY - container.top) * scaleFactor; // scale 적용

      const clickedRectIndex = currentRects.findIndex(
        (rect) =>
          x >= rect.x &&
          x <= rect.x + rect.width &&
          y >= rect.y &&
          y <= rect.y + rect.height
      );

      const clickedCircleIndex = currentCircles.findIndex((circle) => {
        const dx = x - circle.cx;
        const dy = y - circle.cy;
        return Math.sqrt(dx * dx + dy * dy) <= circle.r;
      });

      if (clickedRectIndex !== -1) {
        setIsDragging(true);
        setDraggingIndex(clickedRectIndex);
        setOffset({
          x: x - currentRects[clickedRectIndex].x,
          y: y - currentRects[clickedRectIndex].y,
        });
        setSelectedShape({ id: clickedRectIndex, type: "rectangle" });
      } else if (clickedCircleIndex !== -1) {
        setIsDragging(true);
        setDraggingIndex(clickedCircleIndex);
        setOffset({
          x: x - currentCircles[clickedCircleIndex].cx,
          y: y - currentCircles[clickedCircleIndex].cy,
        });
        setSelectedShape({ id: clickedCircleIndex, type: "circle" });
      } else if (mode.shape && shapeMode.rectangle) {
        setIsDrawing(true);
        setCurrentRect({
          x,
          y,
          startX: x,
          startY: y,
          width: 0,
          height: 0,
          property: property,
        });
        setSelectedShape({ id: null, type: null });
      } else if (mode.shape && shapeMode.circle) {
        setIsDrawing(true);
        setCurrentCircle({
          cx: x,
          cy: y,
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
      property,
      scale, // scale이 바뀔 때마다 좌표 계산을 다시 해야 하므로 추가
    ]
  );

  const handleMove = useCallback(
    (e) => {
      let x, y;
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      const container = svgRef.current.getBoundingClientRect();
      const scaleFactor = 1 / scale;

      x = (clientX - container.left) * scaleFactor; // scale 적용
      y = (clientY - container.top) * scaleFactor; // scale 적용

      if (isDrawing && currentRect) {
        const newWidth = x - currentRect.startX;
        const newHeight = y - currentRect.startY;
        setCurrentRect({
          ...currentRect,
          x: newWidth < 0 ? x : currentRect.startX,
          y: newHeight < 0 ? y : currentRect.startY,
          width: Math.abs(newWidth),
          height: Math.abs(newHeight),
        });
      } else if (isDrawing && currentCircle) {
        const dx = x - currentCircle.cx;
        const dy = y - currentCircle.cy;
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
                x: x - offset.x,
                y: y - offset.y,
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
                cx: x - offset.x,
                cy: y - offset.y,
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
      scale, // scale을 추가하여 계산을 정확하게 유지
    ]
  );

  const handleEnd = useCallback(() => {
    setIsDragging(false);
    if (isDrawing && currentRect) {
      shapeStore.getState().addRectangle(currentRect);
      setCurrentRect(null);
      setIsDrawing(false);
    } else if (isDrawing && currentCircle) {
      shapeStore.getState().addCircle(currentCircle);
      setCurrentCircle(null);
      setIsDrawing(false);
    } else if (isDragging) {
      if (selectedShape.type === "rectangle") {
        shapeStore
          .getState()
          .updateRectangle(draggingIndex, currentRects[draggingIndex]);
      } else if (selectedShape.type === "circle") {
        shapeStore
          .getState()
          .updateCircle(draggingIndex, currentCircles[draggingIndex]);
      }
      setIsDragging(false);
      setDraggingIndex(null);
    }
    setOffset({ x: 0, y: 0 });
  }, [
    isDrawing,
    currentRect,
    currentCircle,
    isDragging,
    draggingIndex,
    currentRects,
    currentCircles,
    selectedShape,
  ]);

  useEffect(() => {
    const touchMoveHandler = (e) => {};

    window.addEventListener("touchmove", touchMoveHandler, { passive: true });

    return () => {
      window.removeEventListener("touchmove", touchMoveHandler);
    };
  }, []);

  useEffect(() => {
    const handleTouchMove = (e) => {
      if (mode.shape && isDragging) {
        e.preventDefault(); // 드래그 중일 때만 스크롤 차단
      }
    };

    // 이벤트 리스너를 추가하여 드래그 중에만 스크롤을 차단
    parentContainerRef.current?.addEventListener("touchmove", handleTouchMove, {
      passive: false,
    });

    return () => {
      parentContainerRef.current?.removeEventListener(
        "touchmove",
        handleTouchMove
      );
    };
  }, [isDragging, parentContainerRef]);

  return (
    <St.ShapeContainer $modeShape={mode.shape}>
      <St.StyledSVG
        ref={svgRef}
        onMouseDown={handleMouseDownRec}
        onMouseMove={handleMove}
        onMouseUp={handleEnd}
        onMouseLeave={handleEnd}
        onTouchStart={handleMouseDownRec}
        onTouchMove={handleMove}
        onTouchEnd={handleEnd}
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
