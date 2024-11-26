import { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
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
  const { currentIndex, setCurrentIndex, searchResults, setSearchResults } =
    useSearchStore();

  const handleSearchClick = () => {
    setIsOpen(true);
  };

  const handleClickOutside = (event) => {
    if (searchRef.current && !searchRef.current.contains(event.target)) {
      if (!searchTerm) {
        // searchTerm에 값이 없을 때만 닫기
        setIsOpen(false);
      }
    }
  };

  const handleArrowNavigation = (direction) => {
    if (direction === "up") {
      setCurrentIndex(
        currentIndex - 1 < 0 ? searchResults.length - 1 : currentIndex - 1
      );
    } else if (direction === "down") {
      setCurrentIndex((currentIndex + 1) % searchResults.length);
    }
  };

  const handleInputChange = (event) => {
    setSearchTerm(event.target.value); // 입력된 값 업데이트
    onSearch(event.target.value); // 상위 컴포넌트에 검색어 전달
  };

  const handleClearSearch = () => {
    if (!searchTerm) {
      setIsOpen(false);
    } else {
      setSearchTerm("");
      setCurrentIndex(0);
      setSearchResults([]);
    }
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
  }, [isOpen, searchTerm]);

  return (
    <SearchContainer ref={searchRef} isOpen={isOpen}>
      {isOpen && (
        <>
          <SearchInput
            placeholder="원하는 것을 검색해보세요"
            value={searchTerm}
            onChange={handleInputChange}
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
          {searchResults.length == 0 ? 0 : currentIndex + 1}/
          {searchResults.length}
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

SearchBar.propTypes = {
  onSearch: PropTypes.func.isRequired,
};

export default SearchBar;
