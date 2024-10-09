import React, {
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { ReactSketchCanvas } from "react-sketch-canvas";
import * as St from "@components/styles/DrawingEditor.style";
import canvasStore from "@stores/canvasStore";

const DrawingCanvas = forwardRef(
  (
    {
      strokeWidth,
      eraserWidth,
      strokeColor,
      eraseMode,
      readOnly,
      scale,
      page,
      lassoMode,
    },
    ref
  ) => {
    const containerRef = useRef();
    const [selectionPath, setSelectionPath] = useState([]);
    const { getCanvasPath, setCanvasPath } = canvasStore.getState();

    const loadCanvasPath = () => {
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
    };

    useEffect(() => {
      loadCanvasPath();
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

    const handleTouchStart = (event) => {
      if (lassoMode) {
        const pos = getRelativePosition(event);
        setSelectionPath([pos]);
      }
    };

    const handleTouchMove = (event) => {
      if (lassoMode && selectionPath.length > 0) {
        const pos = getRelativePosition(event);
        setSelectionPath((prevPath) => [...prevPath, pos]);
      }
    };

    const handleTouchEnd = (event) => {
      if (lassoMode && selectionPath.length > 0) {
        checkIntersections(selectionPath);
        setSelectionPath([]);
        loadCanvasPath();
      } else {
        saveCanvasPath();
      }
    };

    // 다각형 내부에 점이 포함되는지 확인하는 함수
    const pointInPolygon = (point, polygon) => {
      let isInside = false;
      const { x, y } = point;

      const closedPolygon = [...polygon, polygon[0]]; // 다각형을 닫음

      for (
        let i = 0, j = closedPolygon.length - 1;
        i < closedPolygon.length;
        j = i++
      ) {
        const xi = closedPolygon[i].x,
          yi = closedPolygon[i].y;
        const xj = closedPolygon[j].x,
          yj = closedPolygon[j].y;

        const intersect =
          yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;

        if (intersect) isInside = !isInside;
      }

      return isInside;
    };

    const checkIntersections = (polygon) => {
      const savedPaths = getCanvasPath(page);
      const selectedStrokes = savedPaths.filter((stroke) =>
        stroke.paths.some((point) => pointInPolygon(point, polygon))
      );
    };

    const saveCanvasPath = (event) => {
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
      <St.DrawingCanvasContainer ref={containerRef}>
        <div
          style={{
            width: "100%",
            height: "100%",
            pointerEvents: readOnly ? "none" : "auto",
          }}
          onTouchStart={lassoMode ? handleTouchStart : null}
          onTouchMove={lassoMode ? handleTouchMove : null}
          onTouchEnd={handleTouchEnd}
        >
          <ReactSketchCanvas
            ref={ref}
            strokeColor={lassoMode ? "#e0e0e04e" : strokeColor || "#000"}
            strokeWidth={lassoMode ? 3 : strokeWidth || 5}
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
