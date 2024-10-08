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

const STTComponent = ({
  id,
  searchTerm,
  isEditMode,
  onSubmit,
  handleArrowNavigation,
}) => {
  const [sttData, setSttData] = useState([]);
  const [modifiedTexts, setModifiedTexts] = useState([]);
  const { setStartTime } = useAudioStore();

  const { currentIndex, setCurrentIndex, searchResults, setSearchResults } =
    useSearchStore();
  const resultRefs = useRef([]); // 전체 세그먼트 참조 저장
  const highlightRefs = useRef([]); // 하이라이트 텍스트의 참조 저장
  const containerRef = useRef(null); // STTContainer 참조 저장

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

  // 검색어를 포함한 부분 강조 및 참조 저장
  const highlightText = (text, index) => {
    if (!searchTerm) return text;

    const parts = text.split(new RegExp(`(${searchTerm})`, "gi"));
    return (
      <span>
        {parts.map((part, i) => (
          <span
            key={i}
            ref={(el) => {
              if (part.toLowerCase() === searchTerm.toLowerCase() && el) {
                highlightRefs.current[index] = el; // 하이라이트 부분 참조 저장
              }
            }}
            style={
              part.toLowerCase() === searchTerm.toLowerCase()
                ? { backgroundColor: "yellow" }
                : {}
            }
          >
            {part}
          </span>
        ))}
      </span>
    );
  };

  useEffect(() => {
    if (highlightRefs.current[currentIndex]) {
      const highlightElement = highlightRefs.current[currentIndex];

      // 해당 하이라이트된 요소가 존재하면 스크롤을 해당 위치로 이동
      highlightElement.scrollIntoView({
        behavior: "smooth", // 부드럽게 스크롤
        block: "center", // 화면 중앙에 위치하도록 설정
      });
    }
  }, [currentIndex]);

  // 텍스트 수정 시 호출되는 함수
  const handleTextChange = (segmentId, newText) => {
    const segment = sttData.find((item) => item.id === segmentId);

    if (segment) {
      const modifiedSegment = {
        id: segmentId,
        start: segment.start,
        end: segment.end,
        text: newText,
      };

      // 기존에 수정된 텍스트가 있는 경우 업데이트, 없는 경우 새로 추가
      const exists = modifiedTexts.find((item) => item.id === segmentId);
      if (exists) {
        setModifiedTexts((prev) =>
          prev.map((item) => (item.id === segmentId ? modifiedSegment : item))
        );
      } else {
        setModifiedTexts((prev) => [...prev, modifiedSegment]);
      }
    }
  };

  useEffect(() => {
    if (searchTerm) {
      const results = [];
      sttData.forEach((segment, index) => {
        if (segment.text.toLowerCase().includes(searchTerm.toLowerCase())) {
          results.push({ index, ref: resultRefs.current[index] });
        }
      });
      setSearchResults(results); // 검색 결과 저장
    }
  }, [searchTerm, sttData, setSearchResults]);

  useEffect(() => {
    if (onSubmit) {
      onSubmit(modifiedTexts);
    }
  }, [modifiedTexts, onSubmit]);

  return (
    <STTContainer ref={containerRef}>
      {sttData && sttData.length > 0 ? (
        <STTResultList>
          {sttData.map((segment, index) => (
            <STTResultItem
              key={segment.id}
              ref={(el) => (resultRefs.current[index] = el)} // 각 세그먼트 참조 저장
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
                {highlightText(segment.text, index)} {/* 검색어 하이라이트 */}
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
