import { useState } from "react";
import { FaPlayCircle, FaPauseCircle, FaStopCircle } from "react-icons/fa";
import { MdOutlineReplayCircleFilled } from "react-icons/md";
import {
  RecordingBarContainer,
  PlayPauseButton,
  StopReplayButton,
} from "@components/styles/RecordingBar.style";
import AudioWave from "@components/AudioWave";

const RecordingBar = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const audioUrl = "src/assets/test.wav";

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleSend = () => {
    setIsRecording(!isRecording);
    console.log("Recording sent");
  };

  return (
    <RecordingBarContainer>
      <PlayPauseButton onClick={togglePlayPause}>
        {isPlaying ? <FaPauseCircle /> : <FaPlayCircle />}
      </PlayPauseButton>
      <AudioWave audioUrl={audioUrl} isPlaying={isPlaying} />
      <StopReplayButton onClick={handleSend}>
        {isRecording ? <FaStopCircle /> : <MdOutlineReplayCircleFilled />}
      </StopReplayButton>
    </RecordingBarContainer>
  );
};

export default RecordingBar;
