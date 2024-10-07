import { useState } from "react";
import axios from "axios"; // axios 라이브러리를 사용하여 HTTP 요청을 보냅니다.
import "@services/PDFupload/PdfUpdate.css";

const PdfUpdate = () => {
  const [pdfFile, setPdfFile] = useState(null); // 업로드할 PDF 파일 상태
  const [pdfUrl, setPdfUrl] = useState(""); // 업로드된 PDF의 URL 상태

  // 파일 선택 핸들러
  const handleFileChange = (event) => {
    setPdfFile(event.target.files[0]); // 선택한 파일을 상태에 저장
  };

  // PDF 업로드 핸들러
  const handleUpload = async () => {
    if (!pdfFile) return; // 파일이 선택되지 않은 경우 처리하지 않음

    const formData = new FormData();
    formData.append("file", pdfFile); // 폼 데이터에 파일 추가

    try {
      // 서버에 PDF 파일을 업로드
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}voice/stt?id=${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // 서버로부터 반환된 S3 URL을 상태에 저장
      const { url } = response.data;
      setPdfUrl(url);
    } catch (error) {
      console.error("파일 업로드 중 오류 발생:", error);
    }
  };

  return (
    <div className="pdf-update">
      <input type="file" accept="application/pdf" onChange={handleFileChange} />
      <button className="plus" onClick={handleUpload}>
        +
      </button>
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
