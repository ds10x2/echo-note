import { useState, useRef, useEffect } from "react";
import { RiSpeakLine } from "react-icons/ri";
import { FaPen, FaTextHeight, FaImage, FaShapes, FaStar } from "react-icons/fa";
import { VscSettings } from "react-icons/vsc";
import { BiWindowAlt, BiChevronsDown, BiChevronsUp } from "react-icons/bi";
import { IoMicSharp } from "react-icons/io5";
import useSidebarStore from "@stores/sideBarStore";
import PdfSettingModal from "@components/PdfSettingModal";
import AnalyzeModal from "@components/AnalyzeModal";
import {
  Divider,
  ToolBarContainer,
  ToolBarHeader,
  ToolBarContent,
  ToolBarButton,
  Title,
  IconButton,
  ToolBarIcon,
  SideBarButton,
  AnimatedToolBarContent,
  SettingButton,
} from "@components/styles/ToolBar.style";

const ToolBar = () => {
  const {
    isPdfBarOpened,
    isSTTBarOpened,
    togglePdfBar,
    toggleSTTBar,
    isRecordingBarOpened,
    toggleRecordingBar,
  } = useSidebarStore();

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isPdfSettingModalOpen, setIsPdfSettingModalOpen] = useState(false);
  const [isAnalyzeModalOpen, setIsAnalyzeModalOpen] = useState(false);
  const [buttonPosition, setButtonPosition] = useState(null);
  const settingButtonRef = useRef(null);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const togglePdfModal = () => {
    if (settingButtonRef.current) {
      const rect = settingButtonRef.current.getBoundingClientRect();
      const modalWidth = 260;
      setButtonPosition({
        top: rect.bottom + 10 + window.scrollY,
        left: rect.right - modalWidth + window.scrollX,
      });
    }

    setIsPdfSettingModalOpen(!isPdfSettingModalOpen);
  };

  const toggleAnalyzeModal = () => {
    setIsAnalyzeModalOpen(!isAnalyzeModalOpen);
  };

  const handleAnalyzeModalOpen = () => {
    setIsPdfSettingModalOpen(false);

    const modalWidth = 300; // AnalyzeModal의 너비
    const adjustedLeft = buttonPosition.left - modalWidth;

    // 위치 업데이트
    setButtonPosition((prevPosition) => ({
      ...prevPosition, // 기존 값 유지
      left: adjustedLeft, // left 값 업데이트
    }));

    // 모달을 약간의 지연 시간 후에 열기
    setTimeout(() => {
      setIsAnalyzeModalOpen(true);
    }, 200); // 200ms의 지연 시간
  };

  // buttonPosition이 업데이트된 후에 AnalyzeModal을 열기 위한 useEffect
  useEffect(() => {
    if (buttonPosition && buttonPosition.left === 710) {
      setIsAnalyzeModalOpen(true);
      console.log("AnalyzeModal이 열렸습니다.");
    }
  }, [buttonPosition]);

  return (
    <ToolBarContainer>
      <AnimatedToolBarContent collapsed={isCollapsed}>
        <ToolBarHeader>
          <Title>
            pdf file name
            <FaStar style={{ marginLeft: "10px", color: "gold" }} />
          </Title>
          <SettingButton ref={settingButtonRef} onClick={togglePdfModal}>
            <VscSettings style={{ marginRight: "10px", fontSize: "20px" }} />
          </SettingButton>
        </ToolBarHeader>
      </AnimatedToolBarContent>

      <ToolBarContent>
        <ToolBarButton>
          <IconButton
            as={IoMicSharp}
            onClick={toggleRecordingBar}
            isActive={isRecordingBarOpened}
          />
          <Divider />
          <ToolBarIcon as={FaPen} />
          <ToolBarIcon as={FaTextHeight} />
          <ToolBarIcon as={FaImage} />
          <ToolBarIcon as={FaShapes} />
        </ToolBarButton>
        <SideBarButton>
          <IconButton
            as={BiWindowAlt}
            onClick={togglePdfBar}
            isActive={isPdfBarOpened}
          />
          <IconButton
            as={RiSpeakLine}
            onClick={toggleSTTBar}
            isActive={isSTTBarOpened}
          />
          {isCollapsed ? (
            <IconButton
              as={BiChevronsUp}
              onClick={toggleCollapse}
              isActive={!isCollapsed}
            />
          ) : (
            <IconButton
              as={BiChevronsDown}
              onClick={toggleCollapse}
              isActive={!isCollapsed}
            />
          )}
        </SideBarButton>
      </ToolBarContent>

      <PdfSettingModal
        isOpen={isPdfSettingModalOpen}
        onClose={togglePdfModal}
        position={buttonPosition}
        toggleAnalyzeModal={handleAnalyzeModalOpen} // PdfSettingModal에서 AnalyzeModal 열기
      />

      <AnalyzeModal
        isOpen={isAnalyzeModalOpen}
        onClose={toggleAnalyzeModal}
        position={buttonPosition}
      />
    </ToolBarContainer>
  );
};

export default ToolBar;
