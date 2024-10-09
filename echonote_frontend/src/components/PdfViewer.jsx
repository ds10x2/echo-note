import { useRef } from "react";
import PdfCanvas from "@components/PdfCanvas";
import * as St from "@components/styles/PdfViewer.style";
import ShapeTextToolBar from "@components/ShapeTextToolBar";
import drawingTypeStore from "@/stores/drawingTypeStore";

const PdfViewer = ({ isDrawingEditorOpened }) => {
  const containerRef = useRef();

  return (
    <St.PdfContainer ref={containerRef}>
      <St.ButtonContainer>
        <ShapeTextToolBar />
      </St.ButtonContainer>
      <PdfCanvas
        containerRef={containerRef}
        isDrawingEditorOpened={isDrawingEditorOpened}
      />
    </St.PdfContainer>
  );
};

export default PdfViewer;
