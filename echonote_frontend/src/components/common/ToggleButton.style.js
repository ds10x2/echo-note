import styled from "styled-components";
import { theme } from "@/shared/styles/theme";
import { shouldNotForwardPropsWithKeys } from "@shared/utils/shouldForwardProp";

export const ToggleContainer = styled.div.withConfig({
  shouldForwardProp: shouldNotForwardPropsWithKeys(["isOn"]),
})`
  position: relative;
  width: 44px;
  height: 18px;
  border-radius: 15px;
  background-color: ${({ isOn, theme }) =>
    isOn ? theme.colors.iconHover : theme.colors.toggleButtonOff};
  padding: 3px;
  cursor: pointer;
  transition: background-color 0.3s;
`;

export const Toggle = styled.div.withConfig({
  shouldForwardProp: shouldNotForwardPropsWithKeys(["isOn"]),
})`
  position: absolute;
  top: 50%; /* 상단에서 50% 위치 */
  left: ${({ isOn }) =>
    isOn
      ? "calc(100% - 19px)"
      : "3px"}; /* 오른쪽으로 이동할 때 100%에서 여유분 계산 */
  transform: translateY(-50%); /* 세로 중앙 정렬 */
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background-color: white;
  transition: left 0.3s;
`;
