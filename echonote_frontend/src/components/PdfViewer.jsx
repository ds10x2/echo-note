import { useRef } from "react";
import PdfCanvas from "@components/PdfCanvas";
import * as St from "@components/styles/PdfViewer.style";
import PropertyEditor from "@/components/TmpShapeProperty";

const PdfViewer = ({ isDrawingEditorOpened, savedImage }) => {
  const containerRef = useRef();

  return (
    <St.PdfContainer ref={containerRef}>
      <St.ButtonContainer>
        <PropertyEditor />
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
