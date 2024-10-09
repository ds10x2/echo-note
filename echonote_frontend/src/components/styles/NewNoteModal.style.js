import styled, { keyframes } from "styled-components";

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(-10px); /* 모달이 살짝 위에서 내려오는 느낌 */
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

// 모달이 사라질 때의 애니메이션
const fadeOut = keyframes`
  from {
    opacity: 1;
    transform: translateY(0);
  }
  to {
    opacity: 0;
    transform: translateY(-10px);
  }
`;

// 배경이 불투명하게 처리된 모달 뒷배경 스타일
export const ModalBackdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999; /* 최상위에 나타나게 설정 */

  animation: ${({ isClosing }) => (isClosing ? fadeOut : fadeIn)} 0.3s ease-out;
`;

// 모달 컨테이너 스타일
export const ModalContainer = styled.div`
  background-color: #fff;
  width: 400px;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

// 모달 헤더 스타일
export const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  h2 {
    font-size: 20px;
    font-weight: bold;
  }

  button {
    background: none;
    border: none;
    cursor: pointer;
  }
`;

// 모달 내용 스타일
export const ModalContent = styled.div`
  p {
    margin-bottom: 20px;
    font-size: 14px;
    color: #666;
  }

  .options {
    display: flex;
    justify-content: space-between;
  }
`;

// 옵션 선택 버튼과 이미지 스타일
export const ModalOption = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  cursor: pointer;

  img {
    width: 100px;
    height: 150px;
    object-fit: cover;
    border-radius: 5px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  }

  p {
    font-size: 14px;
  }
`;

export const OptionButton = styled.div`
  width: 24px;
  height: 24px;
  border: 2px solid ${(props) => (props.selected ? "#ff6347" : "#ddd")};
  border-radius: 50%;
  background-color: ${(props) => (props.selected ? "#ff6347" : "transparent")};
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: ${(props) => (props.selected ? "#ff6347" : "#f5f5f5")};
  }
`;

// 모달 푸터 스타일
export const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;

  button {
    background-color: #007bff;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;
    font-size: 14px;
    transition: background-color 0.3s ease;

    &:hover {
      background-color: #0056b3;
    }
  }
`;
