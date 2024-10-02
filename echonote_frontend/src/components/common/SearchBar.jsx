import { useState, useRef, useEffect } from "react";
import {
  SearchContainer,
  SearchInput,
  SearchButton,
  SearchIconContainer,
} from "@components/common/SearchBar.style";
import { FaSearch } from "react-icons/fa";

const SearchBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(""); // 입력된 검색어 상태
  const searchRef = useRef(null);

  const handleSearchClick = () => {
    setIsOpen(true);
  };

  const handleClickOutside = (event) => {
    if (searchRef.current && !searchRef.current.contains(event.target)) {
      setIsOpen(false); // 검색 바 외부를 클릭하면 닫힘
    }
  };

  const handleInputChange = (event) => {
    setSearchTerm(event.target.value); // 입력된 값 업데이트
  };

  const handleSearch = () => {
    console.log(searchTerm)
    if (searchTerm.trim() === "") {
      setIsOpen(false); // 입력 필드가 비어 있으면 닫힘
    } else {
      console.log("Searching for:", searchTerm);
      // 검색이 끝난 후 입력 필드를 닫고 싶으면 아래 주석을 해제하세요.
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
  }, [isOpen]);

  return (
    <SearchContainer ref={searchRef} isOpen={isOpen}>
      {isOpen && (
          <SearchInput
              placeholder="원하는 것을 검색해보세요"
              value={searchTerm} // 상태에 따라 입력 필드의 값 설정
              onChange={handleInputChange} // 입력 변경 시 상태 업데이트
              onBlur={handleSearch} // 입력 필드 외부 클릭 시 검색 수행
          />
      )}
      <SearchButton onClick={handleSearchClick}>
        <SearchIconContainer>
          <FaSearch />
        </SearchIconContainer>
      </SearchButton>
    </SearchContainer>
  );
};

export default SearchBar;
