import styled from "styled-components";
import { shouldNotForwardPropsWithKeys } from "@shared/utils/shouldForwardProp";

export const SidebarContainer = styled.div.withConfig({
  shouldForwardProp: shouldNotForwardPropsWithKeys(["isOpened"]),
})`
  position: absolute;
  left: 0;
  top: 0;
  width: ${(props) => (props.isOpened ? "135px" : "0")};
  height: 100%;
  transition: width 0.3s ease;
  background-color: white;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
  overflow-y: auto;
  overflow-x: hidden;
  white-space: nowrap;
  z-index: 3;

  /* 커스텀 스크롤바 */
  &::-webkit-scrollbar {
    width: 10px;
  }
  &::-webkit-scrollbar-track {
    background-color: transparent;
    border-radius: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: ${(props) => props.theme.colors.textSelectedStrokeColor};
    border-radius: 4px;
  }
  &::-webkit-scrollbar-button {
    display: none;
  }
`;

export const ImageContainer = styled.div`
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const DraggableImage = styled.div`
  position: relative;
  width: 100px;
  height: 150px;
  border-radius: 7px;
  border: 2px solid ${(props) => (props.isSelected ? "#0070f3" : "#ccc")};
  box-shadow: ${(props) =>
    props.isSelected ? "0 0 10px rgba(0, 0, 0, 0.2)" : "none"};
  cursor: move;
  transition: border 0.2s ease, box-shadow 0.2s ease;
  background-color: transparent;
  display: flex;
  justify-content: center; /* 가로 중앙 정렬 */
  align-items: center; /* 세로 중앙 정렬 */

  img {
    display: block; /* 이미지 블록 요소로 변환 */
    margin: 0 auto; /* 가로 중앙 정렬 */
    width: 100%;
    height: auto;
  }
`;

export const PageNumber = styled.p`
  text-align: center;
  font-size: 12px;
  color: ${(props) => (props.isSelected ? "#0070f3" : "#000")};
  margin-top: 5px;
`;
