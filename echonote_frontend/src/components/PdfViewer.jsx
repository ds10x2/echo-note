import { useEffect, useRef, useState } from "react";
import PdfCanvas from "@components/PdfCanvas";
import * as St from "@components/styles/PdfViewer.style";
import pageStore from "@/stores/pageStore";
import drawingTypeStore from "@/stores/drawingTypeStore";

const PdfViewer = ({}) => {
  const containerRef = useRef();
  const [pages, setPages] = useState(1); // PDF 최대 페이지 수
  const [scale, setScale] = useState(1);
  const oldScaleRef = useRef(scale); // 이전 스케일 값을 저장할 useRef

  const { setShapeMode, setTextMode, mode } = drawingTypeStore();
  const { currentPage, setCurrentPage } = pageStore();

  // 페이지 이동
  const nextPage = () => currentPage < pages && setCurrentPage(currentPage + 1);
  const prevPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);

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
          <button onClick={nextPage}>다음 페이지</button>
          <button onClick={prevPage}>이전 페이지</button>
        </div>
        <div>
          <button onClick={zoomIn}>확대</button>
          <button onClick={zoomOut}>축소</button>
        </div>
        <div>
          <button onClick={() => setShapeMode()}>
            {mode.shape ? "사각형모드on" : "사각형모드off"}
          </button>
          <button onClick={() => setTextMode()}>
            {mode.text ? "Text Mode On" : "Text Mode Off"}
          </button>
        </div>
      </St.ButtonContainer>
      <PdfCanvas
        getPages={setPages}
        page={currentPage}
        scale={scale}
        containerRef={containerRef}
      />
    </St.PdfContainer>
  );
};

export default PdfViewer;
