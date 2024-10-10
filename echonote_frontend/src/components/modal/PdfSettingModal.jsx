import {
  ModalBackdrop,
  ModalButton,
  ModalContainer,
  ModalHeader,
  ModalItem,
  ModalList,
} from "@components/styles/PdfSettingModal.style";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { exportPdfWithTextAndShapes } from "@services/PDFSave/PdfSave";
import { useNoteStore } from "@/stores/noteStore";

const PdfSettingModal = ({ isOpen, onClose, position, toggleAnalyzeModal }) => {
  const [animate, setAnimate] = useState(false);
  const [visible, setVisible] = useState(isOpen);
  const { pdf_path } = useNoteStore();

  useEffect(() => {
    if (isOpen) {
      setVisible(true);
    } else if (visible) {
      setAnimate(true); // 닫기 애니메이션 시작
      const timer = setTimeout(() => {
        setAnimate(false);
        setVisible(false); // 애니메이션이 끝난 후 DOM에서 제거
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [isOpen, visible]);

  if (!animate && !visible) return null;

  const handleExportPdf = async () => {
    try {
      await exportPdfWithTextAndShapes(pdf_path); // PDF 내보내기 함수 호출
      alert("PDF가 성공적으로 내보내졌습니다.");
    } catch (error) {
      console.error("PDF 내보내기 실패:", error);
      alert("PDF 내보내기에 실패했습니다.");
    }
  };

  return (
    <ModalBackdrop
      className={isOpen ? "modal open" : "modal"}
      onClick={onClose}
    >
      <ModalContainer
        className={isOpen ? "modal-container open" : "modal-container"}
        style={{ top: position?.top, left: position?.left }}
      >
        <ModalHeader>
          <ModalButton onClick={() => toggleAnalyzeModal("음성")}>
            음성 분석
          </ModalButton>
          <ModalButton onClick={() => toggleAnalyzeModal("키워드")}>
            키워드 설정
          </ModalButton>
        </ModalHeader>
        <ModalList>
          <ModalItem>태그</ModalItem>
          <ModalItem onClick={handleExportPdf}>파일로 저장</ModalItem>
          <ModalItem>손가락으로 그리기 켜기</ModalItem>
        </ModalList>
      </ModalContainer>
    </ModalBackdrop>
  );
};

PdfSettingModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  position: PropTypes.object,
  toggleAnalyzeModal: PropTypes.func.isRequired,
};

export default PdfSettingModal;
