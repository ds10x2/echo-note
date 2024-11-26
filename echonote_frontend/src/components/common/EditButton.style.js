import { styled } from "styled-components";
import { theme } from "@/shared/styles/theme";

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
