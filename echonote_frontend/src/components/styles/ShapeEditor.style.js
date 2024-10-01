// RecEditor.style.js
import styled from "styled-components";

export const StyledSVG = styled.svg`
  width: 100%;
  height: 100%;
  cursor: crosshair;
`;

export const StyledRectangle = styled.rect`
  fill: #348fc3;
  stroke: #000;
  stroke-width: 2;
  cursor: move;
  transition: transform 0.2s, fill 0.2s;

  &:hover {
    fill: #1e6b91; /* hover 시 색상 변경 */
    transform: scale(1.1); /* 약간 확대 */
  }
`;

export const CurrentRectangle = styled(StyledRectangle)`
  opacity: 0.5;
`;

export const ShapeContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;
