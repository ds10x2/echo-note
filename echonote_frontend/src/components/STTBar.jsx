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
  const [searchTerm, setSearchTerm] = useState(""); // 검색어 상태

  const toggleHighLight = () => {
    setIsHighLight(!isHighLight);
  };

  const handleSearch = (term) => {
    setSearchTerm(term); // 검색어 상태 업데이트
  };

  return (
      <STTBarContainer isOpened={isSTTBarOpened}>
        <STTBarHeader>
          <ToggleSwitch isToggled={isHighLight} onClick={toggleHighLight} />
          <IconButton>
            <FaPen />
          </IconButton>
        </STTBarHeader>
        <STTBarSearchRow>
          <SearchBar onSearch={handleSearch} /> {/* 검색어를 MainComponent에 전달 */}
        </STTBarSearchRow>
        <Divider />
        <STTBarContent isOpened={isSTTBarOpened}>
          <STTResult id={1} searchTerm={searchTerm} /> {/* 검색어를 STTResult에 전달 */}
        </STTBarContent>
      </STTBarContainer>
  );
};

export default STTBar;
