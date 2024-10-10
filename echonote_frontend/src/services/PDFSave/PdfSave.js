import { PDFDocument, rgb } from "pdf-lib";
import * as fontkit from "fontkit";
import textStore from "@stores/textStore";
import shapeStore from "@stores/shapeStore";
import pageStore from "@stores/pageStore";
import canvasStore from "@stores/canvasStore";
import fontUrl from "@fonts/SUIT-Medium.ttf"; // 한글 TTF 폰트 경로

// 헥사코드를 RGB로 변환하는 함수
const hexToRGB = (hex) => {
  const parsedHex = hex.replace("#", "");
  const r = parseInt(parsedHex.substring(0, 2), 16);
  const g = parseInt(parsedHex.substring(2, 4), 16);
  const b = parseInt(parsedHex.substring(4, 6), 16);
  return rgb(r / 255, g / 255, b / 255);
};

export const exportPdfWithTextAndShapes = async () => {
  try {
    const pdfUrl = pageStore.getState().url;
    const existingPdfBytes = await fetch(pdfUrl).then((res) =>
      res.arrayBuffer()
    );
    const pdfDoc = await PDFDocument.load(existingPdfBytes);

    pdfDoc.registerFontkit(fontkit);
    const fontBytes = await fetch(fontUrl).then((res) => res.arrayBuffer());
    const customFont = await pdfDoc.embedFont(fontBytes);

    const pages = pdfDoc.getPages();
    const currentPage = pageStore.getState().currentPage - 1;
    const page = pages[currentPage];

    const totalPages = pages.length; // 전체 페이지 수 가져오기

    const textItems = textStore.getState().getCurrentPageItems();
    const rectangles = shapeStore.getState().getRectangles();
    const circles = shapeStore.getState().getCircles();

    const scale = pageStore.getState().scale;
    const originSize = pageStore.getState().originSize; // 원본 크기 가져오기

    const pdfWidth = page.getWidth(); // PDF 페이지의 실제 너비
    const pdfHeight = page.getHeight(); // PDF 페이지의 실제 높이

    // 원본 크기와 PDF 크기 비교
    const widthRatio = pdfWidth / originSize.width;
    const heightRatio = pdfHeight / originSize.height;

    // 텍스트 아이템을 PDF 페이지에 추가
    textItems.forEach((item) => {
      const { x, y, text } = item.detail;
      page.drawText(text, {
        x: (x / scale) * widthRatio, // 비율에 맞게 위치 조정
        y: ((originSize.height - y) / scale) * heightRatio, // y좌표 변환 (PDF 좌표계 고려)
        size: (12 / scale) * Math.min(widthRatio, heightRatio), // 텍스트 크기 조정
        font: customFont,
        color: rgb(0, 0, 0),
      });
    });

    // 사각형을 PDF 페이지에 추가
    rectangles.forEach((rect) => {
      const { x, y, width, height, property } = rect.detail;
      const strokeColor = hexToRGB(property.strokeColor);
      const fillColor = property.fill
        ? hexToRGB(property.fillColor)
        : undefined;

      const borderWidth = property.stroke
        ? (Number(property.strokeWidth) / scale) *
          Math.min(widthRatio, heightRatio)
        : 0;

      page.drawRectangle({
        x: (x / scale) * widthRatio,
        y: ((originSize.height - y - height) / scale) * heightRatio, // y좌표 변환
        width: (width / scale) * widthRatio, // width 보정
        height: (height / scale) * heightRatio, // height 보정
        borderWidth: borderWidth,
        borderColor: strokeColor,
        color: fillColor,
      });
    });

    // 원을 PDF 페이지에 추가
    circles.forEach((circle) => {
      const { cx, cy, r, property } = circle.detail;
      const strokeColor = hexToRGB(property.strokeColor);
      const fillColor = property.fill
        ? hexToRGB(property.fillColor)
        : undefined;

      const borderWidth = property.stroke
        ? (Number(property.strokeWidth) / scale) *
          Math.min(widthRatio, heightRatio)
        : 0;

      page.drawCircle({
        x: (cx / scale) * widthRatio,
        y: ((originSize.height - cy) / scale) * heightRatio, // y좌표 변환
        size: (r / scale) * Math.min(widthRatio, heightRatio), // 원 크기 보정
        borderWidth: borderWidth,
        borderColor: strokeColor,
        color: fillColor,
      });
    });

    for (let i = 0; i < totalPages; i++) {
      const page = pages[i];
      const drawings = canvasStore.getState().getCanvasPath(i + 1); // i번째 페이지의 그린 경로 가져오기

      const pdfWidth = page.getWidth(); // PDF 페이지의 실제 너비
      const pdfHeight = page.getHeight(); // PDF 페이지의 실제 높이

      // 원본 크기와 PDF 크기 비교
      const widthRatio = pdfWidth / originSize.width;
      const heightRatio = pdfHeight / originSize.height;

      // 그린 경로를 PDF에 추가
      if (drawings && drawings.length > 0) {
        drawings.forEach((path) => {
          // 각 점을 선으로 연결하여 경로 그리기
          for (let j = 0; j < path.paths.length - 1; j++) {
            const startX = (path.paths[j].x / scale) * widthRatio;
            const startY =
              ((originSize.height - path.paths[j].y) / scale) * heightRatio;
            const endX = (path.paths[j + 1].x / scale) * widthRatio;
            const endY =
              ((originSize.height - path.paths[j + 1].y) / scale) * heightRatio;

            // PDF에 선을 그리기
            page.drawLine({
              start: { x: startX, y: startY },
              end: { x: endX, y: endY },
              thickness:
                (path.strokeWidth / scale) * Math.min(widthRatio, heightRatio),
              color: hexToRGB(path.strokeColor),
            });
          }
        });
      }
    }

    // PDF 파일을 저장
    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: "application/pdf" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "modified_pdf_with_drawings_shapes_text.pdf";
    link.click();
  } catch (error) {
    console.error("Error exporting PDF:", error);
  }
};
