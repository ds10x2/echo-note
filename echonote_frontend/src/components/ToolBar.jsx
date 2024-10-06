import AnalyzeModal from "@components/AnalyzeModal";
import PdfSettingModal from "@components/PdfSettingModal";
import { useState } from "react";
import { RiSpeakLine } from "react-icons/ri";
import { FaPen, FaTextHeight, FaImage, FaShapes, FaStar } from "react-icons/fa";
import { BiWindowAlt, BiChevronsDown, BiChevronsUp } from "react-icons/bi";
import {
  IoMicSharp,
  IoChevronBackOutline,
  IoChevronForwardOutline,
} from "react-icons/io5";
import { LuZoomIn, LuZoomOut } from "react-icons/lu";
import useSidebarStore from "@stores/sideBarStore";
import drawingTypeStore from "@stores/drawingTypeStore";
import pageStore from "@stores/pageStore";
import {
  AnimatedToolBarContent,
  Divider,
  IconButton,
  SettingButton,
  SideBarButton,
  Title,
  ToolBarButton,
  ToolBarContainer,
  ToolBarContent,
  ToolBarHeader,
  ToolBarIcon,
} from "@components/styles/ToolBar.style";
import useSidebarStore from "@stores/sideBarStore";
import { useEffect, useRef, useState } from "react";
import { BiChevronsDown, BiChevronsUp, BiWindowAlt } from "react-icons/bi";
import { FaImage, FaPen, FaShapes, FaStar, FaTextHeight } from "react-icons/fa";
import { IoMicSharp } from "react-icons/io5";
import { RiSpeakLine } from "react-icons/ri";
import { VscSettings } from "react-icons/vsc";

const ToolBar = () => {
  const {
    isPdfBarOpened,
    isSTTBarOpened,
    togglePdfBar,
    toggleSTTBar,
    isRecordingBarOpened,
    toggleRecordingBar,
  } = useSidebarStore();

  const { mode, setTextMode, setShapeMode } = drawingTypeStore();

  const { nextPage, prevPage, zoomIn, zoomOut } = pageStore();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isPdfSettingModalOpen, setIsPdfSettingModalOpen] = useState(false);
  const [isAnalyzeModalOpen, setIsAnalyzeModalOpen] = useState(false);
  const [modalType, setModalType] = useState("");
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

  const handleAnalyzeModalOpen = (ModalType) => {
    setIsPdfSettingModalOpen(false);
    setModalType(ModalType);

    const modalWidth = 300;
    const adjustedLeft = buttonPosition.left - modalWidth;

    setButtonPosition((prevPosition) => ({
      ...prevPosition,
      left: adjustedLeft,
    }));

    setTimeout(() => {
      setIsAnalyzeModalOpen(true);
    }, 200);
  };

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
          <ToolBarIcon
            as={FaTextHeight}
            onClick={setTextMode}
            isActive={mode.text}
          />
          <ToolBarIcon as={FaImage} />
          <ToolBarIcon
            as={FaShapes}
            onClick={setShapeMode}
            isActive={mode.shape}
          />
          <Divider />
          <IconButton as={LuZoomOut} onClick={zoomOut} />
          <IconButton as={LuZoomIn} onClick={zoomIn} />
          <Divider />
          <IconButton as={IoChevronBackOutline} onClick={prevPage} />
          <IconButton as={IoChevronForwardOutline} onClick={nextPage} />
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
        toggleAnalyzeModal={handleAnalyzeModalOpen}
      />

      <AnalyzeModal
        isOpen={isAnalyzeModalOpen}
        onClose={toggleAnalyzeModal}
        position={buttonPosition}
        modalType={modalType}
      />
    </ToolBarContainer>
  );
};

export default ToolBar;
