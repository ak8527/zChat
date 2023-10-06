import { useEffect, useRef, useCallback, useState, useMemo } from 'react';
import { useDispatch } from 'react-redux';

import {
  MicOffBtn,
  CameraOffBtn,
  DeclineBtn,
  SpeakerOffBtn,
} from '../../../../../components/CallBtn/CallBtn';
import { webrtcActions } from '../../../../../store/webrtc/webrtcSlice';
import getMediaStream from '../../../../../utils/mediaStream';
import iceConfiguration from './iceConfiguration';
import Image from '../../../../../components/Image/Image';
import Timer from './Timer';
import WEBRTC_STATE from '../../../../../utils/webrtcState';
import styles from './Answer.module.css';

const Answer = ({
  roomId,
  sdp,
  callType,
  candidates,
  receiver,
  status,
  onDeclineCall,
}) => {
  const pc = useRef(null);
  const mediaStream = useRef();
  const localVideoRef = useRef();
  const remoteVideoRef = useRef();
  const dispatch = useDispatch();
  const [isMuted, setIsMuted] = useState(false);
  const [switchMic, setSwitchMic] = useState(false);
  const [switchCamera, setSwitchCamera] = useState(false);
  const [initConnection, setInitConnection] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  console.log('Answer.js called!!!!');
  console.log('CallType:', callType);

  const data = useMemo(() => {
    return {
      roomId: roomId,
      receiverId: receiver?._id,
    };
  }, [roomId, receiver?._id]);

  const sendSdp = useCallback(
    (sdp) => {
      const newData = { ...data };
      newData['sdp'] = JSON.stringify(sdp);
      dispatch(webrtcActions.sendSdp(newData));
    },
    [dispatch, data]
  );

  const sendCandidate = useCallback(
    (candidate) => {
      const newData = { ...data };
      newData['candidate'] = JSON.stringify(candidate);
      dispatch(webrtcActions.sendCandidate(newData));
    },
    [dispatch, data]
  );

  const stopWebrtcConnection = useCallback(() => {
    if (mediaStream.current) {
      mediaStream.current.getTracks().forEach((track) => {
        track.stop();
      });
    }
    if (pc.current) {
      localVideoRef.current.srcObject = null;
      remoteVideoRef.current.srcObject = null;
      pc.current.close();
      pc.current = null;
    }
  }, []);

  const setPeerConnection = useCallback(() => {
    pc.current = new RTCPeerConnection(iceConfiguration);
    pc.current.onicecandidate = (e) => {
      if (e.candidate) sendCandidate(e.candidate);
    };

    pc.current.onconnectionstatechange = (e) => {
      if (e.currentTarget.connectionState === WEBRTC_STATE.CONNECTED)
        setIsConnected(true);
      else if (e.currentTarget.connectionState === WEBRTC_STATE.DISCONNECTED) {
        dispatch(webrtcActions.closeConnection());
      }
    };

    pc.current.ontrack = (e) => {
      remoteVideoRef.current.srcObject = e.streams[0];
    };
  }, [sendCandidate, dispatch]);

  useEffect(() => {
    if (status === WEBRTC_STATE.DISCONNECTING) {
      console.log('Calling Disconnction:');
      stopWebrtcConnection();
      dispatch(webrtcActions.closeConnection());
    }
  }, [dispatch, status, stopWebrtcConnection]);

  useEffect(() => {
    if (!pc.current && !initConnection) {
      console.log('Calling...');
      setPeerConnection();
      getMediaStream(callType)
        .then((stream) => {
          mediaStream.current = stream;
          localVideoRef.current.srcObject = stream;
          stream.getTracks().forEach((track) => {
            pc.current.addTrack(track, stream);
          });
          setInitConnection(true);
        })
        .catch((err) => {
          console.log('Error:', err.message);
          stopWebrtcConnection();
          dispatch(webrtcActions.closeConnection());
        });
    }
  }, [
    callType,
    dispatch,
    initConnection,
    stopWebrtcConnection,
    setPeerConnection,
  ]);

  useEffect(() => {
    if (initConnection) {
      (async () => {
        try {
          const parseSDP = JSON.parse(sdp);
          if (
            parseSDP &&
            parseSDP.type === 'answer' &&
            !pc.current.currentRemoteDescription
          ) {
            await pc.current.setRemoteDescription(parseSDP);
            console.log('Set Remote Description:', Date.now());
          } else if (!parseSDP) {
            const resSDP = await pc.current.createOffer();
            await pc.current.setLocalDescription(resSDP);
            console.log('Create Offer:', Date.now());
            sendSdp(resSDP);
          } else if (parseSDP && parseSDP.type === 'offer') {
            await pc.current.setRemoteDescription(parseSDP);
            const resSDP = await pc.current.createAnswer();
            await pc.current.setLocalDescription(resSDP);
            console.log('Create Answer:', Date.now());
            sendSdp(resSDP);
          }
        } catch (err) {
          console.log('Error:', err.message);
        }
      })();
    }
  }, [sdp, sendSdp, initConnection]);

  useEffect(() => {
    candidates?.forEach((candidate) => {
      const parseCandidate = JSON.parse(candidate);
      if (parseCandidate && pc.current.currentRemoteDescription)
        pc.current
          .addIceCandidate(parseCandidate)
          .catch((err) => console.log('Error:', err.message));
    });
  }, [candidates]);

  return (
    <div className={styles.answer}>
      <div
        className={`${styles.videoCall} ${
          callType === 'audio' ? styles.hideVideoCall : ''
        }`}
      >
        <video className={styles.localVideo} ref={localVideoRef} autoPlay />
        <video className={styles.remoteVideo} ref={remoteVideoRef} autoPlay />
      </div>
      {callType === 'audio' && (
        <div className={styles.audioCall}>
          <Image className={styles.image} src={receiver?.imageUrl} />
          <span className={styles.username}>{receiver?.name}</span>
          <Timer isConnected={isConnected} />
        </div>
      )}
      <div className={styles.btn}>
        <span
          className={styles.micBtn}
          onClick={() => {
            mediaStream.current.getAudioTracks().forEach((track) => {
              track.enabled = switchMic;
            });
            setSwitchMic((prev) => !prev);
          }}
        >
          <MicOffBtn isActive={switchMic} />
        </span>
        <span
          className={styles.declineBtn}
          onClick={() => {
            stopWebrtcConnection();
            onDeclineCall(WEBRTC_STATE.DISCONNECTING);
          }}
        >
          <DeclineBtn />
        </span>
        {callType === 'video' ? (
          <span
            className={styles.cameraBtn}
            onClick={() => {
              mediaStream.current?.getVideoTracks().forEach((track) => {
                track.enabled = switchCamera;
              });
              setSwitchCamera((prev) => !prev);
            }}
          >
            <CameraOffBtn isActive={switchCamera} />
          </span>
        ) : (
          <span
            className={styles.audioBtn}
            onClick={() => {
              remoteVideoRef.current.muted = !isMuted;
              setIsMuted((prev) => !prev);
            }}
          >
            <SpeakerOffBtn isActive={isMuted} />
          </span>
        )}
      </div>
    </div>
  );
};

export default Answer;
