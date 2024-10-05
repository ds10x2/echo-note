import React, { useEffect, useState } from "react";
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
  const [selectedShapeId, setSelectedShapeId] = useState(null);

  useEffect(() => {
    setCurrentRects(currentPageRecs);
    setCurrentCircles(currentPageCircles);
    setSelectedShapeId(null);
  }, [currentPageRecs, currentPageCircles]);

  const handleMouseDownRec = (e) => {
    if (!mode.shape) return;

    e.stopPropagation();

    // 사각형 클릭 및 드래그 처리
    const clickedRectIndex = currentRects.findIndex(
      (rect) =>
        e.nativeEvent.offsetX >= rect.x &&
        e.nativeEvent.offsetX <= rect.x + rect.width &&
        e.nativeEvent.offsetY >= rect.y &&
        e.nativeEvent.offsetY <= rect.y + rect.height
    );

    // 원 클릭 및 드래그 처리
    const clickedCircleIndex = currentCircles.findIndex((circle) => {
      const dx = e.nativeEvent.offsetX - circle.cx;
      const dy = e.nativeEvent.offsetY - circle.cy;
      const distance = Math.sqrt(dx * dx + dy * dy);
      return distance <= circle.r; // 원의 반지름 내에 있는지 확인
    });

    // 사각형 드래그
    if (clickedRectIndex !== -1) {
      setIsDragging(true);
      setDraggingIndex(clickedRectIndex);
      setOffset({
        x: e.nativeEvent.offsetX - currentRects[clickedRectIndex].x,
        y: e.nativeEvent.offsetY - currentRects[clickedRectIndex].y,
      });
      setSelectedShapeId(clickedRectIndex);
    }
    // 원 드래그
    else if (clickedCircleIndex !== -1) {
      setIsDragging(true);
      setDraggingIndex(clickedCircleIndex);
      setOffset({
        x: e.nativeEvent.offsetX - currentCircles[clickedCircleIndex].cx,
        y: e.nativeEvent.offsetY - currentCircles[clickedCircleIndex].cy,
      });
      setSelectedShapeId(clickedCircleIndex);
    }
    // 사각형 그리기 시작
    else if (shapeMode.rectangle) {
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
      setSelectedShapeId(null);
    }
    // 원 그리기 시작
    else if (shapeMode.circle) {
      setIsDrawing(true);
      const startX = e.nativeEvent.offsetX;
      const startY = e.nativeEvent.offsetY;

      setCurrentCircle({
        cx: startX,
        cy: startY,
        r: 0,
        property: property,
      });
      setSelectedShapeId(null);
    }
  };

  // 마우스가 움직일 때 사각형 또는 원을 그리거나 드래그 상태에 따라 이동
  const handleMouseMoveRec = (e) => {
    if (isDrawing && currentRect) {
      // 사각형 그리기
      const newX = e.nativeEvent.offsetX;
      const newY = e.nativeEvent.offsetY;
      const newWidth = newX - currentRect.startX;
      const newHeight = newY - currentRect.startY;

      setCurrentRect({
        ...currentRect,
        x: newWidth < 0 ? newX : currentRect.startX, // x 좌표 보정
        y: newHeight < 0 ? newY : currentRect.startY, // y 좌표 보정
        width: Math.abs(newWidth), // 절대값으로 width 계산
        height: Math.abs(newHeight), // 절대값으로 height 계산
      });
    } else if (isDrawing && currentCircle) {
      // 원 그리기
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

    // 사각형 드래그
    if (isDragging && draggingIndex !== null && shapeMode.rectangle) {
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
      setSelectedShapeId(null);
    }

    // 원 드래그
    if (isDragging && draggingIndex !== null && shapeMode.circle) {
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
      setSelectedShapeId(null);
    }
  };

  // 마우스를 놓을 때 사각형 또는 원 그리기나 드래그를 완료하고 상태를 초기화
  const handleMouseUpRec = () => {
    if (isDrawing && currentRect) {
      // 사각형 그리기 완료 후 추가
      setCurrentRects((prevRects) => [...prevRects, currentRect]);
      setCurrentRect(null); // currentRect 초기화
      setIsDrawing(false); // 그리기 상태 초기화
    }

    if (isDrawing && currentCircle) {
      // 원 그리기 완료 후 추가
      setCurrentCircles((prevCircles) => [...prevCircles, currentCircle]);
      setCurrentCircle(null); // currentCircle 초기화
      setIsDrawing(false); // 그리기 상태 초기화
    }

    if (isDragging) {
      setIsDragging(false); // 드래그 상태 초기화
      setDraggingIndex(null); // 드래그 인덱스 초기화
    }

    setRectangles(currentRects); // 사각형 상태 업데이트
    setCircles(currentCircles); // 원 상태 업데이트
  };

  const handleDelete = () => {
    if (selectedShapeId !== null) {
      const updatedRects = currentRects.filter(
        (_, index) => index !== selectedShapeId
      );
      const updatedCircles = currentCircles.filter(
        (_, index) => index !== selectedShapeId
      );

      setCurrentRects(updatedRects);
      setCurrentCircles(updatedCircles);

      setRectangles(updatedRects);
      setCircles(updatedCircles);

      setSelectedShapeId(null);
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
            width={rect.width}
            height={rect.height}
            fill={rect.property.fill ? rect.property.fillColor : "none"}
            stroke={rect.property.stroke ? rect.property.strokeColor : "none"}
            strokeWidth={rect.property.stroke ? rect.property.strokeWidth : 0}
            className="rectangle"
            onClick={() => setSelectedShapeId(index)}
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
            className="circle"
            onClick={() => setSelectedShapeId(index)}
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
      {selectedShapeId !== null && (
        <St.ButtonContainer
          $top={
            currentRects[selectedShapeId]?.y ||
            currentCircles[selectedShapeId]?.cy ||
            0
          }
          $left={
            (currentRects[selectedShapeId]?.x ||
              currentCircles[selectedShapeId]?.cx ||
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
