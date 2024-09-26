import useSidebarStore from "@stores/sideBarStore";
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

const STTBar = () => {
  const { isSTTBarOpened, toggleSTTBar } = useSidebarStore();

  return (
    <>
      <STTBarContainer isOpened={isSTTBarOpened}>
        <STTBarHeader>
          <ToggleSwitch isToggled={isSTTBarOpened} onClick={toggleSTTBar} />
          <IconButton>
            <FaPen />
          </IconButton>
        </STTBarHeader>
        <STTBarSearchRow>
          <SearchBar />
        </STTBarSearchRow>
        <Divider />
        <STTBarContent isOpened={isSTTBarOpened}>
          <p>이곳에 텍스트가 들어갑니다. STT 관련 내용을 추가할 수 있습니다.</p>
        </STTBarContent>
      </STTBarContainer>
    </>
  );
};

export default STTBar;
