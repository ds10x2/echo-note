import { styled } from "styled-components";

export const ColorPaletteContainer = styled.div`
  position: relative;
  display: inline-block;
`;

export const ColorSelectionBtn = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: ${(props) => props.color};
  border: none;
  cursor: pointer;
`;

export const ColorPalette = styled.div`
  position: absolute;
  z-index: 2;
  bottom: 70px;
  left: 0;
  background-color: #fff;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
`;
