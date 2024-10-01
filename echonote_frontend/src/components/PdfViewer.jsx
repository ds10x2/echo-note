import { useEffect, useState } from "react";
import PdfCanvas from "@components/PdfCanvas";
import * as St from "@components/styles/PdfViewer.style";
import pageStore from "@/stores/pageStore"; // pageStore를 가져옵니다
import drawingTypeStore from "@/stores/drawingTypeStore";

const PdfViewer = ({}) => {
  const [pages, setPages] = useState(1); //PDF 최대 페이지 수
  const [scale, setScale] = useState(1);

  const { setShapeMode, mode } = drawingTypeStore();
  const { currentPage, setCurrentPage } = pageStore(); // zustand에서 currentPage와 setCurrentPage를 가져옵니다

  //페이지 이동
  const nextPage = () => currentPage < pages && setCurrentPage(currentPage + 1);
  const prevPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);

  //줌인줌아웃
  const zoomIn = () => scale < 7 && setScale(scale + 0.5);
  const zoomOut = () => scale > 0.5 && setScale(scale - 0.5);

  return (
    <St.PdfContainer>
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
        </div>
      </St.ButtonContainer>
      <PdfCanvas getPages={setPages} page={currentPage} scale={scale} />
    </St.PdfContainer>
  );
};

export default PdfViewer;
