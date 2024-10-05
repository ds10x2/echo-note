import styled from "styled-components";

export const ModalBackdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1;
  animation: fadeOut 0.2s ease-out forwards; // 닫기 애니메이션

  &.open {
    animation-name: fadeIn; // 열기 애니메이션
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @keyframes fadeOut {
    from {
      opacity: 1;
    }
    to {
      opacity: 0;
    }
  }
`;

export const ModalContainer = styled.div`
  position: absolute;
  background: ${(props) => props.theme.colors.modalBackground};
  padding: 20px;
  border-radius: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  width: 220px;
  color: ${(props) => props.theme.colors.textLightColor};
  animation: fadeOut 0.2s ease-out forwards; // 닫기 애니메이션

  &.open {
    animation-name: fadeIn; // 열기 애니메이션
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @keyframes fadeOut {
    from {
      opacity: 1;
    }
    to {
      opacity: 0;
    }
  }
`;

export const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
`;

export const ModalButton = styled.button`
  background: transparent;
  border: 1px solid #757575;
  border-radius: 8px;
  padding: 10px;
  color: white;
  cursor: pointer;
  width: 100px;

  &:hover {
    background: #444;
  }
`;

export const ModalList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const ModalItem = styled.div`
  padding: 10px;
  background: #3b3b3b;
  border-radius: 8px;
  cursor: pointer;

  &:hover {
    background: #4a4a4a;
  }
`;
