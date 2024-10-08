import { styled } from "styled-components";

export const DrawingEditorContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
`;

export const DrawingCanvasContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const DrawingToolContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  width: 100%;
  height: 30px;
  max-width: 500px;
  padding: 10px;
  background-color: white;
  border-radius: 15px;
  box-shadow: 0 2px 3px rgba(65, 65, 65, 0.1);
  margin: 0 auto;
  position: fixed;
  bottom: 50px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
`;

export const IconButton = styled.button`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: transparent;
  border: none;
  box-shadow: none;
  font-size: 1.2rem;
  cursor: pointer;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const SliderContainer = styled.div`
  position: absolute;
  z-index: 9999;
  bottom: 60px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const SliderIndicator = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  bottom: 100%;
  transform: translateY(-20px);
  border-radius: 50%;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  font-size: 14px;
  font-weight: bold;
  transform: translateX(-25px);
  margin-bottom: 5px;
`;

export const SliderPopup = styled.div`
  background-color: #ffffff;
  padding: 2px;
  border-radius: 8px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  transform: translateX(-25px);

  input[type="range"] {
    -webkit-appearance: none;
    appearance: none;
    width: 150px;
    height: 6px;
    background: #ddd;
    outline: none;
    opacity: 0.8;
    transition: opacity 0.2s;
    border-radius: 5px;

    &:hover {
      opacity: 1;
    }

    &::-webkit-slider-thumb {
      -webkit-appearance: none;
      appearance: none;
      width: 14px;
      height: 14px;
      border-radius: 50%;
      background: black;
      cursor: pointer;
      transition: background 0.2s;
    }

    &::-moz-range-thumb {
      width: 14px;
      height: 14px;
      border-radius: 50%;
      background: black;
      cursor: pointer;
      transition: background 0.2s;
    }
  }
`;

export const SliderButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 5px;
  margin: 0 5px;
  color: black;

  &:hover {
    color: gray;
  }
`;

export const Divider = styled.div`
  width: 1px;
  height: 24px;
  background-color: #d3d3d3;
  margin: 0 10px;
`;
