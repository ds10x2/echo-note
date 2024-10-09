import {
  ModalBackdrop,
  ModalContainer,
  ModalContent,
  ModalHeader,
  ModalFooter,
} from "@components/styles/NewNoteModal.style";
import { IoMdClose } from "react-icons/io";
import { useState } from "react";
import {
  getPdfPresignedUrl,
  S3UploadPdf,
  savePdfFile,
} from "@services/noteApi";
import { useNavigate } from "react-router-dom";

const NewNoteModal = ({ isOpen, onClose }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      console.log("Selected file:", file);
    }
  };

  const handleCreateNote = async () => {
    if (!selectedFile) {
      alert("PDF 파일을 선택해주세요.");
      return;
    }

    setIsUploading(true); // 업로드 중 상태 설정

    try {
      // 1. presigned URL 받아오기
      const { presigned_url, object_url } = await getPdfPresignedUrl();
      console.log("Presigned URL:", presigned_url);
      console.log("Object URL:", object_url);

      // 2. S3에 PDF 파일 업로드
      await S3UploadPdf(presigned_url, selectedFile);
      console.log("File uploaded successfully");

      // 3. 서버에 업로드된 파일 정보 저장
      const savedData = await savePdfFile(object_url);
      console.log("File saved successfully with note_id:", savedData.note_id);

      // 4. note_id 페이지로 이동
      navigate(`/note/${savedData.note_id}`);
    } catch (error) {
      console.error("Error during note creation process:", error);
    } finally {
      setIsUploading(false); // 업로드 중 상태 해제
      onClose(); // 모달 닫기
    }
  };

  if (!isOpen) return null;

  return (
    <ModalBackdrop onClick={onClose}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <h2>새 노트</h2>
          <button onClick={onClose}>
            <IoMdClose size={24} />
          </button>
        </ModalHeader>
        <ModalContent>
          <p>설정에서 언제든지 새 페이지 스타일을 선택할 수 있습니다.</p>
          <div>
            <label htmlFor="pdfUpload">PDF 파일 업로드</label>
            <input
              type="file"
              id="pdfUpload"
              accept="application/pdf"
              onChange={handleFileChange}
              style={{ display: "block", marginTop: "10px" }}
            />
            {selectedFile && <p>선택된 파일: {selectedFile.name}</p>}
          </div>
        </ModalContent>
        <ModalFooter>
          <button onClick={handleCreateNote} disabled={isUploading}>
            {isUploading ? "생성 중..." : "생성하기"}
          </button>
        </ModalFooter>
      </ModalContainer>
    </ModalBackdrop>
  );
};

export default NewNoteModal;
