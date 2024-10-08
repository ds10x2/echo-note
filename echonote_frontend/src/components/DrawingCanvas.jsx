import React, { forwardRef, useEffect, useRef } from "react";
import { ReactSketchCanvas } from "react-sketch-canvas";
import * as St from "@components/styles/DrawingEditor.style";
import canvasStore from "@stores/canvasStore";

const DrawingCanvas = forwardRef(
  (
    { strokeWidth, eraserWidth, strokeColor, eraseMode, readOnly, scale, page },
    ref
  ) => {
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

      ref.current.eraseMode(eraseMode);
    }, [eraseMode, scale, page]);

    const handleEndStroke = () => {
      const { setCanvasPath } = canvasStore.getState();

      if (ref.current) {
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
    };

    return (
      <St.DrawingCanvasContainer>
        <div
          style={{
            width: "100%",
            height: "100%",
            pointerEvents: readOnly ? "none" : "auto",
          }}
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
            onStroke={handleEndStroke}
          />
        </div>
      </St.DrawingCanvasContainer>
    );
  }
);

export default DrawingCanvas;
