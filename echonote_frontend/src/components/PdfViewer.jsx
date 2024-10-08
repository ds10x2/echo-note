import { useRef } from "react";
import PdfCanvas from "@components/PdfCanvas";
import * as St from "@components/styles/PdfViewer.style";
import ShapeToolBar from "./ShapeToolBar";
import drawingTypeStore from "@/stores/drawingTypeStore";

const PdfViewer = ({ isDrawingEditorOpened, savedImage }) => {
  const containerRef = useRef();
  const { mode } = drawingTypeStore();

  return (
    <St.PdfContainer ref={containerRef}>
      <St.ButtonContainer>
        {mode.shape ? <ShapeToolBar /> : null}
      </St.ButtonContainer>
      <PdfCanvas
        containerRef={containerRef}
        isDrawingEditorOpened={isDrawingEditorOpened}
        savedImage={savedImage}
      />
    </St.PdfContainer>
  );
};

export default PdfViewer;
