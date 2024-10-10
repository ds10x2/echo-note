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
      "isSelected",
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
  background-color: ${({ isDragging, isEditing }) =>
    isDragging
      ? "rgba(173, 216, 230, 0.5)"
      : isEditing
      ? `${theme.colors.textEditBackground}`
      : "transparent"};
  transition: border 0.2s, background-color 0.2s;
  user-select: none;
  min-width: ${({ minWidth }) => minWidth}px;

  ${({ isSelected }) =>
    isSelected &&
    `
      border: 1px solid ${theme.colors.textSelectedStrokeColor};
      border-radius: 2px;
      box-shadow: 0 0 3px ${theme.colors.textSelectedStrokeColor};
      animation: subtlePulse 1.5s infinite;
    `}

  @keyframes subtlePulse {
    0% {
      box-shadow: 0 0 2px ${theme.colors.textSelectedStrokeColor};
    }
    50% {
      box-shadow: 0 0 4px ${theme.colors.textSelectedStrokeColor};
    }
    100% {
      box-shadow: 0 0 6px ${theme.colors.textSelectedStrokeColor};
    }
  }
`;

export const TextArea = styled.textarea`
  font-size: ${({ fontSize }) => fontSize || 16}px;
  padding: 4px;
  background-color: transparent;
  resize: none;
  user-select: none;
  border: 1px dotted #000; /* 점선 외곽선 */
  outline: none; /* 기본 외곽선 제거 */
  border-radius: 4px;
  line-height: 1.5;
  transition: all 0.2s ease-in-out;
  min-width: 200px;
  min-height: ${({ fontSize }) => fontSize || 16}px;
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
