import styled from "styled-components";
import { shouldNotForwardPropsWithKeys } from "@shared/utils/shouldForwardProp";

export const StyledSVG = styled.svg`
  width: 100%;
  height: 100%;
`;

export const StyledRectangle = styled.rect`
  fill: #348fc3;
  stroke: #000;
  stroke-width: 2;
  cursor: move;
  transition: transform 0.2s, fill 0.2s;

  &:hover {
    fill: #1e6b91; /* hover 시 색상 변경 */
    cursor: grab; /* 이동할 때 사용하는 커서로 변경 */
    transform: scale(1.1); /* 약간 확대 */
  }
`;

export const CurrentRectangle = styled(StyledRectangle)`
  opacity: 0.5;
`;

export const ShapeContainer = styled.div.withConfig({
  shouldForwardProp: shouldNotForwardPropsWithKeys(["modeShape"]),
})`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: ${({ modeShape }) =>
    modeShape ? 2 : 1}; /* mode.shape에 따라 z-index 설정 */
  cursor: ${({ modeShape }) =>
    modeShape ? "crosshair" : "default"}; /* mode.shape에 따라 커서 설정 */
`;
