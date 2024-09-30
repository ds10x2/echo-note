import { styled } from "styled-components";

export const PdfContainer = styled.div`
  display: flex;
  position: relative;
`;

export const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 50%;
  left: -50%;
  z-index: 2;
`;
