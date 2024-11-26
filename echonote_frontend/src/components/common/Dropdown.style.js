import styled from "styled-components";
import { shouldNotForwardPropsWithKeys } from "@/shared/utils/shouldForwardProp";

export const DropdownContainer = styled.div`
  position: absolute;
  top: 100%;
  display: inline-block;
  z-index: 10;
`;

export const DropdownMenu = styled.ul`
  position: absolute;
  background-color: white;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin-top: 10px;
  padding: 10px 0;
  list-style: none;
  width: 100px;
  border-radius: 4px;
  z-index: 1;

  /* 최대 5개의 항목만 보이게 설정하고, 스크롤 처리 */
  max-height: 170px; /* 각 항목 높이를 40px으로 가정 */
  overflow-y: auto;

  /* 스크롤바 스타일링 */
  ::-webkit-scrollbar {
    width: 8px;
  }

  ::-webkit-scrollbar-thumb {
    background-color: rgba(0, 0, 0, 0.2);
    border-radius: 4px;
  }

  ::-webkit-scrollbar-track {
    background-color: rgba(0, 0, 0, 0.05);
  }
`;

// 드롭다운 아이템
export const DropdownItem = styled.li.withConfig({
  shouldForwardProp: (prop) => !["isSelected"].includes(prop), // isOpen만 필터링
})`
  padding: 10px 20px;
  cursor: pointer;
  white-space: nowrap;
  background-color: ${({ isSelected }) =>
    isSelected ? "#3498db" : "white"}; /* 선택된 항목은 파란색 */
  color: ${({ isSelected }) =>
    isSelected ? "white" : "black"}; /* 선택된 항목은 흰색 글씨 */

  &:hover {
    background-color: #f1f1f1;
  }
`;
