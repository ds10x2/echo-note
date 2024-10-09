import styled from "styled-components";
import { shouldNotForwardPropsWithKeys } from "@shared/utils/shouldForwardProp";

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
  background: ${(props) => props.theme.colors.modalBackground};
  padding: 20px;
  border-radius: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  width: 210px;
  font-size: 12px;
  color: ${(props) => props.theme.colors.textLightColor};
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
  display: flex;
  justify-content: space-between; /* 양쪽 끝으로 정렬 */
  align-items: center; /* 세로 중앙 정렬 */
  font-size: 15px;
  margin-bottom: 15px;
`;

export const AnalyzedSection = styled.div`
  display: flex;
  gap: 5px;
  overflow-x: auto;
  white-space: nowrap;
  margin-bottom: 10px;

  /* 스크롤 바 감추기 */
  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
`;

export const BackgroundColorSection = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 5px;

  .color-option {
    width: 50px;
    height: 50px;
    background-color: black;
    border-radius: 4px;
    cursor: pointer;
  }

  .selected {
    border: 2px solid white;
  }
`;

export const ToggleContainer = styled.div`
  position: relative;
  cursor: pointer;

  > .toggle-container {
    width: 50px;
    height: 24px;
    border-radius: 30px;
    background-color: rgb(163, 163, 163);
  }
  > .toggle--checked {
    background-color: rgb(0, 200, 102);
    transition: 0.5s;
  }

  > .toggle-circle {
    position: absolute;
    top: 1px;
    left: 1px;
    width: 22px;
    height: 22px;
    border-radius: 50%;
    background-color: rgb(255, 254, 255);
    transition: 0.5s;
  }
  > .toggle--checked {
    left: 27px;
    transition: 0.5s;
  }
`;

export const TagButton = styled.button.withConfig({
  shouldForwardProp: shouldNotForwardPropsWithKeys(["isSelected"]),
})`
  border: 2px solid ${(props) => props.theme.colors.recordInActive};
  background-color: ${({ isSelected, theme }) =>
    isSelected ? theme.colors.recordActive : "transparent"};
  color: ${({ isSelected, theme }) =>
    isSelected ? theme.colors.white : theme.colors.recordInActive};
  border-radius: 20px;
  padding: 5px 10px;
  font-size: 14px;
  margin: 3px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: ${(props) => props.theme.colors.recordActive};
    color: white;
  }
`;
