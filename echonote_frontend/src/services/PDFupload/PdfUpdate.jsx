import { useState, useRef } from "react";
import axios from "axios";
import "@services/PDFupload/PdfUpdate.css";

const PdfUpdate = () => {
    const [pdfFile, setPdfFile] = useState(null); // 업로드할 PDF 파일 상태
    const [presignedUrl, setPresignedUrl] = useState(""); // 서버로부터 받은 presigned URL
    const [pdfUrl, setPdfUrl] = useState(""); // 업로드된 PDF의 URL 상태

    const fileInputRef = useRef(null); // input 요소에 접근하기 위한 ref


    const toCamelCase = (str) => {
        return str.replace(/_([a-z])/g, (match, p1) => p1.toUpperCase());
    };

// 객체의 모든 키를 카멜 케이스로 변환하는 함수
    const keysToCamelCase = (obj) => {
        if (obj === null || typeof obj !== 'object') return obj;

        return Object.keys(obj).reduce((acc, key) => {
            const camelCaseKey = toCamelCase(key);
            acc[camelCaseKey] = keysToCamelCase(obj[key]); // 재귀적으로 내부 객체 처리
            return acc;
        }, {});
    };


    // Presigned URL 요청 핸들러
    const getPresignedUrl = async () => {

    };

    // PDF 업로드 핸들러 (presigned URL로 파일 업로드)
    const handleUpload = async (file) => {
        if (!file) return; // 파일이 선택되지 않은 경우 처리하지 않음


        try {
            // 백엔드에서 presigned URL을 요청
            const response = await axios.get(`${import.meta.env.VITE_API_URL}note`);

            // 서버로부터 받은 응답 데이터를 카멜 케이스로 변환
            const camelCasedData = keysToCamelCase(response.data);

            const { presignedUrl, objectUrl } = camelCasedData; // 변환된 데이터로 처리
            setPresignedUrl(presignedUrl);
            setPdfUrl(objectUrl);
            console.log("Presigned URL:", presignedUrl); // 여기서 URL 확인
            console.log("objectUrl URL:", objectUrl); // 여기서 URL 확인

            // S3에 PDF 파일을 presigned URL로 업로드
            await axios.put(presignedUrl, file, {
                headers: {
                    "Content-Type": "application/pdf", // 올바른 MIME 타입 설정
                },
            });

            // 업로드 성공 후 백엔드에 object URL 전달하여 노트 생성
            await axios.post(`${import.meta.env.VITE_API_URL}note`, {
                "objectUrl": objectUrl, // S3에 업로드된 PDF의 URL을 백엔드로 전달
            });

            alert("PDF 업로드 및 노트 생성 성공!");
        } catch (error) {
            console.error("Presigned URL 요청 중 오류 발생:", error);
        }
    };

    // 파일 선택 핸들러
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setPdfFile(file); // 선택한 파일을 상태에 저장
            handleUpload(file); // 파일을 선택하자마자 업로드 진행
        }
    };

    // 버튼 클릭 시 파일 선택 창 열기
    const handleButtonClick = () => {
        fileInputRef.current.click(); // 숨겨진 input 요소 클릭
    };

    return (
        <div className="pdf-update">
            {/* 파일 선택 input은 화면에서 숨김 */}
            <input
                type="file"
                accept="application/pdf"
                onChange={handleFileChange}
                ref={fileInputRef}
                style={{ display: "none" }} // 숨기기
            />
            {/* 파일 선택 버튼 */}
            <button className="plus" onClick={handleButtonClick}>파일 업로드</button>
            {pdfUrl && (
                <div>
                    <h3>업로드된 PDF:</h3>
                    <a href={pdfUrl} target="_blank" rel="noopener noreferrer">
                        {pdfUrl}
                    </a>
                </div>
            )}
        </div>
    );
};

export default PdfUpdate;
