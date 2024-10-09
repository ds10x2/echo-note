import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  NoteListContainer,
  NoteGrid,
  NoteItem,
  NoteImage,
  NoteTitle,
  NewNoteButton,
} from "@pages/styles/NoteListPage.style";
import { getNoteList } from "@services/noteApi";

const NoteListPage = () => {
  // notes 상태 관리
  const [notes, setNotes] = useState([]);

  // 데이터 가져오기
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getNoteList();
        if (data) {
          // 받아온 데이터를 notes 상태에 저장
          const formattedNotes = data.map((note) => ({
            id: note.note_id,
            title: note.note_name,
            createdAt: note.create_at,
            image: "src/assets/images/noteExample.avif", // 필요 시, 이미지 경로를 설정
          }));
          setNotes(formattedNotes);
        }
      } catch (error) {
        console.error("Error fetching notes:", error);
      }
    };
    fetchData();
  }, []); // id 대신 빈 배열로 effect가 처음 한 번만 실행되도록 설정

  return (
    <NoteListContainer>
      <h1>모든 노트</h1>
      <NoteGrid>
        {notes.map((note) => (
          <NoteItem key={note.id}>
            <Link to={`/note/${note.id}`}>
              <NoteImage src={note.image} alt={`${note.title} 이미지`} />
              <NoteTitle>{note.title}</NoteTitle>
            </Link>
          </NoteItem>
        ))}
      </NoteGrid>
      {/* 새 노트 작성 버튼 */}
      <NewNoteButton to="/create-note">
        <i className="icon-pencil" /> {/* 아이콘을 넣는 부분 */}
      </NewNoteButton>
    </NoteListContainer>
  );
};

export default NoteListPage;
