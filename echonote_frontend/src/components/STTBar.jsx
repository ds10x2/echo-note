import useSidebarStore from "@stores/sideBarStore";
import { useState } from "react";
import {
  STTBarContainer,
  STTBarContent,
  STTBarHeader,
  STTBarSearchRow,
  ToggleSwitch,
  IconButton,
  Divider,
} from "@components/styles/STTBar.style";
import { FaPen } from "react-icons/fa";
import SearchBar from "@components/common/SearchBar";
import STTResult from "@services/STTservice/stt";

const STTBar = () => {
  const { isSTTBarOpened } = useSidebarStore();
  const [isHighLight, setIsHighLight] = useState(false);

  const toggleHighLight = () => {
    setIsHighLight(!isHighLight);
  };



  return (
    <>
      <STTBarContainer isOpened={isSTTBarOpened}>
        <STTBarHeader>
          <ToggleSwitch isToggled={isHighLight} onClick={toggleHighLight} />
          <IconButton>
            <FaPen />
          </IconButton>
        </STTBarHeader>
        <STTBarSearchRow>
          <SearchBar />
        </STTBarSearchRow>
        <Divider />
        <STTBarContent isOpened={isSTTBarOpened}>
          <STTResult id={1}/>
        </STTBarContent>
      </STTBarContainer>
    </>
  );
};

export default STTBar;
