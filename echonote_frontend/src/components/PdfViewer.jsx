import { useEffect, useState } from "react";
import PdfCanvas from "@components/PdfCanvas";

const PdfViewer = ({}) => {
  const [pages, setPages] = useState(1);
  const [curPage, setCurPage] = useState(1);
  const [url, setUrl] = useState("");

  //페이지 이동
  const nextPage = () => curPage < pages && setCurPage(curPage + 1);
  const prevPage = () => curPage > 1 && setCurPage(curPage - 1);

  return (
    <>
      <div>
        <button onClick={nextPage}>다음 페이지</button>
        <button onClick={prevPage}>이전 페이지</button>
      </div>
      <PdfCanvas getPages={setPages} page={curPage} url={url} />
    </>
  );
};

export default PdfViewer;
