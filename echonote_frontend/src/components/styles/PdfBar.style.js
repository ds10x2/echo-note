import styled from "styled-components";
import { shouldNotForwardPropsWithKeys } from "@shared/utils/shouldForwardProp";

export const SidebarContainer = styled.div.withConfig({
  shouldForwardProp: shouldNotForwardPropsWithKeys(["isOpened"]),
})`
  position: absolute;
  display: flex;
  left: 0;
  top: 0;
  width: ${(props) => (props.isOpened ? "135px" : "0")};
  height: 700px;
  transition: width 0.3s ease;
  background-color: white;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
  overflow-y: auto; /* 세로 스크롤을 사이드바 안에서만 동작하도록 설정 */
  overflow-x: hidden;
  white-space: nowrap;
  z-index: 10; /* 툴바보다 낮은 z-index 값 설정 */

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
  display: grid;
  padding: 10px;
  gap: 20px;
  justify-content: center;
`;

export const PageNumber = styled.p`
  text-align: center;
  font-size: 12px;
  color: ${(props) => (props.isSelected ? "#0070f3" : "#000")};
  margin-top: 5px;
`;

export const DraggableImage = styled.div.withConfig({
  shouldForwardProp: shouldNotForwardPropsWithKeys(["isDragging", "isPressed"]),
})`
  position: relative;
  width: 100px;
  border-radius: 5px;
  // 드래그 중이거나 꾹 눌렀을 때 테두리 색 변경
  box-shadow: ${(props) =>
    props.isDragging ? "0 0 10px rgba(0, 0, 0, 0.2)" : "none"};
  transition: border 0.2s ease, box-shadow 0.2s ease;
  display: flex;
  justify-content: center;
  align-items: center;

  img {
    display: block;
    margin: 0 auto;
    width: 100%;
    height: auto;
    border-radius: 5px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
    border: 1px solid
      ${(props) =>
        props.isDragging || props.isPressed ? "#3700ff" : "transparent"};
  }
`;
