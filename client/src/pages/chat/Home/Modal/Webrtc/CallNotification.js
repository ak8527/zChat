import { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';

import {
  AcceptBtn,
  DeclineBtn,
} from '../../../../../components/CallBtn/CallBtn';
import { webrtcActions } from '../../../../../store/webrtc/webrtcSlice';
import Image from '../../../../../components/Image/Image';
import styles from './CallNotification.module.css';

const CallNotification = ({ receiver, callType, onDeclineCall }) => {
  const dispatch = useDispatch();
  const notificationRef = useRef(null);

  useEffect(() => {
    if (!notificationRef.current) {
      showNotification(
        `${callType === 'video' ? 'Incoming Video Call' : 'Incoming Call'}`,
        { name: receiver?.name, imageUrl: receiver?.imageUrl }
      );
      notificationRef.current = true;
    }
  }, [callType, receiver?.name, receiver?.imageUrl]);

  return (
    <div className={styles.notification}>
      <Image
        className={styles.image}
        isGroup={false}
        src={receiver?.imageUrl}
      />
      <div className={styles.info}>
        <span className={styles.callType}>{`${
          callType === 'video' ? 'Incoming Video Call' : 'Incoming Call'
        }`}</span>
        <span className={styles.callerName}>{receiver?.name}</span>
      </div>
      <span onClick={() => onDeclineCall()}>
        <DeclineBtn />
      </span>
      <span onClick={() => dispatch(webrtcActions.acceptCall())}>
        <AcceptBtn />
      </span>
    </div>
  );
};

function showNotification(message, receiver) {
  if (
    // document.visibilityState === 'hidden' &&
    document.hidden &&
    Notification.permission === 'granted' &&
    localStorage.getItem('notification')
  ) {
    new Notification(receiver?.name, {
      body: message,
      icon: receiver?.imageUrl,
    });
  }
}

export default CallNotification;
