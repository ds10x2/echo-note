import { useState } from "react";
import { RiSpeakLine } from "react-icons/ri";
import { FaPen, FaTextHeight, FaImage, FaShapes, FaStar } from "react-icons/fa";
import { BiWindowAlt, BiChevronsDown, BiChevronsUp } from "react-icons/bi";
import { IoMicSharp } from "react-icons/io5";
import useSidebarStore from "@stores/sideBarStore";
import PropTypes from "prop-types";
import {
  Divider,
  ToolBarContainer,
  ToolBarHeader,
  ToolBarContent,
  ToolBarButton,
  Title,
  CollapseIcon,
  PdfIcon,
  ToolBarIcon,
  SideBarButton,
  AnimatedToolBarContent,
  STTIcon,
} from "@components/styles/ToolBar.style";

const ToolBar = () => {
  const { isPdfBarOpened, isSTTBarOpened, togglePdfBar, toggleSTTBar } =
    useSidebarStore();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <ToolBarContainer>
      <AnimatedToolBarContent collapsed={isCollapsed}>
        <ToolBarHeader>
          <Title>
            pdf file name
            <FaStar style={{ marginLeft: "10px", color: "gold" }} />
          </Title>
        </ToolBarHeader>
      </AnimatedToolBarContent>

      <ToolBarContent>
        <ToolBarButton>
          <ToolBarIcon as={IoMicSharp} />
          <Divider />
          <ToolBarIcon as={FaPen} />
          <ToolBarIcon as={FaTextHeight} />
          <ToolBarIcon as={FaImage} />
          <ToolBarIcon as={FaShapes} />
        </ToolBarButton>
        <SideBarButton>
          <PdfIcon
            as={BiWindowAlt}
            onClick={togglePdfBar}
            isPdfBarOpened={isPdfBarOpened}
          />
          <STTIcon
            as={RiSpeakLine}
            onClick={toggleSTTBar}
            isSTTBarOpened={isSTTBarOpened}
          />
          {isCollapsed ? (
            <CollapseIcon
              as={BiChevronsUp}
              onClick={toggleCollapse}
              isCollapsed={isCollapsed}
            />
          ) : (
            <CollapseIcon
              as={BiChevronsDown}
              onClick={toggleCollapse}
              isCollapsed={isCollapsed}
            />
          )}
        </SideBarButton>
      </ToolBarContent>
    </ToolBarContainer>
  );
};

export default ToolBar;
