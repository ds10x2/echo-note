import React, { forwardRef, useEffect } from "react";
import { ReactSketchCanvas } from "react-sketch-canvas";
import * as St from "@components/styles/DrawingEditor.style";
import canvasStore from "@stores/canvasStore";

const DrawingCanvas = forwardRef(({ strokeWidth, eraserWidth, strokeColor, eraseMode, onRefChange }, ref) => {
  useEffect(() => {
    const { getCanvasPath } = canvasStore.getState();
    const savedPaths = getCanvasPath();

    if (savedPaths && ref.current) {
      ref.current.loadPaths(savedPaths)
    }

    if (ref.current) {
      ref.current.eraseMode(eraseMode);
    }
  }, [eraseMode]);

  const handleCanvasChange = () => {
    const { setCanvasPath, setCanvasImage } = canvasStore.getState();
    
    if (onRefChange && ref.current) {
      // Path 저장
      ref.current
        .exportPaths()
        .then((data) => {
          setCanvasPath(data);
        })
        .catch((e) => {
          console.log("Error exporting paths:", e);
        });
      
      // Svg 저장
      if (ref.current) {
        ref.current.exportSvg()
          .then((data) => {
            console.log("SVG Exported Successfully", data);
      
            // base64로 인코딩 처리
            const svgDataUrl = "data:image/svg+xml;base64," + btoa(data);
            setCanvasImage(svgDataUrl);
          })
          .catch((error) => {
            console.error("Error exporting SVG:", error);
          });
      } else {
        console.log("Canvas reference is not ready.");
      }
        
    }
  };

  return (
    <St.DrawingCanvasContainer>
      <ReactSketchCanvas
        ref={ref}
        strokeColor={strokeColor || "#000"}
        strokeWidth={strokeWidth || 5}
        eraserWidth={eraserWidth || 5}
        width="100%"
        height="100%"
        canvasColor="transparent"
        onChange={handleCanvasChange}
      />
    </St.DrawingCanvasContainer>
  );
});

export default DrawingCanvas;
