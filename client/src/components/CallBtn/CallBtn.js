import AcceptCallSvg from '../Svg/AcceptCallSvg';
import CameraOffSvg from '../Svg/CameraOffSvg';
import DeclineCallSvg from '../Svg/DeclineCallSvg';
import MicOffSvg from '../Svg/MicOffSvg';
import SpeakerOffSvg from '../Svg/SpeakerOffSvg';
import styles from './CallBtn.module.css';

export const AcceptBtn = () => {
  return (
    <span className={`${styles.btn} ${styles.accept}`}>
      <AcceptCallSvg />
    </span>
  );
};

export const DeclineBtn = () => {
  return (
    <span className={`${styles.btn} ${styles.decline}`}>
      <DeclineCallSvg />
    </span>
  );
};

export const MicOffBtn = ({ isActive }) => {
  return (
    <span
      className={`${styles.btn} ${styles.mic} ${
        isActive ? styles.isActive : ''
      }`}
    >
      <MicOffSvg />
    </span>
  );
};

export const CameraOffBtn = ({ isActive }) => {
  return (
    <span
      className={`${styles.btn} ${styles.camera} ${
        isActive ? styles.isActive : ''
      }`}
    >
      <CameraOffSvg />
    </span>
  );
};

export const SpeakerOffBtn = ({ isActive }) => {
  return (
    <span
      className={`${styles.btn} ${styles.speaker} ${
        isActive ? styles.isActive : ''
      }`}
    >
      <SpeakerOffSvg />
    </span>
  );
};

// export { AcceptBtn, DeclineBtn, MicOffBtn, CameraOffBtn, SpeakerOffBtn };
