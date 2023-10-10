import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Modal from 'react-modal';

import { getWebrtcState } from '../../../../../store/webrtc/webrtcSlice';
import { webrtcActions } from '../../../../../store/webrtc/webrtcSlice';
import WEBRTC_STATE from '../../../../../utils/webrtcState';
import CallNotification from './CallNotification';
import Call from './Call';
import Answer from './Answer';
import styles from './WebRtcModal.module.css';

const WebrtcModal = () => {
  const dispatch = useDispatch();
  const webrtcState = useSelector(getWebrtcState);
  const { sdp, error, status, callType, receiver, candidates, roomId } =
    webrtcState;

  const declineCall = useCallback(
    (status) => {
      if (roomId && receiver?._id) {
        const data = {
          roomId: roomId,
          receiverId: receiver?._id,
          status: status,
        };
        dispatch(webrtcActions.declineCall(data));
      }
    },
    [dispatch, roomId, receiver?._id]
  );

  return (
    <Modal
      isOpen={status ? true : false}
      className={styles.modal}
      overlayClassName={styles.overlay}
      shouldCloseOnEsc={false}
    >
      {status === WEBRTC_STATE.NOTIFICATION && (
        <div className={styles.notification}>
          <CallNotification
            receiver={receiver}
            callType={callType}
            onDeclineCall={declineCall}
          />
        </div>
      )}
      {status === WEBRTC_STATE.CALLING && (
        <div className={styles.call}>
          <Call receiver={receiver} error={error} onDeclineCall={declineCall} />
        </div>
      )}
      {(status === WEBRTC_STATE.CONNECTING ||
        status === WEBRTC_STATE.DISCONNECTING) && (
        <div className={styles.answer}>
          <Answer
            sdp={sdp}
            status={status}
            roomId={roomId}
            callType={callType}
            receiver={receiver}
            candidates={candidates}
            onDeclineCall={declineCall}
          />
        </div>
      )}
    </Modal>
  );
};

export default WebrtcModal;
