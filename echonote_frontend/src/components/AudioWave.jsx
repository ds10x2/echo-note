import { useRef, useState, useEffect } from "react";
import { useWavesurfer } from "@wavesurfer/react";
import { RiSpeedFill } from "react-icons/ri";
import PropTypes from "prop-types";
import {
  Timer,
  WaveContainer,
  SpeedBarContainer,
  SpeedButton,
  SpeedOption,
  AudioContainer,
} from "@components/styles/AudioWave.style";

const AudioWave = ({ audioUrl, isPlaying }) => {
  const containerRef = useRef(null);
  const speedButtonRef = useRef(null);
  const speedBarRef = useRef(null);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [speedBarVisible, setSpeedBarVisible] = useState(false);

  const playbackRates = [1, 1.25, 1.5, 1.75, 2];

  const { wavesurfer, isReady, currentTime } = useWavesurfer({
    container: containerRef,
    height: 30,
    barHeight: 5,
    barWidth: 2,
    waveColor: "rgb(138, 111, 211)",
    progressColor: "rgb(89, 39, 226)",
    cursorWidth: 1,
    barRadius: 5,
    url: audioUrl,
  });

  // AudioContext가 중단되었을 경우 이를 재개하는 함수
  const resumeAudioContext = async () => {
    if (wavesurfer && wavesurfer.backend && wavesurfer.backend.ac) {
      // AudioContext가 suspended 상태인지 확인
      if (wavesurfer.backend.ac.state === "suspended") {
        await wavesurfer.backend.ac.resume();
      }
    }
  };
  const handleSpeedChange = (speed) => {
    setPlaybackRate(speed);
    if (wavesurfer) {
      wavesurfer.setPlaybackRate(speed);
    }
    setSpeedBarVisible(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      // SpeedButton이나 SpeedBarContainer 외부를 클릭했을 때 배속 바 닫기
      if (
        speedButtonRef.current &&
        !speedButtonRef.current.contains(event.target) &&
        speedBarRef.current &&
        !speedBarRef.current.contains(event.target)
      ) {
        setSpeedBarVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (isReady && wavesurfer) {
      resumeAudioContext();
      if (isPlaying) {
        wavesurfer.play();
      } else {
        wavesurfer.pause();
      }
    }
  }, [isPlaying, isReady, wavesurfer]);

  return (
    <AudioContainer>
      <WaveContainer ref={containerRef} />
      <Timer>{new Date(currentTime * 1000).toISOString().substr(14, 5)}</Timer>
      <SpeedButton
        ref={speedButtonRef}
        onClick={() => setSpeedBarVisible(!speedBarVisible)}
      >
        <RiSpeedFill />
        {`${playbackRate}`}
      </SpeedButton>

      <SpeedBarContainer ref={speedBarRef} visible={speedBarVisible}>
        {playbackRates.map((rate) => (
          <SpeedOption
            key={rate}
            selected={playbackRate === rate}
            onClick={() => handleSpeedChange(rate)}
          >
            {`${rate}X`}
          </SpeedOption>
        ))}
      </SpeedBarContainer>
    </AudioContainer>
  );
};

AudioWave.propTypes = {
  audioUrl: PropTypes.string.isRequired,
  isPlaying: PropTypes.bool.isRequired,
};

export default AudioWave;
