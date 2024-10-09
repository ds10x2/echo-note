import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import ToolBar from "@components/ToolBar";
import PdfBar from "@components/PdfBar";
import RecordingBar from "@components/RecordingBar";
import STTBar from "@components/stt/STTBar";
import PdfViewer from "@components/PdfViewer";
import { Layout, MainContent } from "@/Layout.style";
import { useNoteStore } from "@stores/noteStore";
import { getNoteDetail } from "@services/noteApi";

const NotePage = () => {
  const { id } = useParams();
  const [isDrawingEditorOpened, setIsDrawingEditorOpened] = useState(false);
  const [isToolBarCollapsed, setIsToolBarCollapsed] = useState(false); // ToolBar 접힘 상태 관리
  const { setNoteDetail } = useNoteStore();

  const toggleDrawingEditor = () => {
    setIsDrawingEditorOpened(!isDrawingEditorOpened);
  };

  const handleToggleToolBar = (collapsed) => {
    setIsToolBarCollapsed(collapsed); // ToolBar 접힘 상태 업데이트
  };

  useEffect(() => {
    // 페이지 마운트 시 노트 상세 데이터를 가져옴
    const fetchNoteDetail = async () => {
      try {
        const noteDetail = await getNoteDetail(id); // API 호출
        setNoteDetail(noteDetail); // 받아온 데이터를 Zustand에 저장
      } catch (error) {
        console.error("Error fetching note detail:", error);
      }
    };

    fetchNoteDetail();
  }, [id]);

  return (
    <>
      <ToolBar
        onToggleDrawingEditor={toggleDrawingEditor}
        onToggleToolBar={handleToggleToolBar}
      />
      <Layout>
        <RecordingBar />
        <PdfBar />
        <MainContent isCollapsed={isToolBarCollapsed}>
          <PdfViewer isDrawingEditorOpened={isDrawingEditorOpened} />
        </MainContent>
        <STTBar />
      </Layout>
    </>
  );
};

export default NotePage;
