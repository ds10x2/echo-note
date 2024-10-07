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

  const { currentIndex, setSearchResults } = useSearchStore();
  const resultRefs = useRef([]); // 전체 세그먼트 참조 저장
  const highlightRefs = useRef([]); // 하이라이트 텍스트의 참조 저장

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
              // 검색어가 포함된 부분만 참조를 저장
              if (part.toLowerCase() === searchTerm.toLowerCase()) {
                highlightRefs.current[index] = el; // 하이라이트 부분에 대한 참조 저장
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

  // 하이라이트된 텍스트로 스크롤
  useEffect(() => {
    if (highlightRefs.current[currentIndex]) {
      console.log("Scrolling to element:", highlightRefs.current[currentIndex]); // 디버깅을 위한 로그
      highlightRefs.current[currentIndex].scrollIntoView({
        behavior: "smooth", // 부드러운 스크롤
        block: "center", // 뷰포트 중앙으로 이동
      });
    } else {
      console.log("No element found for currentIndex:", currentIndex);
    }
  }, [currentIndex]);

  return (
    <STTContainer>
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
