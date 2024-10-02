import "@services/STTservice/styles.css";
import React, { useEffect, useState } from "react";

// API 호출 함수
export const getSTTResult = async (id) => {
    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}?id=${id}`, {
            method: "GET",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            mode: "cors", // CORS 모드 설정
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

const STTComponent = ({ id, searchTerm, isEditMode, onSubmit }) => {
    const [sttData, setSttData] = useState([]);
    const [modifiedTexts, setModifiedTexts] = useState([]); // 수정된 텍스트 목록

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
        // 이미 수정된 텍스트가 있는지 확인
        const exists = modifiedTexts.find((item) => item.id === segmentId);
        if (exists) {
            // 이미 있는 경우 해당 객체를 수정
            setModifiedTexts((prev) =>
                prev.map((item) => (item.id === segmentId ? { id: segmentId, text: newText } : item))
            );
        } else {
            // 새로운 수정된 텍스트 추가
            setModifiedTexts((prev) => [...prev, { id: segmentId, text: newText }]);
        }
    };

    // 상위 컴포넌트로 수정된 데이터를 전달하는 함수
    useEffect(() => {
        if (onSubmit) {
            onSubmit(modifiedTexts); // 상위 컴포넌트로 수정된 데이터를 전달
        }
    }, [modifiedTexts, onSubmit]);

    return (
        <div className="sttContainer">
            {sttData && sttData.length > 0 ? (
                <ul>
                    {sttData.map((segment) => (
                        <li key={segment.id}>
                            <a href="#">
                                {formatTime(parseFloat(segment.start))} ~ {formatTime(parseFloat(segment.end))}
                            </a>
                            <p
                                contentEditable={isEditMode}
                                onBlur={(e) => handleTextChange(segment.id, e.target.innerText)} // 텍스트 수정 시 저장
                                suppressContentEditableWarning={true} // 경고 표시 방지
                                style={{ backgroundColor: isEditMode ? "lightyellow" : "transparent" }}
                            >
                                {highlightText(segment.text)} {/* 수정된 텍스트 표시 */}
                            </p>
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
