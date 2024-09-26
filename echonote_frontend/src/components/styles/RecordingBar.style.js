import styled from "styled-components";

export const RecordingBarContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  max-width: 500px;
  padding: 10px;
  background-color: white;
  border-radius: 20px;
  box-shadow: 0 2px 3px rgba(65, 65, 65, 0.1);
  margin: 0 auto;
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
`;

export const PlayPauseButton = styled.button`
  border: none;
  background-color: transparent;
  color: ${(props) => props.theme.colors.recordButton};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 27px;
`;

export const StopReplayButton = styled.button`
  border: none;
  background-color: transparent;
  color: ${(props) => props.theme.colors.recordButton};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 29px;
`;

export const IconButton = styled.button`
  background: none;
  border: none;
  color: #ccc;
  cursor: pointer;
  font-size: 16px;
  padding: 0 5px;

  &:hover {
    color: #007bff;
  }
`;
