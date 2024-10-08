import { styled } from "styled-components";
import { theme } from "@/shared/styles/theme";
import { shouldNotForwardPropsWithKeys } from "@shared/utils/shouldForwardProp";

export const DrawingToolContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 30px;
  max-width: 350px;
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
export const ToolBarButton = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 14px;
`;

export const IconContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 14px;
`;

export const IconButton = styled.div
  .withConfig({
    shouldForwardProp: (prop) => !["isActive"].includes(prop), // isActive만 필터링
  })
  .attrs((props) => ({
    style: {
      backgroundColor: props.isActive
        ? theme.colors.selectedIconBackground
        : "transparent",
      color: props.color ? props.color : theme.colors.iconColor,
    },
  }))`
  border: none;
  border-radius: 15px;
  cursor: pointer;
  font-size: 18px;
  padding: 6px;
`;

export const ToggleButton = styled.div
  .withConfig({
    shouldForwardProp: (prop) => !["isActive"].includes(prop), // isActive만 필터링
  })
  .attrs((props) => ({
    style: {
      backgroundColor: props.isActive
        ? theme.colors.selectedIconBackground
        : "transparent",
      color: props.isActive ? theme.colors.iconHover : theme.colors.iconColor,
    },
  }))`

  border: none;
  border-radius: 15px;

  cursor: pointer;
  font-size: 18px;
  padding: 6px;
`;

export const IconIndex = styled.div`
  background-color: transparent;
  color: ${theme.colors.iconColor};
  border: none;
  cursor: pointer;
  font-size: 16px;
`;

export const Divider = styled.div`
  width: 1px;
  height: 24px;
  background-color: #d3d3d3;
  margin: 0 10px;
`;

// 공통 슬라이더 스타일 적용
const CommonSliderPopup = styled.div`
  position: absolute;
  z-index: 9999;
  bottom: 60px;
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
    -webkit-appearance: none;
    appearance: none;
    width: 150px;
    height: 6px;
    background: #ddd;
    outline: none;
    opacity: 0.7;
    transition: opacity 0.2s;

    &:hover {
      opacity: 1;
    }

    &::-webkit-slider-thumb {
      -webkit-appearance: none;
      appearance: none;
      width: 16px;
      height: 16px;
      border-radius: 50%;
      background: black;
      cursor: pointer;
      margin-top: -5px;
      transition: background 0.2s;
    }

    &::-moz-range-thumb {
      width: 16px;
      height: 16px;
      border-radius: 50%;
      background: black;
      cursor: pointer;
      transition: background 0.2s;
    }

    &::-webkit-slider-runnable-track {
      background: linear-gradient(black, black) no-repeat center;
      height: 6px;
      border-radius: 3px;
    }
  }
`;

//폰트 사이즈, 도형 색상 열고 닫는용
export const ToolBarIconContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

// 폰트, 도형 애니메이션
export const ToolBarIconDetail = styled.div.withConfig({
  shouldForwardProp: (prop) => !["isOpen"].includes(prop),
})`
  max-width: ${(props) => (props.isOpen ? "80px" : "0")};
  opacity: ${(props) => (props.isOpen ? "1" : "0")};
  transform-origin: left;
  transition: max-width 0.5s ease, opacity 0.5s ease, visibility 0.5s ease;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: left;
  margin-left: ${(props) => (props.isOpen ? "5px" : "0")};
`;

export const ColorPalette = styled.div`
  position: absolute;
  z-index: 100;
  bottom: 70px;
  left: 50%;
  transform: translateX(-50%);
  background-color: #fff;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const ColorPaletteContainer = styled.div`
  position: relative;
  display: inline-block;
`;

export const PropertyContainer = styled.div`
  width: 90%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 10px 0;
`;

export const PropertyTitle = styled.h1`
  font-size: 16px;
  padding: 0;
  margin: 0;
`;

export const PropertyText = styled.h5`
  font-size: 12px;
  padding: 0;
  margin: 0;
`;

export const AnimatedContainer = styled.div.withConfig({
  shouldForwardProp: shouldNotForwardPropsWithKeys(["isVisible"]),
})`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  overflow: ${({ isVisible }) => (isVisible ? "none" : "hidden")};
  position: relative;
  max-height: ${({ isVisible }) =>
    isVisible ? "500px" : "0"}; /* 높이 애니메이션 */
  opacity: ${({ isVisible }) => (isVisible ? 1 : 0)}; /* 투명도 애니메이션 */
  transition: max-height 0.4s ease, opacity 0.4s ease; /* 부드러운 애니메이션 적용 */
  transform-origin: top;
`;
