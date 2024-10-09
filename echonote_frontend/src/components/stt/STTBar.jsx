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
import { useNoteStore } from "@stores/noteStore";

const STTBar = () => {
  const { isSTTBarOpened } = useSidebarStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);
  const [modifiedTexts, setModifiedTexts] = useState([]);

  const { currentIndex, setCurrentIndex, searchResults } = useSearchStore();
  const { note_id } = useNoteStore();

  const handleSearch = (term) => {
    setSearchTerm(term);
    setCurrentIndex(0);
  };

  const handleSubmit = async (modifiedData) => {
    if (modifiedData.length > 0) {
      try {
        await modifySTTResult(note_id, modifiedData);
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
          searchTerm={searchTerm}
          isEditMode={isEditMode}
          onSubmit={setModifiedTexts}
        />
      </STTBarContent>
    </STTBarContainer>
  );
};

export default STTBar;
