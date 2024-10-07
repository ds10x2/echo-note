import PropTypes from "prop-types";
import { useEffect, useState, useRef } from "react";
import {
  STTContainer,
  STTResultList,
  STTResultItem,
  ResultLink,
  ResultText,
} from "@/components/styles/STT.style";
import { useAudioStore } from "@stores/recordStore";
import { getSTTResult } from "@services/sttApi";
import { useSearchStore } from "@stores/sideBarStore";

// 시간 포맷팅 함수 (초를 분:초로 변환)
const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
};

const STTComponent = ({ id, searchTerm, isEditMode, onSubmit }) => {
  const [sttData, setSttData] = useState([]);
  const [modifiedTexts, setModifiedTexts] = useState([]);
  const { setStartTime } = useAudioStore();

  const { currentIndex } = useSearchStore();
  const resultRefs = useRef([]);

  // 컴포넌트 마운트 시 API 데이터 가져오기
  useEffect(() => {
    const fetchData = async () => {
      const data = await getSTTResult(id);
      if (data && data.result) {
        setSttData(data.result);
      }
    };
    fetchData();
  }, [id]);

  // 검색어를 포함한 부분 강조
  const highlightText = (text) => {
    if (!searchTerm) return text;
    const parts = text.split(new RegExp(`(${searchTerm})`, "gi"));
    return parts.map((part, index) =>
      part.toLowerCase() === searchTerm.toLowerCase() ? (
        <span key={index} style={{ backgroundColor: "yellow" }}>
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  // 텍스트 수정 시 호출되는 함수
  const handleTextChange = (segmentId, newText) => {
    const exists = modifiedTexts.find((item) => item.id === segmentId);
    if (exists) {
      setModifiedTexts((prev) =>
        prev.map((item) =>
          item.id === segmentId ? { id: segmentId, text: newText } : item
        )
      );
    } else {
      setModifiedTexts((prev) => [...prev, { id: segmentId, text: newText }]);
    }
  };

  useEffect(() => {
    if (onSubmit) {
      onSubmit(modifiedTexts);
    }
  }, [modifiedTexts, onSubmit]);

  useEffect(() => {
    if (resultRefs.current[currentIndex]) {
      resultRefs.current[currentIndex].scrollIntoView({ behavior: "smooth" });
    }
  }, [currentIndex]);

  return (
    <STTContainer>
      {sttData && sttData.length > 0 ? (
        <STTResultList>
          {sttData.map((segment) => (
            <STTResultItem
              key={segment.id}
              ref={(el) => (resultRefs.current[segment.id] = el)}
            >
              <ResultLink
                onClick={() => setStartTime(Number(segment.start).toFixed(6))}
              >
                {formatTime(parseFloat(segment.start))} ~{" "}
                {formatTime(parseFloat(segment.end))}
              </ResultLink>
              <ResultText
                contentEditable={isEditMode}
                onBlur={(e) => handleTextChange(segment.id, e.target.innerText)}
                suppressContentEditableWarning={true} // Prevent warning
                $isEditMode={isEditMode}
              >
                {highlightText(segment.text)}
              </ResultText>
            </STTResultItem>
          ))}
        </STTResultList>
      ) : (
        <p>이곳에 텍스트가 들어갑니다. STT 관련 내용을 추가할 수 있습니다.</p>
      )}
    </STTContainer>
  );
};

STTComponent.propTypes = {
  id: PropTypes.number.isRequired,
  searchTerm: PropTypes.string,
  isEditMode: PropTypes.bool.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default STTComponent;
