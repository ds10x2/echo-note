import { useEffect, useState } from "react";
import PdfCanvas from "@components/PdfCanvas";
import * as St from "@components/styles/PdfViewer.style";
import shapeStore from "@/stores/shapeStore";

const PdfViewer = ({}) => {
  const [pages, setPages] = useState(1);
  const [curPage, setCurPage] = useState(1);
  const [url, setUrl] = useState("");
  const [scale, setScale] = useState(1);

  const { isRecMode, setIsRecMode } = shapeStore();

  //페이지 이동
  const nextPage = () => curPage < pages && setCurPage(curPage + 1);
  const prevPage = () => curPage > 1 && setCurPage(curPage - 1);

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
          <button onClick={() => setIsRecMode(!isRecMode)}>
            {isRecMode ? "사각형모드on" : "사각형모드off"}
          </button>
        </div>
      </St.ButtonContainer>
      <PdfCanvas getPages={setPages} page={curPage} url={url} scale={scale} />
    </St.PdfContainer>
  );
};

export default PdfViewer;
