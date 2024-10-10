import styled from "styled-components";

export const LoadingIconContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: auto;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  max-width: 300px;
`;

export const LoadingText = styled.h3`
  width: 300px;
  text-align: center;
`;
