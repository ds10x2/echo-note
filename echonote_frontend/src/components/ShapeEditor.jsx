import React, { useEffect, useState, useCallback, useRef } from "react";
import * as St from "@/components/styles/ShapeEditor.style";
import shapeStore from "@/stores/shapeStore";
import drawingTypeStore from "@/stores/drawingTypeStore";
import EditButton from "@components/common/EditButton";

const ShapeEditor = ({ currentPageCircles, currentPageRecs }) => {
  const { setRectangles, setCircles, property } = shapeStore();
  const { mode, shapeMode } = drawingTypeStore();

  const svgRef = useRef(null); // SVG 요소 참조를 위한 useRef
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

  const handleDelete = () => {
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

      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;

      const container = svgRef.current.getBoundingClientRect();
      const x = clientX - container.left;
      const y = clientY - container.top;

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

      // 도형이 클릭되었을 때는 mode.shape에 상관없이 드래그가 가능하도록 설정
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
      }

      // 도형을 그리는 경우는 mode.shape가 true일 때만 동작
      else if (mode.shape && shapeMode.rectangle) {
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
    ]
  );

  const handleMove = useCallback(
    (e) => {
      // e.preventDefault(); // 스크롤 방지

      let x, y;
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      const container = svgRef.current.getBoundingClientRect();
      x = clientX - container.left;
      y = clientY - container.top;

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
    ]
  );

  const handleEnd = useCallback(() => {
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

    // 클릭 좌표 초기화
    setOffset({ x: 0, y: 0 });
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

  useEffect(() => {
    const touchMoveHandler = (e) => {
      e.preventDefault();
    };

    window.addEventListener("touchmove", touchMoveHandler, { passive: false });

    return () => {
      window.removeEventListener("touchmove", touchMoveHandler);
    };
  }, []);

  return (
    <St.ShapeContainer $modeShape={mode.shape}>
      <St.StyledSVG
        ref={svgRef} // SVG 참조 추가
        onMouseDown={handleMouseDownRec}
        onMouseMove={handleMove}
        onMouseUp={handleEnd}
        onMouseLeave={handleEnd}
        onTouchStart={handleMouseDownRec} // 터치 시작 이벤트
        onTouchMove={handleMove} // 터치 이동 이벤트
        onTouchEnd={handleEnd} // 터치 종료 이벤트
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
