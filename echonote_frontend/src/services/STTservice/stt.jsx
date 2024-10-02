import "@services/STTservice/styles.css";
import React, { useEffect, useState } from "react";

// API 호출 함수
export const getSTTResult = async (id) => {
    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}?id=${id}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            mode: 'cors' // CORS 모드 설정
        });

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
const STTComponent = ({ id }) => {
    const [sttData, setSttData] = useState([]);

    console.log(sttData)

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

    return (
        <div className="sttContainer">
            {sttData && sttData.length > 0 ? (
                <ul>
                    {sttData.map((segment, index) => (
                        <li key={segment.id || `segment-${index}`}> {/* segment.id가 null인 경우 fallback */}
                            {/* 타임스탬프 표시 */}
                            <a href="#">{formatTime(parseFloat(segment.start))} ~ {formatTime(parseFloat(segment.end))}</a>
                            <p>{segment.text}</p>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>이곳에 텍스트가 들어갑니다. STT 관련 내용을 추가할 수 있습니다.</p>
            )}
        </div>
    );
};

export default STTComponent;
