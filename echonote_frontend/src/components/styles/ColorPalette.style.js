import { styled } from "styled-components";

export const ColorPaletteContainer = styled.div`
  position: relative;
  display: inline-block;
`;

export const ColorSelectionBtn = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: ${(props) => props.color};  // RGBA 값 사용
  border: none;
  cursor: pointer;
`;

export const ColorPalette = styled.div`
  position: absolute;
  z-index: 2;
  bottom: 50px;
  left: 0;
  background-color: #fff;
  padding: 10px;
  border-radius: 8px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
`;
