import styled from "styled-components";
import { shouldNotForwardPropsWithKeys } from "@shared/utils/shouldForwardProp";

export const StyledSVG = styled.svg`
  width: 100%;
  height: 100%;
`;

export const StyledRectangle = styled.rect.attrs((props) => ({
  fill: props.fill || "#348fc3",
  stroke: props.stroke || "#000",
  strokeWidth: props.strokeWidth || 2,
}))`
  cursor: move;
  transition: transform 0.2s, fill 0.2s;

  &:hover {
    fill: ${({ hoverFillColor }) => hoverFillColor || "#1e6b91"};
    cursor: grab;
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
  z-index: ${({ modeShape }) => (modeShape ? 2 : 1)};
  cursor: ${({ modeShape }) => (modeShape ? "crosshair" : "default")};
`;
