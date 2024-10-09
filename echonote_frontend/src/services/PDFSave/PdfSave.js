import { PDFDocument, rgb } from "pdf-lib";
import * as fontkit from "fontkit";
import textStore from "@stores/textStore"; // zustand store
import shapeStore from "@stores/shapeStore"; // zustand store
import pageStore from "@stores/pageStore"; // zustand store
import fontUrl from "@fonts/SUIT-Medium.ttf"; // 한글 TTF 폰트 경로

// 헥사코드를 RGB로 변환하는 함수
const hexToRGB = (hex) => {
  const parsedHex = hex.replace("#", "");
  const r = parseInt(parsedHex.substring(0, 2), 16);
  const g = parseInt(parsedHex.substring(2, 4), 16);
  const b = parseInt(parsedHex.substring(4, 6), 16);
  return rgb(r / 255, g / 255, b / 255);
};

// 텍스트와 도형을 저장하는 서비스 함수
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

    const textItems = textStore.getState().getCurrentPageItems();
    const rectangles = shapeStore.getState().getRectangles();
    const circles = shapeStore.getState().getCircles();

    const scale = pageStore.getState().scale;

    // 텍스트 아이템을 PDF 페이지에 추가
    textItems.forEach((item) => {
      const { x, y, text } = item.detail;
      page.drawText(text, {
        x: x / scale, // scale을 반영하여 위치 조정
        y: (page.getHeight() - y) / scale, // y좌표 변환 (PDF 좌표계 고려)
        size: 12 / scale, // 텍스트 크기 조정
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
        ? Number(property.strokeWidth) / scale
        : 0;

      page.drawRectangle({
        x: x / scale,
        y: (page.getHeight() - y - height) / scale, // y좌표 변환
        width: width / scale, // width 보정
        height: height / scale, // height 보정
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
        ? Number(property.strokeWidth) / scale
        : 0;

      page.drawCircle({
        x: cx / scale,
        y: (page.getHeight() - cy) / scale, // y좌표 변환
        size: r / scale, // 원 크기 보정
        borderWidth: borderWidth,
        borderColor: strokeColor,
        color: fillColor,
      });
    });

    // PDF 파일을 저장
    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: "application/pdf" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "modified_pdf_with_shapes_text.pdf";
    link.click();
  } catch (error) {
    console.error("Error exporting PDF:", error);
  }
};
