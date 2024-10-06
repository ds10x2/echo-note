import { useEffect, useRef, useState } from "react";
import PdfCanvas from "@components/PdfCanvas";
import * as St from "@components/styles/PdfViewer.style";
import drawingTypeStore from "@/stores/drawingTypeStore";
import PropertyEditor from "@/components/TmpShapeProperty";

const PdfViewer = ({}) => {
  const containerRef = useRef();
  const [scale, setScale] = useState(1);
  const oldScaleRef = useRef(scale); // 이전 스케일 값을 저장할 useRef

  const { setCircleMode, shapeMode, setRectangleMode } = drawingTypeStore();

  // 줌인 줌아웃
  const zoomIn = () => scale < 7 && setScale((prev) => prev + 0.5);
  const zoomOut = () => scale > 0.5 && setScale((prev) => prev - 0.5);

  useEffect(() => {
    const adjustScrollToCenter = () => {
      if (containerRef.current) {
        const container = containerRef.current;
        const rect = container.getBoundingClientRect();

        // 이전 및 현재 스케일
        const oldScale = oldScaleRef.current;
        const scaleRatio = scale / oldScale;

        // 현재 스크롤 위치
        const scrollLeft = container.scrollLeft;
        const scrollTop = container.scrollTop;

        // 중앙을 기준으로 스크롤 위치 조정
        const centerX = scrollLeft + rect.width / 2;
        const centerY = scrollTop + rect.height / 2;

        const newScrollLeft = centerX * scaleRatio - rect.width / 2;
        const newScrollTop = centerY * scaleRatio - rect.height / 2;

        container.scrollLeft = newScrollLeft;
        container.scrollTop = newScrollTop;

        // oldScale을 업데이트
        oldScaleRef.current = scale;
      }
    };

    adjustScrollToCenter();
  }, [scale]);

  return (
    <St.PdfContainer ref={containerRef}>
      <St.ButtonContainer>
        <div>
          <button onClick={zoomIn}>확대</button>
          <button onClick={zoomOut}>축소</button>
        </div>
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
      <PdfCanvas scale={scale} containerRef={containerRef} />
    </St.PdfContainer>
  );
};

export default PdfViewer;
