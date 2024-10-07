import React, { forwardRef, useEffect } from "react";
import { ReactSketchCanvas } from "react-sketch-canvas";
import * as St from "@components/styles/DrawingEditor.style";
import canvasStore from "@stores/canvasStore";

const DrawingCanvas = forwardRef(
  (
    { strokeWidth, eraserWidth, strokeColor, eraseMode, readOnly, scale },
    ref
  ) => {
    useEffect(() => {
      const { getCanvasPath } = canvasStore.getState();
      const savedPaths = getCanvasPath();

      if (ref.current) {
        ref.current.clearCanvas();
        if (savedPaths) {
          const scaledPaths = savedPaths.map((path) => ({
            ...path,
            paths: path.paths.map((point) => ({
              x: point.x * scale,
              y: point.y * scale,
            })),
          }));

          ref.current.loadPaths(scaledPaths);
        }
        ref.current.eraseMode(eraseMode);
      }
    }, [eraseMode, scale]);

    const handleCanvasChange = () => {
      const { setCanvasPath, setCanvasImage } = canvasStore.getState();

      if (ref.current) {
        // Path 저장
        ref.current
          .exportPaths()
          .then((data) => {
            const unscaledPaths = data.map((path) => ({
              ...path,
              paths: path.paths.map((point) => ({
                x: point.x / scale,
                y: point.y / scale,
              })),
            }));

            setCanvasPath(unscaledPaths);
          })
          .catch((e) => {
            console.log("Error exporting paths:", e);
          });

        // Svg 저장
        ref.current
          .exportSvg()
          .then((data) => {
            const svgDataUrl = "data:image/svg+xml;base64," + btoa(data);
            setCanvasImage(svgDataUrl);
          })
          .catch((error) => {
            console.error("Error exporting SVG:", error);
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
            onChange={handleCanvasChange}
            readOnly={readOnly}
            style={{ border: 0, borderRadius: 0 }}
          />
        </div>
      </St.DrawingCanvasContainer>
    );
  }
);

export default DrawingCanvas;
