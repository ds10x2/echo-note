// RecEditor.style.js
import styled from "styled-components";

export const StyledSVG = styled.svg`
  border: 1px solid #ccc;
  width: 800px;
  height: 600px;
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
