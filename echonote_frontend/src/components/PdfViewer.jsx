import { useEffect, useRef, useState } from "react";
import PdfCanvas from "@components/PdfCanvas";
import * as St from "@components/styles/PdfViewer.style";
import drawingTypeStore from "@/stores/drawingTypeStore";
import PropertyEditor from "@/components/TmpShapeProperty";

const PdfViewer = ({}) => {
  const containerRef = useRef();

  const { setCircleMode, shapeMode, setRectangleMode } = drawingTypeStore();

  return (
    <St.PdfContainer ref={containerRef}>
      <St.ButtonContainer>
        <div>
          <button onClick={() => setCircleMode()}>
            {shapeMode.circle ? "Circle mode on" : "off"}
          </button>
          <button onClick={() => setRectangleMode()}>
            {shapeMode.rectangle ? "rec mode on" : "off"}
          </button>
        </div>
        <PropertyEditor />
      </St.ButtonContainer>
      <PdfCanvas containerRef={containerRef} />
    </St.PdfContainer>
  );
};

export default PdfViewer;
