import styled from "styled-components";

export const STTContainer = styled.div`
  margin: 0;
  padding: 0;
  height: 550px; /* Desired height */
  overflow-y: scroll; /* Enable vertical scroll */
  -ms-overflow-style: none; /* Internet Explorer and Edge */
  scrollbar-width: none; /* Firefox */
  
  &::-webkit-scrollbar {
    width: 10px; /* Scrollbar width */
    opacity: 0; /* Default to transparent */
    transition: opacity 0.3s; /* Smooth transition effect */
  }

  &:hover::-webkit-scrollbar {
    opacity: 1; /* Show scrollbar on hover */
  }

  &::-webkit-scrollbar-thumb {
    background-color: #ccc; /* Scrollbar color */
    border-radius: 10px;
  }

  &::-webkit-scrollbar-track {
    background-color: #F1F5F9; /* Scrollbar track color */
    border-radius: 10px;
  }
`;

export const STTResultList = styled.ul`
  margin: 0;
  padding: 0;
`;

export const STTResultItem = styled.li`
  margin-bottom: 10px;
  padding-bottom: 10px;
  list-style-type: none;
`;

export const ResultLink = styled.a`
  text-decoration: none;
  color: cornflowerblue;

  &:hover {
    color: purple;
  }
`;

export const ResultText = styled.p`
  margin: 0;
  padding: 0;
  background-color: ${(props) => (props.$isEditMode ? "lightyellow" : "transparent")};
`;
