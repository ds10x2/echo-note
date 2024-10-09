import React, { useEffect, useRef, useState, useCallback } from "react";
import * as St from "@/components/styles/ShapeEditor.style";
import shapeStore from "@/stores/shapeStore";
import drawingTypeStore from "@/stores/drawingTypeStore";
import { useAudioStore } from "@stores/recordStore";

const ShapeEditor = ({
  currentPageCircles,
  currentPageRecs,
  scale,
  parentContainerRef,
}) => {
  const { setRectangles, setCircles, property } = shapeStore();
  const { mode, shapeMode } = drawingTypeStore();
  const { createTime, isRecording } = useAudioStore();

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

  const getTimestamp = (recordStartTime, shapecreatedTime) => {
    return Math.floor((shapecreatedTime - recordStartTime) / 1000);
  };

  useEffect(() => {
    setCurrentRects(currentPageRecs);
    setCurrentCircles(currentPageCircles);
    setSelectedShape({ id: null, type: null });
  }, [currentPageRecs, currentPageCircles]);

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
          x >= rect.detail.x &&
          x <= rect.detail.x + rect.detail.width &&
          y >= rect.detail.y &&
          y <= rect.detail.y + rect.detail.height
      );

      const clickedCircleIndex = currentCircles.findIndex((circle) => {
        const dx = x - (circle.detail.x + circle.detail.rx);
        const dy = y - (circle.detail.y + circle.detail.ry);
        return Math.sqrt(dx * dx + dy * dy) <= circle.detail.rx;
      });

      if (clickedRectIndex !== -1) {
        setIsDragging(true);
        setDraggingIndex(clickedRectIndex);
        setOffset({
          x: x - currentRects[clickedRectIndex].detail.x,
          y: y - currentRects[clickedRectIndex].detail.y,
        });
        setSelectedShape({ id: clickedRectIndex, type: "rectangle" });
      } else if (clickedCircleIndex !== -1) {
        setIsDragging(true);
        setDraggingIndex(clickedCircleIndex);
        setOffset({
          x:
            x -
            (currentCircles[clickedCircleIndex].detail.x +
              currentCircles[clickedCircleIndex].detail.rx),
          y:
            y -
            (currentCircles[clickedCircleIndex].detail.y +
              currentCircles[clickedCircleIndex].detail.ry),
        });
        setSelectedShape({ id: clickedCircleIndex, type: "circle" });
      } else if (mode.shape && shapeMode.rectangle) {
        setIsDrawing(true);
        setCurrentRect({
          id: Date.now(),
          detail: {
            x,
            y,
            startX: x,
            startY: y,
            width: 0,
            height: 0,
            property: property,
            timeStamp: isRecording
              ? getTimestamp(createTime, Date.now())
              : null,
          },
        });
        setSelectedShape({ id: null, type: null });
      } else if (mode.shape && shapeMode.circle) {
        setIsDrawing(true);
        setCurrentCircle({
          id: Date.now(),
          detail: {
            x,
            y,
            startX: x,
            startY: y,
            rx: 0, // 타원의 가로 반경
            ry: 0, // 타원의 세로 반경
            property: property,
            timeStamp: isRecording
              ? getTimestamp(createTime, Date.now())
              : null,
          },
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
      scale,
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
        const newWidth = x - currentRect.detail.startX;
        const newHeight = y - currentRect.detail.startY;
        setCurrentRect({
          ...currentRect,
          detail: {
            ...currentRect.detail,
            x: newWidth < 0 ? x : currentRect.detail.startX,
            y: newHeight < 0 ? y : currentRect.detail.startY,
            width: Math.abs(newWidth),
            height: Math.abs(newHeight),
          },
        });
      } else if (isDrawing && currentCircle) {
        const newRx = Math.abs(x - currentCircle.detail.startX) / 2;
        const newRy = Math.abs(y - currentCircle.detail.startY) / 2;
        const newX = Math.min(x, currentCircle.detail.startX);
        const newY = Math.min(y, currentCircle.detail.startY);

        setCurrentCircle({
          ...currentCircle,
          detail: {
            ...currentCircle.detail,
            x: newX,
            y: newY,
            rx: newRx,
            ry: newRy,
          },
        });
      }

      if (isDragging && draggingIndex !== null) {
        if (selectedShape.type === "rectangle") {
          const updatedRects = currentRects.map((rect, index) => {
            if (index === draggingIndex) {
              return {
                ...rect,
                detail: {
                  ...rect.detail,
                  x: x - offset.x,
                  y: y - offset.y,
                },
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
                detail: {
                  ...circle.detail,
                  x: x - offset.x - circle.detail.rx,
                  y: y - offset.y - circle.detail.ry,
                },
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
      scale,
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
            x={rect.detail.x}
            y={rect.detail.y}
            width={rect.detail.width}
            height={rect.detail.height}
            fill={
              rect.detail.property.fill
                ? rect.detail.property.fillColor
                : "none"
            }
            stroke={
              rect.detail.property.stroke
                ? rect.detail.property.strokeColor
                : "none"
            }
            strokeWidth={
              rect.detail.property.stroke ? rect.detail.property.strokeWidth : 0
            }
            onClick={() => setSelectedShape({ id: index, type: "rectangle" })}
            isSelected={
              selectedShape.id === index && selectedShape.type === "rectangle"
            } // 선택 여부
          />
        ))}
        {currentCircles.map((circle, index) => (
          <St.StyledCircle
            key={index}
            cx={circle.detail.x + circle.detail.rx}
            cy={circle.detail.y + circle.detail.ry}
            rx={circle.detail.rx}
            ry={circle.detail.ry}
            fill={
              circle.detail.property.fill
                ? circle.detail.property.fillColor
                : "none"
            }
            stroke={
              circle.detail.property.stroke
                ? circle.detail.property.strokeColor
                : "none"
            }
            strokeWidth={
              circle.detail.property.stroke
                ? circle.detail.property.strokeWidth
                : 0
            }
            onClick={() => setSelectedShape({ id: index, type: "circle" })}
            isSelected={
              selectedShape.id === index && selectedShape.type === "circle"
            } // 선택 여부
          />
        ))}
        {currentRect && (
          <St.CurrentRectangle
            x={currentRect.detail.x}
            y={currentRect.detail.y}
            width={currentRect.detail.width}
            height={currentRect.detail.height}
            fill={
              currentRect.detail.property.fill
                ? currentRect.detail.property.fillColor
                : "none"
            }
            stroke={
              currentRect.detail.property.stroke
                ? currentRect.detail.property.strokeColor
                : "none"
            }
            strokeWidth={
              currentRect.detail.property.stroke
                ? currentRect.detail.property.strokeWidth
                : 0
            }
          />
        )}
        {currentCircle && (
          <St.StyledCircle
            cx={currentCircle.detail.x + currentCircle.detail.rx}
            cy={currentCircle.detail.y + currentCircle.detail.ry}
            rx={currentCircle.detail.rx}
            ry={currentCircle.detail.ry}
            fill={
              currentCircle.detail.property.fill
                ? currentCircle.detail.property.fillColor
                : "none"
            }
            stroke={
              currentCircle.detail.property.stroke
                ? currentCircle.detail.property.strokeColor
                : "none"
            }
            strokeWidth={
              currentCircle.detail.property.stroke
                ? currentCircle.detail.property.strokeWidth
                : 0
            }
          />
        )}
      </St.StyledSVG>
    </St.ShapeContainer>
  );
};

export default ShapeEditor;
