import { useSidebarStore, useSearchStore } from "@stores/sideBarStore";
import { useState } from "react";
import {
  STTBarContainer,
  STTBarContent,
  STTBarHeader,
  STTBarSearchRow,
  IconButton,
} from "@components/styles/STTBar.style";
import { FaPen } from "react-icons/fa";
import SearchBar from "@components/common/SearchBar";
import STTResult from "@components/stt/STT";
import { modifySTTResult } from "@services/sttApi";

const STTBar = () => {
  const { isSTTBarOpened } = useSidebarStore();
  const [searchTerm, setSearchTerm] = useState(""); // 검색어 상태
  const [isEditMode, setIsEditMode] = useState(false); // 수정 모드 상태 추가
  const [modifiedTexts, setModifiedTexts] = useState([]); // 상위에서 수정된 텍스트를 관리하는 상태

  const { currentIndex, setCurrentIndex, searchResults } = useSearchStore();

  const noteId = 1;

  const handleSearch = (term) => {
    setSearchTerm(term);
    setCurrentIndex(0);
  };

  const handleSubmit = async (modifiedData) => {
    // 수정된 텍스트가 있다면 서버로 전송
    if (modifiedData.length > 0) {
      try {
        await modifySTTResult(noteId, modifiedData); // API 함수 호출로 변경
        console.log("STT data updated successfully");
        setModifiedTexts([]); // 전송 완료 후 수정된 텍스트 초기화
      } catch (error) {
        console.error("Error updating STT data:", error);
      }
    }
  };

  const toggleEditMode = () => {
    // 수정 모드 토글
    if (isEditMode && modifiedTexts.length > 0) {
      handleSubmit(modifiedTexts);
    }
    setIsEditMode(!isEditMode);
  };

  const handleArrowNavigation = (direction) => {
    if (direction === "up") {
      setCurrentIndex(
        currentIndex - 1 < 0 ? searchResults.length - 1 : currentIndex - 1
      );
    } else if (direction === "down") {
      setCurrentIndex((currentIndex + 1) % searchResults.length);
    }
  };

  return (
    <STTBarContainer isOpened={isSTTBarOpened}>
      <STTBarSearchRow>
        <SearchBar
          onSearch={handleSearch}
          handleArrowNavigation={handleArrowNavigation}
        />
      </STTBarSearchRow>
      <STTBarHeader>
        <IconButton onClick={toggleEditMode}>
          <FaPen />
        </IconButton>
      </STTBarHeader>
      <STTBarContent isOpened={isSTTBarOpened}>
        <STTResult
          id={noteId}
          searchTerm={searchTerm}
          isEditMode={isEditMode}
          onSubmit={setModifiedTexts}
          handleArrowNavigation={handleArrowNavigation}
        />
      </STTBarContent>
    </STTBarContainer>
  );
};

export default STTBar;
