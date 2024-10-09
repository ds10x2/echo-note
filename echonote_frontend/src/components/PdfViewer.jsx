import { useRef, useEffect, useState } from "react";
import PdfCanvas from "@components/PdfCanvas";
import * as St from "@components/styles/PdfViewer.style";
import ShapeTextToolBar from "@components/ShapeTextToolBar";

const PdfViewer = ({ isDrawingEditorOpened }) => {
  const containerRef = useRef();
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const container = containerRef.current;
        // 스크롤을 조정하는 대신 transform-origin: top center로 수정된 PDF가 중앙에 오게
        container.scrollLeft =
          (container.scrollWidth - container.clientWidth) / 2;
      }
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [canvasSize]);

  const handleCanvasResize = (width, height) => {
    setCanvasSize({ width, height });
  };

  return (
    <St.PdfContainer ref={containerRef}>
      <St.ButtonContainer>
        <ShapeTextToolBar />
      </St.ButtonContainer>
      <PdfCanvas
        containerRef={containerRef}
        isDrawingEditorOpened={isDrawingEditorOpened}
        onResize={handleCanvasResize}
      />
    </St.PdfContainer>
  );
};

export default PdfViewer;
