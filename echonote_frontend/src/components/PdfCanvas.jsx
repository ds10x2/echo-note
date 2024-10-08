import React, { useState, useEffect, useRef, useCallback } from "react";
import * as St from "./styles/PdfCanvas.style";
import * as pdfjsLib from "pdfjs-dist";
import PdfEditor from "@components/PdfEditor";
import pageStore from "@/stores/pageStore"; // zustand 스토어 가져오기
import DrawingEditor from "@components/DrawingEditor";
import { DrawingEditorContainer } from "@components/styles/DrawingEditor.style";
import canvasStore from "@stores/canvasStore";

const PdfCanvas = ({ url, containerRef, isDrawingEditorOpened }) => {
  const canvasRef = useRef();
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.6.82/pdf.worker.min.mjs`;

  const [pdfRef, setPdfRef] = useState(null);
  const { currentPage, setPages, scale } = pageStore(); // zustand의 상태와 액션 가져오기
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
  const [originalSize, setOriginalSize] = useState({ width: 0, height: 0 });
  const renderTaskRef = useRef(null);

  const { getCanvasImage } = canvasStore.getState(); // 이미지 데이터를 가져오는 함수 호출
  const savedImage = getCanvasImage(currentPage);

  const sampleUrl =
    "https://www.antennahouse.com/hubfs/xsl-fo-sample/pdf/basic-link-1.pdf";

  const renderPage = useCallback(
    (pageNum, pdf = pdfRef) => {
      if (pdf && containerRef.current) {
        pdf.getPage(pageNum).then((page) => {
          const containerWidth = containerRef.current.clientWidth;
          const containerHeight = containerRef.current.clientHeight;

          const viewport = page.getViewport({ scale: 1 });
          const widthScale = (containerWidth / viewport.width) * 0.9;
          const heightScale = (containerHeight / viewport.height) * 0.9;
          const scaleFactor = Math.min(widthScale, heightScale);

          const scaledViewport = page.getViewport({
            scale: scaleFactor * scale,
          });

          const canvas = canvasRef.current;
          canvas.height = scaledViewport.height;
          canvas.width = scaledViewport.width;

          setCanvasSize({
            width: scaledViewport.width,
            height: scaledViewport.height,
          });

          setOriginalSize({
            width: scaledViewport.width / scale,
            height: scaledViewport.height / scale,
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
    [pdfRef, scale, containerRef]
  );

  // currentPage, scale이 바뀔 때마다 페이지 렌더링
  useEffect(() => {
    renderPage(currentPage, pdfRef);
  }, [currentPage, pdfRef, scale, renderPage]);

  // PDF 로드 후 페이지 설정
  useEffect(() => {
    if (pdfRef) setPages(pdfRef.numPages);
  }, [pdfRef, setPages]);

  // PDF 문서를 로드
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
    <St.PdfCanvasContainer width={canvasSize.width} height={canvasSize.height}>
      <canvas ref={canvasRef}></canvas>
      <PdfEditor
        scale={scale}
        originalSize={originalSize}
        currentPage={currentPage}
        containerRef={containerRef}
        isDrawingEditorOpened={isDrawingEditorOpened}
      />
      {isDrawingEditorOpened ? (
        <DrawingEditor scale={scale} page={currentPage} />
      ) : (
        <DrawingEditorContainer>
          {savedImage && <img src={savedImage} alt="Saved Canvas" />}
        </DrawingEditorContainer>
      )}
    </St.PdfCanvasContainer>
  );
};

export default PdfCanvas;
