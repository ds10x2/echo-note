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
  const [searchTerm, setSearchTerm] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);
  const [modifiedTexts, setModifiedTexts] = useState([]);

  const { currentIndex, setCurrentIndex, searchResults } = useSearchStore();

  const noteId = 1;

  const handleSearch = (term) => {
    setSearchTerm(term);
    setCurrentIndex(0);
  };

  const handleSubmit = async (modifiedData) => {
    if (modifiedData.length > 0) {
      try {
        await modifySTTResult(noteId, modifiedData);
        console.log("STT data updated successfully");
        setModifiedTexts([]);
      } catch (error) {
        console.error("Error updating STT data:", error);
      }
    }
  };

  const toggleEditMode = () => {
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
