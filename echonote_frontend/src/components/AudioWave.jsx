import { useRef, useState, useEffect, useMemo } from "react";
import { useWavesurfer } from "@wavesurfer/react";
import RecordPlugin from "wavesurfer.js/dist/plugins/record.esm.js";
import { FaPlayCircle, FaPauseCircle, FaStopCircle } from "react-icons/fa";
import { MdOutlineReplayCircleFilled } from "react-icons/md";
import { IoIosSend } from "react-icons/io";
import { PiRecordFill } from "react-icons/pi";
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
import {
  getPresignedUrl,
  saveRecordedFile,
  S3UploadRecord,
} from "@services/recordApi";
import { useAudioStore } from "@stores/recordStore";

const AudioWave = () => {
  const containerRef = useRef(null);
  const speedButtonRef = useRef(null);
  const speedBarRef = useRef(null);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [speedBarVisible, setSpeedBarVisible] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  // const [audioUrl, setAudioUrl] = useState("src/assets/hitsong.wav");

  const [recordTime, setRecordTime] = useState(0);
  const playbackRates = [1, 1.25, 1.5, 1.75, 2];
  const [objectUrl, setObjectUrl] = useState(null); // presigned URL 저장
  const {
    startTime,
    setCreatetime,
    setIsRecording: checkRecording,
    setStartTime,
  } = useAudioStore();

  const [fileId, setFileId] = useState(2);

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

      recPlugin.on("record-end", async (blob) => {
        if (blob.size === 0) {
          alert("녹음이 너무 짧습니다! 새로운 녹음이 진행됩니다.");
          record.startRecording();
          setCreatetime(Date.now()); //녹음 시작 시각 기록
          return;
        }
        // 녹음된 Blob 객체로부터 오디오 URL을 생성하고 상태에 저장
        const recordedUrl = URL.createObjectURL(blob);
        setAudioUrl(recordedUrl); // audioUrl에 저장
        setIsRecording(false);
        checkRecording(false);

        try {
          const data = await getPresignedUrl();
          setObjectUrl(data.object_url);
          console.log("object URL: " + objectUrl);

          // Blob을 File 객체로 변환
          const wavFile = new File([blob], "record.wav", {
            type: "audio/wav",
          });
          if (!objectUrl) {
            await S3UploadRecord(data.presigned_url, wavFile);
          }

          // 서버로 녹음된 파일 정보 저장
          await saveRecordedFile(2, objectUrl);
        } catch (error) {
          console.error("Error during recording process:", error);
          setIsRecording(false);
          checkRecording(false);
          return;
        }
      });

      return recPlugin;
    }
  }, [wavesurfer]);

  useEffect(() => {
    if (wavesurfer) {
      wavesurfer.on("finish", () => {
        setIsPlaying(false);
      });
    }
    return () => {
      if (wavesurfer) {
        wavesurfer.destroy();
      }
    };
  }, [wavesurfer]);

  useEffect(() => {
    if (wavesurfer && startTime !== null && audioUrl) {
      wavesurfer.setTime(startTime);
      setTimeout(() => {
        wavesurfer.getCurrentTime(), setStartTime(null);
      }, 200); // 200ms 정도의 딜레이를 주고 확인
    }
  }, [startTime, wavesurfer, audioUrl]);

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

    checkRecording(!isRecording);
    setIsRecording(!isRecording);
  };

  const handleStartStopRecording = async () => {
    try {
      const devices = await RecordPlugin.getAvailableAudioDevices();
      const deviceId = devices[0]?.deviceId;

      if (recordTime >= 1) {
        record.stopRecording(); // 녹음 중단
      } else {
        setAudioUrl(null);
        setRecordTime(0);
        record.startRecording({ deviceId }); // 녹음 시작
        setCreatetime(Date.now()); //녹음 시작 시각 기록
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
          {isRecording ? <FaStopCircle /> : <PiRecordFill />}
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
        {audioUrl ? <MdOutlineReplayCircleFilled /> : <IoIosSend />}
      </StopReplayButton>
    </AudioContainer>
  );
};

export default AudioWave;
