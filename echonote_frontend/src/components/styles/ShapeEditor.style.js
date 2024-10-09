import styled from "styled-components";
import { theme } from "@/shared/styles/theme";
import { shouldNotForwardPropsWithKeys } from "@shared/utils/shouldForwardProp";

// SVG 컨테이너
export const StyledSVG = styled.svg`
  width: 100%;
  height: 100%;
`;

// 사각형 스타일
export const StyledRectangle = styled.rect
  .withConfig({
    shouldForwardProp: shouldNotForwardPropsWithKeys(["isSelected"]),
  })
  .attrs((props) => ({
    style: {
      x: props.x,
      y: props.y,
      width: props.width,
      height: props.height,
      fill: props.fill || "#348fc3",
      stroke: props.stroke || "none", // 기본적으로 선이 없는 경우 처리
      strokeWidth: props.strokeWidth || 0, // 선이 없을 경우 기본값
    },
  }))`
    cursor: move;
    transition: transform 0.2s, fill 0.2s;
  
    &:hover {
      fill: ${({ hoverFillColor }) => hoverFillColor || "#1e6b91"};
      cursor: grab;
    }
  
    ${({ isSelected }) =>
      isSelected &&
      `
      stroke: #000;  // 선택 시 항상 검정색 외곽선을 보여줌
      stroke-width: 2;
      stroke-dasharray: 4;
      stroke-linecap: round;
      transform: translate(-2px, -2px);
      width: calc(100% + 4px);
      height: calc(100% + 4px);
    `}
  `;

// 원 스타일
export const StyledCircle = styled.ellipse
  .withConfig({
    shouldForwardProp: shouldNotForwardPropsWithKeys(["isSelected"]),
  })
  .attrs((props) => ({
    style: {
      cx: props.cx,
      cy: props.cy,
      r: props.r,
      fill: props.fill || theme.colors.shapeFillDefaultColor,
      stroke: props.stroke || "none", // 기본적으로 선이 없는 경우 처리
      strokeWidth: props.strokeWidth || 0, // 선이 없는 경우 기본값
    },
  }))`
    cursor: move;
    transition: transform 0.2s, fill 0.2s;
  
    &:hover {
      fill: ${({ hoverFillColor }) => hoverFillColor || "#1e6b91"};
      cursor: grab;
    }
  
    ${({ isSelected }) =>
      isSelected &&
      `
      stroke: #000;  // 선택 시 검정색 외곽선 추가
      stroke-width: 2;
      stroke-dasharray: 4;
      stroke-linecap: round;
      transform: translate(-2px, -2px);
      r: calc(${(props) => props.r}px + 2px);  // 원의 반지름을 2px 늘림
    `}
  `;

// 현재 그리는 사각형 스타일
export const CurrentRectangle = styled(StyledRectangle)`
  opacity: 0.5;
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
