import styled from "styled-components";
import { shouldNotForwardPropsWithKeys } from "@shared/utils/shouldForwardProp";

export const STTBarContainer = styled.div.withConfig({
  shouldForwardProp: shouldNotForwardPropsWithKeys(["isOpened"]),
})`
  position: absolute;
  right: 0;
  top: 0;
  height: 100%;
  width: ${(props) => (props.isOpened ? "300px" : "0")}; // 너비를 줄이면서 닫기
  background-color: white;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
  overflow: hidden; // 부모 너비가 줄어들 때 내부 콘텐츠가 잘리도록
  transition: width 0.3s ease; // 부드럽게 너비가 변화
`;

// 헤더 스타일
export const STTBarHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  background-color: white;
  border-bottom: 1px solid #ccc;
`;

// 검색 바가 위치하는 행 스타일
export const STTBarSearchRow = styled.div`
  display: flex;
  align-items: center;
  padding: 10px;
  width: 100%;
  box-sizing: border-box;
  background-color: ${(props) => props.theme.colors.backgroundColor};
  justify-content: end; // 검색 바를 중앙에 정렬
`;

// ToggleSwitch 및 IconButton 스타일 유지

export const ToggleSwitch = styled.div.withConfig({
  shouldForwardProp: shouldNotForwardPropsWithKeys(["isToggled"]),
})`
  position: relative;
  width: 50px;
  height: 25px;
  background-color: ${(props) => (props.isToggled ? "#4cd137" : "#ccc")};
  border-radius: 25px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:before {
    content: "";
    position: absolute;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background-color: white;
    top: 2.5px;
    left: ${(props) => (props.isToggled ? "calc(100% - 22.5px)" : "2.5px")};
    transition: left 0.3s ease;
  }
`;

export const IconButton = styled.button`
  background: transparent;
  border: none;
  font-size: 18px;
  cursor: pointer;
  display: flex;
  align-items: center;
`;

export const Divider = styled.div`
  height: 1px;
  background-color: #ccc;
`;

export const STTBarContent = styled.div.withConfig({
  shouldForwardProp: shouldNotForwardPropsWithKeys(["isOpened"]),
})`
  opacity: ${(props) => (props.isOpened ? "1" : "0")};
  transition: opacity 0.3s ease;
  height: 100%;
  padding: 20px;
  visibility: ${(props) => (props.isOpened ? "visible" : "hidden")};
`;
