import { styled } from "styled-components";
import { theme } from "@/shared/styles/theme";

export const PdfCanvasContainer = styled.div.attrs((props) => ({
  style: {
    width: `${props.width}px`,
    height: `${props.height}px`,
    transform: `scale(${props.scale})`,
  },
}))`
  position: relative;
  box-shadow: 0 0 10px ${theme.colors.pdfShadowColor};
  display: flex;
  justify-content: center;
  align-items: center;
`;
