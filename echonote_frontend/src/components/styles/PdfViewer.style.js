import { styled } from "styled-components";

export const PdfPage = styled.div.attrs((props) => ({
  style: {
    transform: `scale(${props.scale})`,
  },
}))`
  display: flex;
  position: absolute;
  z-index: 1;
  transform-origin: 0 0;
  max-width: 100%;
  max-height: 100%;
`;

export const PdfContainer = styled.div`
  display: flex;
  height: 100%;
  width: 100%;
  position: relative;
  padding: 10px;
  overflow: auto;
  align-items: center; /* 세로 방향으로 중앙 정렬 */
  justify-content: center; /* 가로 방향으로 중앙 정렬 */
  box-sizing: border-box; /* 패딩을 포함하여 계산 */
`;

export const EditorContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
`;

export const ButtonContainer = styled.div`
  display: flex;
  position: absolute;
  top: 0;
  right: 0;
  z-index: 2;
`;
