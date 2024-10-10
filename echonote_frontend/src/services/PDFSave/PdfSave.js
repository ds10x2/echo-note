import { PDFDocument, rgb } from "pdf-lib";
import * as fontkit from "fontkit";
import textStore from "@stores/textStore";
import shapeStore from "@stores/shapeStore";
import pageStore from "@stores/pageStore";
import canvasStore from "@stores/canvasStore";
import fontUrl from "@fonts/SUIT-Medium.ttf"; // 한글 TTF 폰트 경로
import { useNoteStore } from "@/stores/noteStore";

// 헥사코드를 RGB로 변환하는 함수
const hexToRGB = (hex) => {
  const parsedHex = hex.replace("#", "");
  const r = parseInt(parsedHex.substring(0, 2), 16);
  const g = parseInt(parsedHex.substring(2, 4), 16);
  const b = parseInt(parsedHex.substring(4, 6), 16);
  return rgb(r / 255, g / 255, b / 255);
};

// 가장 가까운 originSize를 찾는 함수
const findClosestOriginSize = (pdfWidth, pdfHeight, originSizes) => {
  let closestPage = null;
  let closestDiff = Infinity;

  for (const [pageNum, size] of Object.entries(originSizes)) {
    const widthDiff = Math.abs(size.width - pdfWidth);
    const heightDiff = Math.abs(size.height - pdfHeight);
    const totalDiff = widthDiff + heightDiff;

    if (totalDiff < closestDiff) {
      closestDiff = totalDiff;
      closestPage = size;
    }
  }

  return closestPage;
};

// 텍스트, 도형, 그린 경로를 저장하는 서비스 함수
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
    const originSizes = pageStore.getState().originSizes; // 각 페이지별 originSize 가져오기

    // 모든 페이지에 대해 텍스트, 도형, 필기 데이터를 추가
    for (let i = 0; i < totalPages; i++) {
      const page = pages[i];
      const pdfWidth = page.getWidth(); // PDF 페이지의 실제 너비
      const pdfHeight = page.getHeight(); // PDF 페이지의 실제 높이
      let originSize = originSizes[i + 1]; // 현재 페이지의 originSize 가져오기

      // originSize가 없는 경우 가장 가까운 사이즈로 추정
      if (!originSize) {
        originSize = findClosestOriginSize(pdfWidth, pdfHeight, originSizes);
        if (!originSize) {
          console.warn(`Cannot find suitable originSize for page ${i + 1}`);
          continue;
        }
      }

      // 원본 크기와 PDF 크기 비교
      const widthRatio = pdfWidth / originSize.width;
      const heightRatio = pdfHeight / originSize.height;

      // 텍스트 아이템 가져오기 및 PDF에 추가
      const textItems = textStore.getState().getCurrentPageItems(i + 1);
      if (textItems && textItems.length > 0) {
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
      }

      // 도형 아이템 가져오기 및 PDF에 추가
      const rectangles = shapeStore.getState().getRectangles(i + 1);
      const circles = shapeStore.getState().getCircles(i + 1);

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
            y: ((originSize.height - y - height) / scale) * heightRatio, // y좌표 변환
            width: (width / scale) * widthRatio, // width 보정
            height: (height / scale) * heightRatio, // height 보정
            borderWidth: borderWidth,
            borderColor: strokeColor,
            color: fillColor,
          });
        });
      }

      if (circles && circles.length > 0) {
        circles.forEach((circle) => {
          const { cx, cy, rx, ry, property } = circle.detail;

          // cx, cy, rx, ry 값이 유효한지 확인
          const centerX = !isNaN(cx) ? cx : 0;
          const centerY = !isNaN(cy) ? cy : 0;
          const radiusX = !isNaN(rx) ? rx : 1; // rx가 없거나 NaN이면 기본값 1
          const radiusY = !isNaN(ry) ? ry : 1; // ry가 없거나 NaN이면 기본값 1

          const strokeColor = hexToRGB(property.strokeColor);
          const fillColor = property.fill
            ? hexToRGB(property.fillColor)
            : undefined;

          const borderWidth = property.stroke
            ? (Number(property.strokeWidth) / scale) *
              Math.min(widthRatio, heightRatio)
            : 0;

          page.drawEllipse({
            x: (centerX / scale) * widthRatio,
            y: ((originSize.height - centerY) / scale) * heightRatio,
            xScale: (radiusX / scale) * Math.min(widthRatio, heightRatio),
            yScale: (radiusY / scale) * Math.min(widthRatio, heightRatio),
            borderWidth: borderWidth,
            borderColor: strokeColor,
            color: fillColor,
          });
        });
      }

      // 그린 경로 추가
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
