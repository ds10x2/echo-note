import { styled } from "styled-components";
import { theme } from "@/shared/styles/theme";

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

export const Button = styled.button`
  background-color: ${theme.colors.editButtonColor};
  padding: 1px 10px;
  width: 56px;
  height: 20px;
  border-radius: 12px;
  border: 1px solid ${theme.colors.editButtonBorderColor};
  color: ${theme.colors.textColor};
  font-size: xx-small;

  &:hover {
    background-color: ${theme.colors.backgroundColor};
    cursor: pointer;
  }
`;
