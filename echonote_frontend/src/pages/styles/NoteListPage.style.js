import styled from "styled-components";
import { Link } from "react-router-dom";
import { shouldNotForwardPropsWithKeys } from "@shared/utils/shouldForwardProp";

// 전체 노트 리스트 페이지 컨테이너
export const NoteListContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px;
  background-color: ${(props) => props.theme.colors.backgroundColor};
  height: 100vh;
  h1 {
    font-size: 24px;
    margin-bottom: 20px;
  }
`;

export const NoteHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
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
  position: absolute;
  bottom: 40px;
  right: 40px;
  width: 60px;
  height: 60px;
  background-color: #ffc107;
  color: white;
  border-radius: 50%;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  text-align: center;
  font-size: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: background-color 0.3s ease, transform 0.3s ease;
  z-index: 3;

  &:hover {
    background-color: #ffa000;
    transform: scale(1.1); // 버튼을 클릭할 때 약간의 확대 효과
  }

  i {
    font-size: 24px;
  }
`;

export const SortButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  background-color: #e2e2e2;
  border-radius: 8px;
  box-shadow: inset 0px 0px 10px #c5c5c5c7;
  position: relative;
  overflow: hidden;
  padding: 3px 5px;
`;

export const SwitchWrapper = styled.div.withConfig({
  shouldForwardProp: shouldNotForwardPropsWithKeys(["activeIndex"]),
})`
  position: absolute;
  top: 0;
  bottom: 0;
  width: 33%;
  z-index: 1;
  transition: transform 0.5s cubic-bezier(0.77, 0, 0.175, 1);
  background-color: #f5f5f5;
  border-radius: 8px;
  margin: 2px 0px;
  transform: ${({ activeIndex }) =>
    `translateX(${activeIndex * -95}%)`}; /* 슬라이드 애니메이션 */
`;

export const SortButton = styled.button.withConfig({
  shouldForwardProp: shouldNotForwardPropsWithKeys(["active"]),
})`
  background-color: transparent;
  border: none;
  min-width: 70px;
  color: #333;
  font-size: 14px;
  padding: 6px 10px;
  border-radius: 8px;
  cursor: pointer;
  position: relative;
  z-index: 2;
  transition: background-color 0.3s, color 0.3s;
  -webkit-tap-highlight-color: transparent;

  &:hover {
    color: #000;
  }
`;
