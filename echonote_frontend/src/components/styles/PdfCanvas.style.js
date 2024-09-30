import { styled } from "styled-components";

export const PdfCanvasContainer = styled.div.attrs((props) => ({
  style: {
    width: `${props.width}px`,
    height: `${props.height}px`,
    transform: `scale(${props.scale})`,
  },
}))`
  border: 1px solid;
  position: relative;
`;
