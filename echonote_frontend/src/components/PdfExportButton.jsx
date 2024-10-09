import React from "react";
import { exportPdfWithTextAndShapes } from "@services/PDFSave/PdfSave"; // PdfSave.js에서 export한 함수
import styled from "styled-components";

const ExportButton = styled.button`
  background-color: #4caf50; /* 녹색 배경 */
  color: white;
  padding: 10px 20px;
  font-size: 16px;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #45a049;
  }

  &:active {
    background-color: #3e8e41;
    transform: translateY(2px);
  }
`;

const PdfExportButton = () => {
  const handleExport = async () => {
    try {
      await exportPdfWithTextAndShapes(); // PDF 내보내기 함수 호출
      alert("PDF가 성공적으로 내보내졌습니다.");
    } catch (error) {
      console.error("PDF 내보내기 실패:", error);
      alert("PDF 내보내기에 실패했습니다.");
    }
  };

  return <ExportButton onClick={handleExport}>PDF 내보내기</ExportButton>;
};

export default PdfExportButton;
