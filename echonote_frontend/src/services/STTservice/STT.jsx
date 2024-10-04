import "@services/STTservice/styles.css";
import React, { useEffect, useState } from "react";
import {
    STTContainer,
    STTResultList,
    STTResultItem,
    ResultLink,
    ResultText
} from "@services/STTservice/STT.style";

// API 호출 함수
export const getSTTResult = async (id) => {
    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}voice/stt?id=${id}`, {
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
    const [modifiedTexts, setModifiedTexts] = useState([]);

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
                prev.map((item) => (item.id === segmentId ? { id: segmentId, text: newText } : item))
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
                            <ResultLink href="#">
                                {formatTime(parseFloat(segment.start))} ~ {formatTime(parseFloat(segment.end))}
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