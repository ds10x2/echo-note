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

const STTBar = () => {
  const { isSTTBarOpened } = useSidebarStore();
  const [searchTerm, setSearchTerm] = useState(""); // 검색어 상태
  const [isEditMode, setIsEditMode] = useState(false); // 수정 모드 상태 추가
  const [modifiedTexts, setModifiedTexts] = useState([]); // 상위에서 수정된 텍스트를 관리하는 상태

  const { setCurrentIndex } = useSearchStore();

  const noteId = 1;

  const handleSearch = (term) => {
    setSearchTerm(term); // 검색어 상태 업데이트
    setCurrentIndex(0);
  };

  const handleSubmit = async (modifiedData) => {
    // 수정된 텍스트가 있다면 서버로 전송
    if (modifiedData.length > 0) {
      try {
        const payload = {
          id: noteId, // note_id는 필요에 맞게 설정
          result: modifiedData,
        };

        console.log(payload);

        const response = await fetch(
          `${import.meta.env.VITE_API_URL}voice/stt`,
          {
            method: "PUT",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          }
        );

        if (!response.ok) {
          console.error("Failed to update STT data");
        } else {
          console.log("STT data updated successfully");
          setModifiedTexts([]); // 전송 완료 후 수정된 텍스트 초기화
        }
      } catch (error) {
        console.error("Error updating STT data:", error);
      }
    }
  };

  const toggleEditMode = () => {
    // 수정 모드 토글
    if (isEditMode) {
      handleSubmit(modifiedTexts); // 수정 모드가 해제되면 수정된 데이터 전송
    }
    setIsEditMode(!isEditMode);
  };

  return (
    <STTBarContainer isOpened={isSTTBarOpened}>
      <STTBarSearchRow>
        <SearchBar onSearch={handleSearch} />
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
          onSubmit={setModifiedTexts} // 수정된 텍스트 저장
        />
      </STTBarContent>
    </STTBarContainer>
  );
};

export default STTBar;
