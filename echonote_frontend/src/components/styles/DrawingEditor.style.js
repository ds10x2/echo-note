import { styled } from "styled-components";

export const DrawingEditorContainer = styled.div`
  /* position: absolute; */
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
  border: 1px solid #ccc;
`;

export const DrawingToolContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 30px;
  max-width: 500px;
  padding: 10px;
  background-color: white;
  border-radius: 15px;
  box-shadow: 0 2px 3px rgba(65, 65, 65, 0.1);
  margin: 0 auto;
  position: absolute;
  bottom: 130px;
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

export const SliderPopup = styled.div`
  position: absolute;
  z-index: 9999;
  bottom: 60px;
  left: 0;
  background-color: white;
  padding: 10px;
  border-radius: 8px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  label {
    margin-bottom: 5px;
  }
  input[type="range"] {
    width: 150px;
  }
`;

/* 펜 슬라이더 팝업 */
export const PenSliderPopup = styled.div`
  position: absolute;
  z-index: 9999;
  bottom: 60px;
  left: 35px;
  background-color: white;
  padding: 10px;
  border-radius: 8px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  label {
    margin-bottom: 5px;
  }
  input[type="range"] {
    width: 150px;
  }
`;

/* 지우개 슬라이더 팝업 */
export const EraserSliderPopup = styled.div`
  position: absolute;
  z-index: 9999;
  bottom: 60px;
  left: 100px;
  background-color: white;
  padding: 10px;
  border-radius: 8px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  label {
    margin-bottom: 5px;
  }
  input[type="range"] {
    width: 150px;
  }
`;