import { useState, useEffect } from "react";
import {
  AnalyzeModalContainer,
  ModalBackdrop,
  ModalHeader,
  AnalyzedSection,
  BackgroundColorSection,
  ColorOption,
} from "@components/styles/AnalyzeModal.style";
import PropTypes from "prop-types";
import Github, { GithubPlacement } from "@uiw/react-color-github";

const AnalyzeModal = ({ isOpen, onClose, position }) => {
  const [isVisible, setIsVisible] = useState(isOpen);
  const [hex, setHex] = useState("#fff");

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true); // 모달이 열릴 때 visible 상태를 true로 설정
    } else {
      const timer = setTimeout(() => {
        setIsVisible(false); // 닫기 애니메이션 후 visible을 false로 설정
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isVisible) return null;

  return (
    <ModalBackdrop
      className={isOpen ? "modal open" : "modal"} // isOpen에 따라 열림/닫힘 애니메이션
      onClick={onClose}
    >
      <AnalyzeModalContainer
        className={isOpen ? "modal open" : "modal"} // isOpen 상태에 따라 애니메이션 제어
        style={{ top: position?.top, left: position?.left }}
        onClick={(e) => e.stopPropagation()} // 모달 외부 클릭 방지
      >
        <ModalHeader>음성 분석</ModalHeader>
        <AnalyzedSection>
          <button className="direction-btn active">상하</button>
          <button className="direction-btn">좌우</button>
          <button className="direction-btn">좌우</button>
        </AnalyzedSection>
        <ModalHeader>텍스트 설정</ModalHeader>
        <BackgroundColorSection>
          <Github
            color={hex}
            placement={GithubPlacement.TopLeft}
            style={{
              "--github-background-color": "#2c2c2c",
            }}
            onChange={(color) => {
              setHex(color.hex);
            }}
          />
        </BackgroundColorSection>
      </AnalyzeModalContainer>
    </ModalBackdrop>
  );
};

AnalyzeModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  position: PropTypes.object, // 모달 위치 설정
};

export default AnalyzeModal;
