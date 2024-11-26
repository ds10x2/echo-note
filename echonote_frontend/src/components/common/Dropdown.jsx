import React, { useState, useRef, useEffect } from "react";
import * as St from "@components/common/Dropdown.style"; // 스타일 불러오기

const Dropdown = ({
  isOpen,
  setIsOpen,
  parentRef,
  options,
  onSelect,
  selectedOption,
}) => {
  const dropdownRef = useRef(null); // 드롭다운 DOM을 참조
  const selectedItemRef = useRef(null); // 선택된 아이템 참조

  const handleClickOutside = (e) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(e.target) &&
      parentRef.current &&
      !parentRef.current.contains(e.target)
    ) {
      setIsOpen(false); // 드롭다운 외부를 클릭하면 닫힘
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    // 드롭다운이 열리고, 선택된 아이템이 있을 때 해당 아이템으로 스크롤 이동
    if (isOpen && selectedItemRef.current) {
      selectedItemRef.current.scrollIntoView({ block: "nearest" });
    }
  }, [isOpen]);

  const handleItemClick = (option) => {
    onSelect(option);
    setTimeout(() => setIsOpen(false), 0);
  };

  return (
    <St.DropdownContainer ref={dropdownRef}>
      {isOpen && (
        <St.DropdownMenu>
          {/* 전달받은 options 배열을 map으로 렌더링 */}
          {options.map((option) => (
            <St.DropdownItem
              key={option}
              ref={option === selectedOption ? selectedItemRef : null} // 선택된 옵션에 ref 추가
              isSelected={option === selectedOption} // 선택된 옵션인지 확인
              onClick={() => handleItemClick(option)}
            >
              {option}
            </St.DropdownItem>
          ))}
        </St.DropdownMenu>
      )}
    </St.DropdownContainer>
  );
};

export default Dropdown;
