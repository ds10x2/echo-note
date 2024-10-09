import styled from "styled-components";
import { Link } from "react-router-dom";

// 전체 노트 리스트 페이지 컨테이너
export const NoteListContainer = styled.div`
  padding: 20px;
  background-color: ${(props) => props.theme.colors.backgroundColor};
  height: 100vh;
  h1 {
    font-size: 24px;
    margin-bottom: 20px;
  }
`;

// 노트 그리드 스타일
export const NoteGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  grid-gap: 20px;
`;

// 개별 노트 아이템 스타일
export const NoteItem = styled.div`
  background-color: #f5f5f5;
  border-radius: 10px;
  padding: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
  transition: box-shadow 0.3s ease;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }

  a {
    text-decoration: none;
    color: black;
  }
`;

// 노트 이미지 스타일
export const NoteImage = styled.img`
  width: 100%;
  height: 120px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 10px;
`;

// 노트 제목 스타일
export const NoteTitle = styled.div`
  font-size: 18px;
  font-weight: bold;
`;

// 새 노트 작성 버튼 스타일
export const NewNoteButton = styled(Link)`
  position: fixed;
  bottom: 20px;
  right: 20px;
  background-color: #ffc107;
  color: white;
  padding: 15px;
  border-radius: 50%;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  text-align: center;
  font-size: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #ffa000;
  }

  i {
    font-size: 20px;
  }
`;