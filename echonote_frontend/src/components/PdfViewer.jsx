import React, { useState, useEffect, useRef, useCallback } from "react";
import * as St from "./styles/PdfViewer.style";
import * as pdfjsLib from "pdfjs-dist";
import { useSwipe } from "@/hooks/useSwipe";
import { usePinchZoom } from "@/hooks/usePinchZoom";
import PdfEditor from "@components/PdfEditor";

const PdfViewer = ({ url }) => {
  const canvasRef = useRef();
  const containerRef = useRef();
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.6.82/pdf.worker.min.mjs`;

  const [pdfRef, setPdfRef] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [scale, setScale] = useState(1); // 초기 스케일 값
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 }); // 캔버스 크기 상태
  const renderTaskRef = useRef(null);
  const sampleUrl =
    "https://www.antennahouse.com/hubfs/xsl-fo-sample/pdf/basic-link-1.pdf";

  // PDF 렌더링
  const renderPage = useCallback(
    (pageNum, pdf = pdfRef) => {
      if (pdf) {
        pdf.getPage(pageNum).then(function (page) {
          const viewport = page.getViewport({ scale });
          const canvas = canvasRef.current;
          canvas.height = viewport.height;
          canvas.width = viewport.width;

          // PDF 캔버스의 크기를 상태에 저장
          setCanvasSize({ width: viewport.width, height: viewport.height });

          const renderContext = {
            canvasContext: canvas.getContext("2d"),
            viewport: viewport,
          };

          if (renderTaskRef.current) {
            renderTaskRef.current.cancel();
          }

          renderTaskRef.current = page.render(renderContext);

          renderTaskRef.current.promise
            .then(() => {
              renderTaskRef.current = null;
            })
            .catch((err) => {
              if (err.name !== "RenderingCancelledException") {
                console.error(err);
              }
            });
        });
      }
    },
    [pdfRef, scale]
  );

  useEffect(() => {
    renderPage(currentPage, pdfRef);
  }, [pdfRef, currentPage, scale]);

  //URL 설정
  useEffect(() => {
    const loadingTask = pdfjsLib.getDocument(sampleUrl);
    loadingTask.promise.then(
      (loadedPdf) => {
        setPdfRef(loadedPdf);
      },
      (err) => {
        console.error(err);
      }
    );
  }, [url]);

  // usePinchZoom 훅 사용
  const isPinching = usePinchZoom(containerRef, setScale);

  // 페이지 이동
  const nextPage = () => {
    pdfRef && currentPage < pdfRef.numPages && setCurrentPage(currentPage + 1);
  };
  const prevPage = () => {
    currentPage > 1 && setCurrentPage(currentPage - 1);
  };

  // useSwipe 훅 사용 - 스와이프 동작으로 페이지 이동
  useSwipe(isPinching, containerRef, prevPage, nextPage);

  return (
    <St.PdfContainer ref={containerRef}>
      <St.PdfPage>
        <canvas ref={canvasRef}></canvas>
        <PdfEditor canvasSize={canvasSize} />
      </St.PdfPage>
    </St.PdfContainer>
  );
};

export default PdfViewer;
