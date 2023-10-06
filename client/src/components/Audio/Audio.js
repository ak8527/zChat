import { useState, useRef, useEffect, useCallback } from 'react';

import formatTimeMMSS from '../../utils/formatTimeMMSS';
import PauseSvg from '../Svg/PauseSvg';
import PlaySvg from '../Svg/PlaySvg';
import SpeakerSvg from '../Svg/SpeakerSvg';
import styles from './Audio.module.css';
import SpeakerOffSvg from '../Svg/SpeakerOffSvg';

const Audio = ({ src }) => {
  const audioRef = useRef();
  const progressBarRef = useRef();
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeProgress, setTimeProgress] = useState(0);
  const [isMute, setIsMute] = useState(false);
  const [duration, setDuration] = useState(0);
  const playAnimationRef = useRef();

  const onLoadedMetadata = useCallback(() => {
    const seconds = audioRef.current.duration;
    setDuration(seconds);
    progressBarRef.current.max = seconds;
  }, []);

  const repeat = useCallback(() => {
    const currentTime = audioRef.current.currentTime;
    setTimeProgress(currentTime);
    progressBarRef.current.value = currentTime;
    playAnimationRef.current = requestAnimationFrame(repeat);
  }, []);

  useEffect(() => {
    if (isPlaying) {
      audioRef.current.play();
      playAnimationRef.current = requestAnimationFrame(repeat);
    } else {
      audioRef.current.pause();
      cancelAnimationFrame(playAnimationRef.current);
    }

    return () => {
      cancelAnimationFrame(playAnimationRef.current);
    };
  }, [isPlaying, audioRef, repeat]);

  useEffect(() => {
    if (isMute) audioRef.current.muted = true;
    else audioRef.current.muted = false;
  }, [isMute]);

  const handleChangeProgress = () => {
    audioRef.current.currentTime = progressBarRef.current.value;
    setTimeProgress(progressBarRef.current.value);
  };

  return (
    <div className={styles.audio}>
      <audio
        onLoadedMetadata={onLoadedMetadata}
        ref={audioRef}
        src={src}
        controls
      />
      <span
        className={styles.control}
        onClick={() => setIsPlaying((prev) => !prev)}
      >
        {isPlaying ? <PauseSvg /> : <PlaySvg />}
      </span>
      <span className={styles.timeProgress}>
        {`${formatTimeMMSS(timeProgress)}/${formatTimeMMSS(duration)} `}
      </span>
      <input
        type={'range'}
        defaultValue={0}
        ref={progressBarRef}
        onChange={handleChangeProgress}
      />
      <span
        onClick={() => setIsMute((prev) => !prev)}
        className={styles.volume}
      >
        {isMute ? <SpeakerOffSvg /> : <SpeakerSvg />}
      </span>
    </div>
  );
};

export default Audio;
