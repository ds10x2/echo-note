import "@components/stt/styles.css";
import { useEffect, useState } from "react";
import {
  STTContainer,
  STTResultList,
  STTResultItem,
  ResultLink,
  ResultText,
} from "@/components/styles/STT.style";
import { useAudioStore } from "@stores/recordStore";

// API 호출 함수
export const getSTTResult = async (id) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}voice/stt?id=${id}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        mode: "cors", // CORS 모드 설정
      }
    );
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching data:", error);
    return null; // 에러 발생 시 null 반환
  }
};

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
  const [eventMessage, setEventMessage] = useState('');

// 컴포넌트 마운트 시 API 데이터 가져오기
  useEffect(() => {
    const eventSource = new EventSource(' http://localhost:8080/voice/sse?note_id=1');

    console.log("SSE 연결 시도 중...");

    // 연결 시 초기 메시지 처리
    eventSource.onopen = (event) => {
      console.log("연결 완료: ", event);
    };

    // STT 완료 이벤트 처리
    eventSource.addEventListener('stt_complete', (event) => {
      console.log("STT 완료: ", event.data);
      setEventMessage('STT 정보 수신 완료');

      alert("STT 완료!");
    });

    // 일반 메시지 처리
    eventSource.onmessage = (event) => {
      console.log("메시지 수신: ", event.data);
    };

    // 오류 처리
    eventSource.onerror = (event) => {
      console.error("SSE 오류 발생:", event);
      console.error("readyState:", eventSource.readyState); // 상태 로그
      eventSource.close();  // 연결 종료
    };

    // 컴포넌트 언마운트 시 SSE 연결 닫기
    return () => {
      eventSource.close();
      console.log("SSE 연결 종료");
    };
  }, []);




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

  // 상위 컴포넌트로 수정된 데이터를 전달하는 함수
  useEffect(() => {
    if (onSubmit) {
      onSubmit(modifiedTexts);
    }
  }, [modifiedTexts, onSubmit]);

  return (
    <STTContainer>
      {sttData && sttData.length > 0 ? (
        <STTResultList>
          {sttData.map((segment) => (
            <STTResultItem key={segment.id}>
              <ResultLink
                href="#"
                onClick={() => setStartTime(parseFloat(segment.start))}
              >
                {formatTime(parseFloat(segment.start))} ~{" "}
                {formatTime(parseFloat(segment.end))}
              </ResultLink>
              <ResultText
                contentEditable={isEditMode}
                onBlur={(e) => handleTextChange(segment.id, e.target.innerText)} // Save text on edit
                suppressContentEditableWarning={true} // Prevent warning
                $isEditMode={isEditMode} // isEditMode prop 전달
              >
                {highlightText(segment.text)} {/* Display highlighted text */}
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

export default STTComponent;
