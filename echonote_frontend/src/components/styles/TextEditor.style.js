import { styled } from "styled-components";
import { shouldNotForwardPropsWithKeys } from "@shared/utils/shouldForwardProp";
import { theme } from "@/shared/styles/theme";

export const TextContainer = styled.div.withConfig({
  shouldForwardProp: shouldNotForwardPropsWithKeys(["mode"]),
})`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: ${({ mode }) => (mode ? 2 : 1)}; /* mode.shape에 따라 z-index 설정 */
`;

export const TextBox = styled.div
  .withConfig({
    shouldForwardProp: shouldNotForwardPropsWithKeys([
      "isDragging",
      "isEditing",
      "minWidth",
    ]),
  })
  .attrs((props) => ({
    style: {
      left: `${props.x}px`,
      top: `${props.y}px`,
      cursor: props.isEditing ? "text" : "move",
      backgroundColor: props.isEditing
        ? `${theme.colors.textEditBackground}`
        : "transparent",
    },
  }))`
  position: absolute;
  padding: 4px;
  z-index: 1;
  border: ${({ isDragging }) =>
    isDragging ? `1px solid ${theme.colors.textSelectedStrokeColor}` : "none"};
  border-radius: 3px;
  background-color: ${({ isDragging, isEditing }) =>
    isDragging
      ? "rgba(173, 216, 230, 0.5)"
      : isEditing
      ? `${theme.colors.textEditBackground}`
      : "transparent"};
  transition: border 0.2s, background-color 0.2s;
  user-select: none;
  min-width: ${({ minWidth }) => minWidth}px; 
`;

export const TextArea = styled.textarea`
  font-size: ${({ fontSize }) => fontSize || 16}px;
  border: 1px solid ${theme.colors.textSelectedStrokeColor};
  background-color: ${theme.colors.textEditBackground};
  padding: 4px;
  outline: none;
  resize: none;
  user-select: none;
  border-radius: 4px;
  line-height: 1.5;
  width: ${({ minWidth }) => (minWidth ? `${minWidth}px` : "100%")};
  min-width: ${({ minWidth }) => (minWidth ? `${minWidth}px` : "150px")};
  transition: all 0.2s ease-in-out;

  &:focus {
    border-color: ${theme.colors.textFocusedStrokeColor};
    box-shadow: 0 0 5px ${theme.colors.pdfShadowColor};
    backdrop-filter: blur(5px);
  }
`;

export const TextDetail = styled.div`
  white-space: pre-wrap;
  font-size: ${({ fontSize }) => fontSize}px;
`;

export const ButtonContainer = styled.div`
  display: flex;
  gap: 5px;
  position: absolute;
  top: 100%; /* 텍스트박스 바로 아래에 버튼 배치 */
  left: 50%;
  transform: translateY(5px);
  transform: translateX(-50%);
  padding: 5px;
  z-index: 3;
`;
