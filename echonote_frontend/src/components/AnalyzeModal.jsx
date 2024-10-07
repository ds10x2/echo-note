import {
  AnalyzedSection,
  AnalyzeModalContainer,
  BackgroundColorSection,
  ModalBackdrop,
  ModalHeader,
  ToggleContainer,
  TagButton,
} from "@components/styles/AnalyzeModal.style";
import Github, { GithubPlacement } from "@uiw/react-color-github";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";

const AnalyzeModal = ({ isOpen, onClose, position, modalType }) => {
  const [isVisible, setIsVisible] = useState(isOpen);
  const [hex, setHex] = useState("#fff");

  const [isOn, setisOn] = useState(false);

  const toggleHandler = () => {
    // isOn의 상태를 변경하는 메소드를 구현
    setisOn(!isOn);
  };

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
        {modalType === "음성" ? (
          <ModalHeader>
            <span>음성 분석</span>
            <ToggleContainer onClick={toggleHandler}>
              <div
                className={`toggle-container ${
                  isOn ? "toggle--checked" : null
                }`}
              />
              <div
                className={`toggle-circle ${isOn ? "toggle--checked" : null}`}
              />
            </ToggleContainer>
          </ModalHeader>
        ) : (
          <>
            <ModalHeader>키워드 분석</ModalHeader>
            <AnalyzedSection>
              <TagButton>강남 ✕</TagButton>
              <TagButton>서초구 ✕</TagButton>
              <TagButton>종로구 ✕</TagButton>
              <TagButton>용산구 ✕</TagButton>
            </AnalyzedSection>
          </>
        )}
        <ModalHeader>텍스트 설정</ModalHeader>
        <BackgroundColorSection>
          <Github
            color={hex}
            placement={GithubPlacement.TopLeft}
            style={{
              "--github-background-color": `#414141`,
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
  position: PropTypes.object,
  modalType: PropTypes.string.isRequired,
};

export default AnalyzeModal;
