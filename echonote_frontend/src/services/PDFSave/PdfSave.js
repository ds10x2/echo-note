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

export const exportPdfWithTextAndShapes = async (pdf_path) => {
  try {
    const existingPdfBytes = await fetch(pdf_path).then((res) =>
      res.arrayBuffer()
    );
    const pdfDoc = await PDFDocument.load(existingPdfBytes);

    pdfDoc.registerFontkit(fontkit);
    const fontBytes = await fetch(fontUrl).then((res) => res.arrayBuffer());
    const customFont = await pdfDoc.embedFont(fontBytes);

    const pages = pdfDoc.getPages();
    const totalPages = pages.length; // 전체 페이지 수 가져오기
    const scale = pageStore.getState().scale;
    const originSize = pageStore.getState().originSize; // 원본 크기 가져오기

    for (let i = 0; i < totalPages; i++) {
      const page = pages[i];
      const pdfWidth = page.getWidth(); // PDF 페이지의 실제 너비
      const pdfHeight = page.getHeight(); // PDF 페이지의 실제 높이

      // 원본 크기와 PDF 크기 비교
      const widthRatio = pdfWidth / originSize.width;
      const heightRatio = pdfHeight / originSize.height;

      // 해당 페이지의 텍스트 아이템을 가져오기
      const textItems = textStore.getState().textItems[i + 1];
      if (textItems && textItems.length > 0) {
        textItems.forEach((item) => {
          const { x, y, text, fontSize } = item.detail; // 폰트 크기를 detail에서 가져옴
          page.drawText(text, {
            x: (x / scale) * widthRatio,
            y: ((originSize.height - y) / scale) * heightRatio,
            size: (fontSize / scale) * Math.min(widthRatio, heightRatio), // 폰트 크기를 적용
            font: customFont,
            color: rgb(0, 0, 0),
          });
        });
      }
      // 해당 페이지의 사각형을 가져오기
      const rectangles = shapeStore.getState().rectangles[i + 1];
      if (rectangles && rectangles.length > 0) {
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
            y: ((originSize.height - y - height) / scale) * heightRatio,
            width: (width / scale) * widthRatio,
            height: (height / scale) * heightRatio,
            borderWidth: borderWidth,
            borderColor: strokeColor,
            color: fillColor,
          });
        });
      }

      // 해당 페이지의 원을 가져오기
      const circles = shapeStore.getState().circles[i + 1];
      if (circles && circles.length > 0) {
        circles.forEach((circle) => {
          const { x, y, startX, startY, rx, ry, property } = circle.detail;

          // 중심 좌표 계산 (startX와 x, startY와 y를 이용하여 타원의 중심 좌표를 계산)
          const centerX = startX + (x - startX) / 2;
          const centerY = startY + (y - startY) / 2;

          // 반경 값이 NaN일 경우 기본값 설정
          const radiusX =
            !isNaN(rx) && rx !== 0 ? rx : Math.abs(x - startX) / 2;
          const radiusY =
            !isNaN(ry) && ry !== 0 ? ry : Math.abs(y - startY) / 2;

          const strokeColor = hexToRGB(property.strokeColor);
          const fillColor = property.fill
            ? hexToRGB(property.fillColor)
            : undefined;

          const borderWidth = property.stroke
            ? (Number(property.strokeWidth) / scale) *
              Math.min(widthRatio, heightRatio)
            : 0;

          // 좌표 변환: PDF 좌표계에서는 y좌표가 아래에서 위로 증가하므로, 이를 고려해야 함
          const transformedX = (centerX / scale) * widthRatio;
          const transformedY =
            ((originSize.height - centerY) / scale) * heightRatio;

          // 타원의 크기와 비율을 고려하여 그리기
          page.drawEllipse({
            x: transformedX, // 변환된 중심 x 좌표
            y: transformedY, // 변환된 중심 y 좌표
            xScale: (radiusX / scale) * widthRatio, // 가로 반경에 비율 적용
            yScale: (radiusY / scale) * heightRatio, // 세로 반경에 비율 적용
            borderWidth: borderWidth,
            borderColor: strokeColor,
            color: fillColor,
          });
        });
      }

      // 해당 페이지의 그린 경로를 가져오기
      const drawings = canvasStore.getState().getCanvasPath(i + 1);
      if (drawings && drawings.length > 0) {
        drawings.forEach((path) => {
          for (let j = 0; j < path.paths.length - 1; j++) {
            const startX = (path.paths[j].x / scale) * widthRatio;
            const startY =
              ((originSize.height - path.paths[j].y) / scale) * heightRatio;
            const endX = (path.paths[j + 1].x / scale) * widthRatio;
            const endY =
              ((originSize.height - path.paths[j + 1].y) / scale) * heightRatio;

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
