import "@services/responsiveFrame/styles.css";
import React, { useEffect, useState } from "react";

// API 호출 함수
export const getSTTResult = (id) => {
  return fetch(`http://j11a210.p.ssafy.io:8080/voice/stt?id=${id}`)
      .then((response) => response.json())
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
};

// 시간 포맷팅 함수 (초를 분:초로 변환)
const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
};

const STTComponent = ({ id }) => {
  const [sttData, setSttData] = useState([]);

  // 컴포넌트 마운트 시 API 데이터 가져오기
  useEffect(() => {
    getSTTResult(id).then((data) => {
      if (data && data.result) {
        setSttData(data.result);
      }
    });
  }, [id]);

  return (
      <div>
        <ul>
          {sttData.map((segment) => (
              <li key={segment.id}>
                {/* 타임스탬프 표시 */}
                {formatTime(parseFloat(segment.start))} ~ {formatTime(parseFloat(segment.end))}: {segment.text}
              </li>
          ))}
        </ul>
      </div>
  );
};

export default STTComponent;
