import React, { forwardRef, useCallback, useEffect, useRef } from "react";
import { ReactSketchCanvas } from "react-sketch-canvas";
import * as St from "@components/styles/DrawingEditor.style";
import canvasStore from "@stores/canvasStore";

const DrawingCanvas = forwardRef(
  (
    { strokeWidth, eraserWidth, strokeColor, eraseMode, readOnly, scale, page },
    ref
  ) => {
    const containerRef = useRef();

    useEffect(() => {
      const { getCanvasPath } = canvasStore.getState();
      const savedPaths = getCanvasPath(page);

      if (!ref.current) return;

      ref.current.clearCanvas();
      if (savedPaths && savedPaths.length > 0) {
        const scaledPaths = savedPaths.map((path) => ({
          ...path,
          strokeWidth: path.strokeWidth * scale,
          paths: path.paths.map((point) => ({
            x: point.x * scale,
            y: point.y * scale,
          })),
        }));

        ref.current.loadPaths(scaledPaths);
      }
      console.log(canvasStore.getState().getCanvasPath(page));
      ref.current.eraseMode(eraseMode);
    }, [eraseMode, scale, page]);

    const getRelativePosition = useCallback(
      (e) => {
        if (containerRef.current) {
          const clientX = e.changedTouches[0].clientX;
          const clientY = e.changedTouches[0].clientY;

          const containerRect = containerRef.current.getBoundingClientRect();

          const x = (clientX - containerRect.left) / scale;
          const y = (clientY - containerRect.top) / scale;

          return { x, y };
        }
        return { x: 0, y: 0 };
      },
      [scale]
    );

    const handleEndStroke = (event) => {
      const { setCanvasPath } = canvasStore.getState();

      if (ref.current) {
        if (event.changedTouches && event.changedTouches[0]) {
          const relativePos = getRelativePosition(event);
          console.log("Converted PDF coordinates:", relativePos);
        }

        // Path 저장
        ref.current
          .exportPaths()
          .then((data) => {
            if (data.length === 0) {
              return;
            }

            const unscaledPaths = data.map((path) => ({
              ...path,
              strokeWidth: path.strokeWidth / scale,
              paths: path.paths.map((point) => ({
                x: point.x / scale,
                y: point.y / scale,
              })),
            }));

            setCanvasPath(page, unscaledPaths);
          })
          .catch((e) => {
            console.log("Error exporting paths:", e);
          });
      }
      console.log(canvasStore.getState().getCanvasPath(page));
    };

    return (
      <St.DrawingCanvasContainer ref={containerRef}>
        <div
          style={{
            width: "100%",
            height: "100%",
            pointerEvents: readOnly ? "none" : "auto",
          }}
          onTouchEnd={handleEndStroke}
        >
          <ReactSketchCanvas
            ref={ref}
            strokeColor={strokeColor || "#000"}
            strokeWidth={strokeWidth || 5}
            eraserWidth={eraserWidth || 5}
            width="100%"
            height="100%"
            canvasColor="transparent"
            readOnly={readOnly}
            style={{ border: 0, borderRadius: 0 }}
          />
        </div>
      </St.DrawingCanvasContainer>
    );
  }
);

export default DrawingCanvas;
