import React, { useState, useEffect, useRef, useCallback } from "react";
import * as St from "./styles/PdfViewer.style";
import * as pdfjsLib from "pdfjs-dist";
import PdfEditor from "@components/PdfEditor";
import { useTextDragging } from "@/hooks/useTextDragging";
import { useTextEdit } from "@/hooks/useTextEdit";

const PdfViewer = ({ url }) => {
  const canvasRef = useRef();
  const containerRef = useRef();
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.6.82/pdf.worker.min.mjs`;

  const [pdfRef, setPdfRef] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [scale, setScale] = useState(0.8);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
  const renderTaskRef = useRef(null);

  const {
    textItems,
    addTextItem,
    updateTextItem,
    finishEditing,
    setTextItems,
  } = useTextEdit();
  const { handleMouseDown, handleTouchStart, handleMouseMove, handleMouseUp } =
    useTextDragging(textItems, setTextItems); // useDragging 적용

  const sampleUrl =
    "https://www.antennahouse.com/hubfs/xsl-fo-sample/pdf/basic-link-1.pdf";

  const renderPage = useCallback(
    (pageNum, pdf = pdfRef) => {
      if (pdf) {
        pdf.getPage(pageNum).then((page) => {
          const viewport = page.getViewport({ scale: 1 });
          const canvas = canvasRef.current;
          canvas.height = viewport.height;
          canvas.width = viewport.width;

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
    [pdfRef]
  );

  useEffect(() => {
    renderPage(currentPage, pdfRef);
  }, [pdfRef, currentPage]);

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

  const nextPage = () =>
    pdfRef && currentPage < pdfRef.numPages && setCurrentPage(currentPage + 1);
  const prevPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);
  const zoomIn = () => setScale((prevScale) => Math.min(10, prevScale + 0.2));
  const zoomOut = () => setScale((prevScale) => Math.max(0.5, prevScale - 0.2));

  return (
    <St.PdfContainer ref={containerRef}>
      <St.ButtonContainer>
        <button onClick={zoomIn}>확대</button>
        <button onClick={zoomOut}>축소</button>
        <button onClick={prevPage}>이전 페이지</button>
        <button onClick={nextPage}>다음 페이지</button>
      </St.ButtonContainer>
      <St.PdfPage scale={scale}>
        <canvas ref={canvasRef}></canvas>
        <PdfEditor containerRef={containerRef} />
      </St.PdfPage>
    </St.PdfContainer>
  );
};

export default PdfViewer;
