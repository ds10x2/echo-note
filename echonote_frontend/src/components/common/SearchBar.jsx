import { useState, useRef, useEffect } from "react";
import {
  SearchContainer,
  SearchInput,
  SearchButton,
  SearchIconContainer,
} from "@components/common/SearchBar.style";
import { FaSearch } from "react-icons/fa";

const SearchBar = ({ onSearch }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(""); // 입력된 검색어 상태
  const [prevSearchTerm, setPrevSearchTerm] = useState(""); // 이전 검색어 상태
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
    onSearch(event.target.value); // 상위 컴포넌트에 검색어 전달
  };

  const handleSearch = () => {
    if (searchTerm.trim() === "") {
      setIsOpen(false); // 입력 필드가 비어 있으면 닫힘
    } else {
      console.log("Searching for:", searchTerm);
      setPrevSearchTerm(searchTerm); // 현재 검색어를 이전 검색어로 업데이트
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && searchTerm.trim() !== "" && searchTerm !== prevSearchTerm) {
      handleSearch();
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
                onChange={handleInputChange} // 입력 변경 시 상태 업데이트 및 상위 컴포넌트에 검색어 전달
                onKeyDown={handleKeyDown} // 엔터 키 입력 처리
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
