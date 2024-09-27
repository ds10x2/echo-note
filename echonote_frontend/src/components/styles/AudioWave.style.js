import styled from "styled-components";
import { shouldNotForwardPropsWithKeys } from "@shared/utils/shouldForwardProp";

export const AudioContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  position: relative;
`;

export const Timer = styled.span`
  font-size: 14px;
  color: ${(props) => props.theme.colors.recordButton};
  min-width: 50px;
  text-align: center;
`;

export const WaveContainer = styled.div`
  width: 100%;
  margin-left: 10px;
  margin-right: 5px;
`;

export const SpeedBarContainer = styled.div.withConfig({
  shouldForwardProp: shouldNotForwardPropsWithKeys(["visible"]),
})`
  display: flex;
  background-color: #d1d1d1;
  border-radius: 20px;
  width: 280px;
  position: absolute;
  bottom: 45px;
  left: 260px;

  opacity: ${(props) => (props.visible ? "1" : "0")};
  transform: ${(props) =>
    props.visible ? "translateY(0)" : "translateY(10px)"};
  transition: opacity 0.2s ease, transform 0.2s ease; /* 부드러운 전환 효과 */
`;

export const SpeedButton = styled.button`
  background-color: transparent;
  border: none;
  font-size: 15px;
  color: ${(props) => props.theme.colors.recordButton};
  cursor: pointer;
  display: flex;
  align-items: center;
  position: relative;
  gap: 3px;
`;

export const SpeedOption = styled.div`
  font-size: 14px;
  color: ${(props) =>
    props.selected
      ? props.theme.colors.textLightColor
      : props.theme.colors.textColor};
  background-color: ${(props) =>
    props.selected ? props.theme.colors.subDiscription : "transparent"};
  padding: 5px 15px;
  border-radius: 20px;
  cursor: pointer;

  &:hover {
    background-color: #666666;
    color: ${(props) => props.theme.colors.textLightColor};
  }
`;
