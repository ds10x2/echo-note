import { styled } from "styled-components";
import { theme } from "@/shared/styles/theme";

export const PdfPage = styled.div`
  display: flex;
  margin: auto;
  z-index: 1;
  position: relative;
`;

export const PdfContainer = styled.div`
  display: flex;
  overflow: auto;
  background-color: ${theme.colors.articleDivider};
`;
