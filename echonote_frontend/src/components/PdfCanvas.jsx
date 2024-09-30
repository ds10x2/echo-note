import React, { useState, useEffect, useRef, useCallback } from "react";
import * as St from "./styles/PdfCanvas.style";
import * as pdfjsLib from "pdfjs-dist";
import PdfEditor from "@components/PdfEditor";

const PdfCanvas = ({ getPages, url, page, scale }) => {
  const canvasRef = useRef();
  const containerRef = useRef();
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.6.82/pdf.worker.min.mjs`;

  const [pdfRef, setPdfRef] = useState(null);
  const [currentPage, setCurrentPage] = useState(page);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
  const renderTaskRef = useRef(null);

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
    setCurrentPage(page);
  }, [page]);

  //페이지 렌더링
  useEffect(() => {
    renderPage(currentPage, pdfRef);
  }, [currentPage]);

  useEffect(() => {
    renderPage(currentPage, pdfRef);
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
      <PdfEditor scale={1} />
    </St.PdfCanvasContainer>
  );
};

export default PdfCanvas;
