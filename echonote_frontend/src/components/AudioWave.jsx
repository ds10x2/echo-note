import { useRef, useState, useEffect, useMemo } from "react";
import { useWavesurfer } from "@wavesurfer/react";
import RecordPlugin from "wavesurfer.js/dist/plugins/record.esm.js";
import { FaPlayCircle, FaPauseCircle, FaStopCircle } from "react-icons/fa";
import { MdOutlineReplayCircleFilled } from "react-icons/md";
import { PiRecordFill, PiRecordBold } from "react-icons/pi";
import { RiSpeedFill } from "react-icons/ri";
import {
  Timer,
  WaveContainer,
  SpeedBarContainer,
  SpeedButton,
  SpeedOption,
  AudioContainer,
  PlayPauseButton,
  StopReplayButton,
} from "@components/styles/AudioWave.style";

const AudioWave = () => {
  const containerRef = useRef(null);
  const speedButtonRef = useRef(null);
  const speedBarRef = useRef(null);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [speedBarVisible, setSpeedBarVisible] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null); // 녹음 파일이 없으면 null
  const [recordTime, setRecordTime] = useState(0);
  const playbackRates = [1, 1.25, 1.5, 1.75, 2];

  const { wavesurfer, currentTime } = useWavesurfer({
    container: containerRef,
    height: 30,
    width: audioUrl ? 300 : 350,
    barHeight: 1,
    barWidth: 2,
    waveColor: "rgb(138, 111, 211)",
    progressColor: "rgb(89, 39, 226)",
    cursorWidth: 1,
    barRadius: 5,
    url: audioUrl || null,
    minPxPerSec: 30,
    hideScrollbar: true,
    plugins: useMemo(() => [], []),
  });

  const record = useMemo(() => {
    if (wavesurfer) {
      const recPlugin = wavesurfer.registerPlugin(
        RecordPlugin.create({
          renderRecordedAudio: true,
          cursorWidth: 0,
          barHeight: 5,
        })
      );

      recPlugin.on("record-progress", (time) => {
        setRecordTime(time / 1000);
      });

      recPlugin.on("record-end", (blob) => {
        if (blob.size === 0) {
          console.error("Recording failed: Blob is empty.");
          return;
        }

        const recordedUrl = URL.createObjectURL(blob);
        setAudioUrl(recordedUrl);
        setIsRecording(false);
      });

      return recPlugin;
    }
  }, [wavesurfer]);

  // 음성이 끝까지 재생되면 자동으로 isPlaying을 false로 설정
  useEffect(() => {
    if (wavesurfer) {
      wavesurfer.on("finish", () => {
        setIsPlaying(false);
      });
    }
    return () => {
      if (wavesurfer) {
        wavesurfer.un("finish");
      }
    };
  }, [wavesurfer]);

  const togglePlayPause = () => {
    if (!wavesurfer) return;
    setIsPlaying(!isPlaying);
    wavesurfer.playPause();
  };

  const toggleStartStop = () => {
    if (record.isPaused()) {
      record.resumeRecording();
    } else if (record.isRecording()) {
      record.pauseRecording();
    } else {
      handleStartStopRecording();
    }

    setIsRecording(!isRecording);
  };

  const handleStartStopRecording = async () => {
    try {
      // 마이크 접근 권한 요청
      // await navigator.mediaDevices.getUserMedia({ audio: true });

      // 장치 탐색
      const devices = await RecordPlugin.getAvailableAudioDevices();
      const deviceId = devices[0]?.deviceId;

      if (isRecording) {
        if (recordTime < 1) {
          console.error("Recording too short, please record longer.");
          return;
        }
        record.stopRecording();
      } else {
        setAudioUrl(null);
        setRecordTime(0);
        record.startRecording({ deviceId });
      }
    } catch (error) {
      console.error("Error accessing microphone or starting recording", error);
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
    return () => {
      if (wavesurfer) {
        wavesurfer.destroy();
      }
    };
  }, [wavesurfer]);

  return (
    <AudioContainer>
      {audioUrl ? (
        <PlayPauseButton onClick={togglePlayPause}>
          {isPlaying ? <FaPauseCircle /> : <FaPlayCircle />}
        </PlayPauseButton>
      ) : (
        <PlayPauseButton onClick={toggleStartStop}>
          {isRecording ? <PiRecordFill /> : <PiRecordBold />}
        </PlayPauseButton>
      )}

      <WaveContainer ref={containerRef} />

      <Timer>
        {new Date((!audioUrl ? recordTime : currentTime) * 1000)
          .toISOString()
          .substring(14, 19)}
      </Timer>
      {audioUrl && (
        <>
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
        </>
      )}
      <StopReplayButton onClick={handleStartStopRecording}>
        {audioUrl ? <MdOutlineReplayCircleFilled /> : <FaStopCircle />}
      </StopReplayButton>
    </AudioContainer>
  );
};

export default AudioWave;
