import { styled } from "styled-components";
import { shouldNotForwardPropsWithKeys } from "@/shared/utils/shouldForwardProp";

export const PdfEditorContainer = styled.div
  .withConfig({
    shouldForwardProp: shouldNotForwardPropsWithKeys(["originalSize", "mode"]),
  })
  .attrs((props) => ({
    style: {
      width: `${props.originalSize.width}px`,
      height: `${props.originalSize.height}px`,
      transform: `scale(${props.scale})`,
    },
  }))`
  position: absolute;
  top: 0;
  left: 0;
  transform-origin: top left; 
  z-index: ${({ mode }) => (!mode ? 2 : 1)};
`;
