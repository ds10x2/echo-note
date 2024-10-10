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
import { LuPenLine } from "react-icons/lu";
import NewNoteModal from "@components/modal/NewNoteModal";

const NoteListPage = () => {
  const [notes, setNotes] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

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
            image:
              "https://timeisnullnull.s3.ap-northeast-2.amazonaws.com/noteExample.avif", // 필요 시, 이미지 경로를 설정
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
      <h1>Echo Note</h1>
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
      <NewNoteButton to="#" onClick={openModal}>
        <LuPenLine />
      </NewNoteButton>

      <NewNoteModal isOpen={isModalOpen} onClose={closeModal} />
    </NoteListContainer>
  );
};

export default NoteListPage;
