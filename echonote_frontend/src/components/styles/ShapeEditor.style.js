import styled from "styled-components";
import { shouldNotForwardPropsWithKeys } from "@shared/utils/shouldForwardProp";

// SVG 컨테이너
export const StyledSVG = styled.svg`
  width: 100%;
  height: 100%;
`;

// 사각형 스타일
export const StyledRectangle = styled.rect.attrs((props) => ({
  style: {
    x: props.x,
    y: props.y,
    width: props.width,
    height: props.height,
    fill: props.fill || "#348fc3",
    stroke: props.stroke || "#000",
    strokeWidth: props.strokeWidth || 2,
  },
}))`
  cursor: move;
  transition: transform 0.2s, fill 0.2s;

  &:hover {
    fill: ${({ hoverFillColor }) => hoverFillColor || "#1e6b91"};
    cursor: grab;
  }
`;

// 현재 그리는 사각형 스타일
export const CurrentRectangle = styled(StyledRectangle)`
  opacity: 0.5;
`;

// 원 스타일 추가
export const StyledCircle = styled.circle.attrs((props) => ({
  style: {
    cx: props.cx,
    cy: props.cy,
    r: props.r,
    fill: props.fill || "#348fc3",
    stroke: props.stroke || "#000",
    strokeWidth: props.strokeWidth || 2,
  },
}))`
  cursor: move;
  transition: transform 0.2s, fill 0.2s;

  &:hover {
    fill: ${({ hoverFillColor }) => hoverFillColor || "#1e6b91"};
    cursor: grab;
  }
`;

// 현재 그리는 원 스타일
export const CurrentCircle = styled(StyledCircle)`
  opacity: 0.5;
`;

// 컨테이너 스타일
export const ShapeContainer = styled.div.attrs((props) => ({
  style: {
    zIndex: props.$modeShape ? 2 : 1,
    cursor: props.$modeShape ? "crosshair" : "default",
  },
}))`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;

// 버튼 컨테이너 스타일
export const ButtonContainer = styled.div.attrs((props) => ({
  style: {
    top: `${props.$top}px`,
    left: `calc(${props.$left}px - 50px)`,
  },
}))`
  display: flex;
  gap: 5px;
  position: absolute;
  padding: 5px;
  transform: translateX(-50%);
  pointer-events: auto;
  z-index: 10;
`;
