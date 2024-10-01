import React, { useState, useEffect, useRef, useCallback } from "react";
import * as St from "./styles/PdfCanvas.style";
import * as pdfjsLib from "pdfjs-dist";
import PdfEditor from "@components/PdfEditor";
import pageStore from "@/stores/pageStore"; // zustand 스토어 가져오기

const PdfCanvas = ({ getPages, url, scale, containerRef }) => {
  const canvasRef = useRef();
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.6.82/pdf.worker.min.mjs`;

  const [pdfRef, setPdfRef] = useState(null);
  const { currentPage } = pageStore();
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
  const renderTaskRef = useRef(null);

  const sampleUrl =
    "https://www.antennahouse.com/hubfs/xsl-fo-sample/pdf/basic-link-1.pdf";

  const renderPage = useCallback(
    (pageNum, pdf = pdfRef) => {
      if (pdf && containerRef.current) {
        // containerRef.current가 존재하는지 확인
        pdf.getPage(pageNum).then((page) => {
          const containerWidth = containerRef.current.clientWidth;
          const containerHeight = containerRef.current.clientHeight;

          const viewport = page.getViewport({ scale: 1 });
          // 화면 비율에 맞게 PDF를 스케일링
          const widthScale = (containerWidth / viewport.width) * 0.9;
          const heightScale = (containerHeight / viewport.height) * 0.9;
          const scaleFactor = Math.min(widthScale, heightScale); // 화면에 맞추기 위해 더 작은 스케일 사용

          console.log(widthScale, " ", heightScale);
          console.log(scaleFactor);

          const scaledViewport = page.getViewport({ scale: scaleFactor });

          const canvas = canvasRef.current;
          canvas.height = scaledViewport.height;
          canvas.width = scaledViewport.width;

          setCanvasSize({
            width: scaledViewport.width,
            height: scaledViewport.height,
          });

          const renderContext = {
            canvasContext: canvas.getContext("2d"),
            viewport: scaledViewport,
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
    [pdfRef]
  );

  // currentPage가 바뀔 때마다 페이지를 렌더링
  useEffect(() => {
    renderPage(currentPage, pdfRef);
  }, [currentPage, pdfRef]);

  useEffect(() => {
    if (pdfRef) getPages(pdfRef.numPages);
  }, [pdfRef]);

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

  return (
    <St.PdfCanvasContainer
      width={canvasSize.width}
      height={canvasSize.height}
      scale={scale}
    >
      <canvas ref={canvasRef}></canvas>
      <PdfEditor
        scale={scale}
        currentPage={currentPage}
        containerRef={containerRef}
      />
    </St.PdfCanvasContainer>
  );
};

export default PdfCanvas;
