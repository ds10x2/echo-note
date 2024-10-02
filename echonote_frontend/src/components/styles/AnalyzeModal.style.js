import styled from "styled-components";

export const ModalBackdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1;
  animation: fadeOut 0.25s ease-out forwards;

  &.open {
    animation-name: fadeIn;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @keyframes fadeOut {
    from {
      opacity: 1;
    }
    to {
      opacity: 0;
    }
  }
`;

export const AnalyzeModalContainer = styled.div`
  position: absolute;
  background: #2d2d2d;
  padding: 20px;
  border-radius: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  width: 200px;
  color: white;
  animation: fadeOut 0.2s ease-out forwards;

  &.open {
    animation-name: fadeIn;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @keyframes fadeOut {
    from {
      opacity: 1;
    }
    to {
      opacity: 0;
    }
  }
`;

export const ModalHeader = styled.div`
  font-size: 15px;
  margin-bottom: 15px;
`;

export const AnalyzedSection = styled.div`
  display: flex;
  justify-content: space-around;
  margin-bottom: 20px;

  .direction-btn {
    background-color: #444;
    color: white;
    border-radius: 8px;
    padding: 10px 20px;
    border: none;
    cursor: pointer;
    font-size: 14px;
  }

  .active {
    background-color: #0066ff;
  }
`;

export const BackgroundColorSection = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 20px;

  .color-option {
    width: 50px;
    height: 50px;
    background-color: black;
    border-radius: 4px;
    margin: 0 5px;
    cursor: pointer;
  }

  .selected {
    border: 2px solid white;
  }
`;

export const ModalButton = styled.button`
  background-color: #444;
  color: white;
  border-radius: 8px;
  padding: 10px;
  border: none;
  cursor: pointer;
  width: 100%;
  margin-top: 20px;

  &:hover {
    background-color: #555;
  }
`;

export const ColorOption = styled.div`
  width: 50px;
  height: 50px;
  background-color: black; /* 기본값: 검은색 */
  border-radius: 4px;
  margin: 0 5px;
  cursor: pointer;

  &.selected {
    border: 2px solid white;
  }
`;
