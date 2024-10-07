import { useState, useRef, useEffect } from "react";
import {
  SearchContainer,
  SearchInput,
  SearchButton,
  SearchIconContainer,
  SearchResultCount,
  SearchControlIcons,
  SearchArrowIcon,
  SearchCloseIcon,
} from "@components/common/SearchBar.style";
import { FaSearch } from "react-icons/fa";
import { IoIosArrowUp, IoIosArrowDown, IoIosClose } from "react-icons/io";
import { useSearchStore } from "@stores/sideBarStore";

const SearchBar = ({ onSearch }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(""); // 입력된 검색어 상태
  const searchRef = useRef(null);
  const { currentIndex, setCurrentIndex, searchResults } = useSearchStore();

  const handleSearchClick = () => {
    setIsOpen(true);
  };

  const handleClickOutside = (event) => {
    if (searchRef.current && !searchRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  const handleInputChange = (event) => {
    setSearchTerm(event.target.value); // 입력된 값 업데이트
    onSearch(event.target.value); // 상위 컴포넌트에 검색어 전달
  };

  const handleArrowNavigation = (direction) => {
    if (direction === "up") {
      setCurrentIndex(Math.max(currentIndex - 1, 0));
    } else if (direction === "down") {
      setCurrentIndex(Math.min(currentIndex + 1, searchResults.length - 1));
    }
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    setIsOpen(false);
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("click", handleClickOutside, true);
    } else {
      document.removeEventListener("click", handleClickOutside, true);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, [isOpen]);

  return (
    <SearchContainer ref={searchRef} isOpen={isOpen}>
      {isOpen && (
        <>
          <SearchInput
            placeholder="원하는 것을 검색해보세요"
            value={searchTerm} // 상태에 따라 입력 필드의 값 설정
            onChange={handleInputChange} // 입력 변경 시 상태 업데이트 및 상위 컴포넌트에 검색어 전달
          />
        </>
      )}
      {!searchTerm && !isOpen ? (
        <SearchButton onClick={handleSearchClick}>
          <SearchIconContainer>
            <FaSearch />
          </SearchIconContainer>
        </SearchButton>
      ) : (
        <SearchResultCount>
          {currentIndex}/{searchResults.length}
          <SearchControlIcons>
            <SearchArrowIcon onClick={() => handleArrowNavigation("up")}>
              <IoIosArrowUp />
            </SearchArrowIcon>
            <SearchArrowIcon onClick={() => handleArrowNavigation("down")}>
              <IoIosArrowDown />
            </SearchArrowIcon>
            <SearchCloseIcon onClick={handleClearSearch}>
              <IoIosClose />
            </SearchCloseIcon>
          </SearchControlIcons>
        </SearchResultCount>
      )}
    </SearchContainer>
  );
};

export default SearchBar;
