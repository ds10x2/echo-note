import { styled } from "styled-components";

export const TextContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
`;

export const TextBox = styled.div.attrs((props) => ({
  style: {
    left: `${props.x}px`,
    top: `${props.y}px`,
    cursor: props.isEditing ? "text" : "move",
    backgroundColor: props.isEditing
      ? "rgba(255, 255, 255, 0.8)"
      : "transparent",
  },
}))`
  position: absolute;
  padding: 2px;
  z-index: 1;
  border: ${({ isDragging }) =>
    isDragging ? "2px solid blue" : "1px solid transparent"};
  background-color: ${({ isDragging, isEditing }) =>
    isDragging
      ? "rgba(173, 216, 230, 0.5)"
      : isEditing
      ? "rgba(255, 255, 255, 0.8)"
      : "transparent"};
  transition: border 0.2s, background-color 0.2s;
  user-select: none;
`;

export const TextArea = styled.textarea`
  font-size: 16px;
  border: 1px solid #ddd;
  background-color: transparent;
  resize: none;
  padding: 2px;
  outline: none;
  user-select: none;
`;

export const TextDetail = styled.div`
  white-space: pre-wrap;
  font-size: ${({ fontSize }) => fontSize}px;
`;