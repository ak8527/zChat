import { useCallback, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useNavigate, useLocation } from 'react-router-dom';

import {
  chatActions,
  getPrivateRoomStatus,
} from '../../../../store/chat/chatSlice';
import { getRooms } from '../../../../store/chat/chatSlice';
import { getUserId } from '../../../../store/user/userSlice';
import { webrtcActions } from '../../../../store/webrtc/webrtcSlice';
import { postLeaveRoom } from '../../../../store/chat/chatMiddleware';
import { postBlockRoom } from '../../../../store/chat/chatMiddleware';
import { getDate, getTime } from '../../../../utils/dateTime';
import KebabMenu from '../../../../components/Svg/KebabSvg';
import BackArrowSvg from '../../../../components/Svg/BackArrowSvg';
import Menu from '../Menu/Menu';
import Image from '../../../../components/Image/Image';
import Loader from '../../../../components/Loader/Loader';
import VideoCallSvg from '../../../../components/Svg/VideoCallSvg';
import AudioCallSvg from '../../../../components/Svg/AudioCallSvg';
import styles from './Nav.module.css';
import getMediaStream from '../../../../utils/mediaStream';

const Nav = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const rooms = useSelector(getRooms);
  const roomStatus = useSelector(getPrivateRoomStatus);
  const loggedUserId = useSelector(getUserId);
  const [isLeave, setIsLeave] = useState(false);
  const [isBlock, setIsBlock] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const room = rooms?.find((room) => room._id === id);
  let roomUser1, roomUser2;
  if (room && !room?.isGroup) {
    roomUser1 = room.users[0];
    roomUser2 = room.users[1];
  }
  let statusText = room?.isGroup ? 'tap here to get group info' : 'offline';
  if (roomStatus.roomId && roomStatus.roomId === room?._id) {
    statusText =
      roomStatus.status === 'online'
        ? 'online'
        : !roomStatus.lastSeen
        ? 'offline'
        : formatDateTime(roomStatus.lastSeen);
  }

  const checkPermission = useCallback(
    async (type) => {
      try {
        const stream = await getMediaStream(type);
        stream.getTracks().forEach((track) => track.stop());
        const receiverId = roomUser1 === loggedUserId ? roomUser2 : roomUser1;
        const data = {
          roomId: room._id,
          callType: type,
          receiver: {
            _id: receiverId,
            name: room?.name,
            imageUrl: room?.imageUrl,
          },
        };

        dispatch(webrtcActions.callingReq(data));
      } catch (err) {
        console.log('Error:', err);
      }
    },
    [
      dispatch,
      room?.name,
      room?.imageUrl,
      room?._id,
      loggedUserId,
      roomUser1,
      roomUser2,
    ]
  );

  useEffect(() => {
    if (!room?.isGroup && room?._id) {
      const otherUserId =
        loggedUserId === room?.users[0] ? room?.users[1] : room?.users[0];
      const data = { roomId: room?._id, otherUserId: otherUserId };
      dispatch(chatActions.privateRoomStatusReq(data));
    }
  }, [loggedUserId, room?._id, room?.users, room?.isGroup, dispatch]);

  useEffect(() => {
    if (!room?.isGroup && room?._id && isBlock && isLoading) {
      console.log('RoomId:', room?._id);
      const data = { roomId: room?._id };
      dispatch(postBlockRoom(data))
        .unwrap()
        .then((res) => {
          setIsLoading(false);
          navigate('/home');
        })
        .catch((err) => {
          console.log('Error:', err);
        });
    }
  }, [room?.isGroup, room?._id, isLoading, isBlock, navigate, dispatch]);

  useEffect(() => {
    if (room?.isGroup && isLeave && room?._id && isLoading) {
      const data = { roomId: room?._id };
      dispatch(postLeaveRoom(data))
        .unwrap()
        .then((res) => {
          setIsLoading(false);
          dispatch(chatActions.updateRoomReq({ roomId: res.data.roomId }));
          navigate(`/home`);
        })
        .catch((err) => {
          console.log('Error:', err);
        });
    }
  }, [
    room?.isGroup,
    room?._id,
    isLoading,
    dispatch,
    navigate,
    isBlock,
    isLeave,
  ]);

  return (
    <>
      <nav className={styles.nav}>
        <span
          className={styles.backArrow}
          // onClick={() => navigate(`${location.pathname?.split('chat')?.[0]}`)}
          onClick={() => navigate(-1)}
        >
          <BackArrowSvg />
        </span>
        <Image
          className={styles.image}
          src={room?.imageUrl}
          title={room?.name}
          isGroup={room?.isGroup}
        />
        <div className={styles.roomName}>{room?.name}</div>
        <div
          className={`${styles.status} ${
            statusText === 'online' ? styles.statusOnline : ''
          }`}
          onClick={() => {
            if (!location.pathname.includes('info'))
              navigate(`${location.pathname}/info`);
          }}
        >
          {statusText}
        </div>
        {!room?.isGroup && (
          <>
            <span
              className={styles.videoCall}
              onClick={() => checkPermission('video')}
            >
              <VideoCallSvg />
            </span>
            <span
              className={styles.audioCall}
              onClick={() => checkPermission('audio')}
            >
              <AudioCallSvg />
            </span>
          </>
        )}
        <span className={styles.kebabMenu} onClick={() => setShowMenu(true)}>
          <KebabMenu />
        </span>
        {showMenu && (
          <Menu
            isGroup={room?.isGroup}
            onClose={() => setShowMenu(false)}
            onLeave={() => {
              setShowMenu(false);
              setIsLoading(true);
              setIsLeave(true);
            }}
            onBlock={() => {
              setShowMenu(false);
              setIsLoading(true);
              setIsBlock(true);
            }}
            onNavigate={() => {
              setShowMenu(false);
              if (!location.pathname.includes('info'))
                navigate(`${location.pathname}/info`);
            }}
          />
        )}
      </nav>
      <Loader isOpen={isLoading} />
    </>
  );
};

function formatDateTime(timestamps) {
  const NOW = Date.now();
  const ONE_DAY = 86400000; // seconds
  const dateOption = { month: 'short', day: 'numeric' };
  const statusDate = getDate(timestamps, dateOption);
  const statusTime = getTime(timestamps);
  let statusText = '';
  switch (getDate(timestamps)) {
    case getDate(NOW):
      statusText = `Today, ${statusTime}`;
      break;
    case getDate(NOW - ONE_DAY):
      statusText = `Yesterday, ${statusTime}`;
      break;
    default:
      statusText = `${statusDate}, ${statusTime}`;
  }
  return statusText;
}

export default Nav;
