import { useEffect } from 'react';
import { DeclineBtn } from '../../../../../components/CallBtn/CallBtn';
import Image from '../../../../../components/Image/Image';
import styles from './Call.module.css';

const Call = ({ receiver, error, onDeclineCall }) => {
  useEffect(() => {
    if (!error) return;
    const timer = setTimeout(() => {
      onDeclineCall();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onDeclineCall, error]);

  return (
    <div className={styles.call}>
      <Image className={styles.image} src={receiver?.imageUrl} />
      <span className={styles.username}>{receiver?.name}</span>
      <span className={styles.calling}>{!error ? 'Calling...' : error}</span>
      <span className={styles.decline} onClick={() => onDeclineCall()}>
        <DeclineBtn />
      </span>
    </div>
  );
};

export default Call;
