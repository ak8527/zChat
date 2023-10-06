import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { getRooms } from '../../../../store/chat/chatSlice';
import { postLeaveRoom } from '../../../../store/chat/chatMiddleware';
import { chatActions } from '../../../../store/chat/chatSlice';
import { postBlockRoom } from '../../../../store/chat/chatMiddleware';
import Button from '../../../../components/Button/Button';

const RoomBtn = () => {
  const { id } = useParams(); // roomId
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const rooms = useSelector(getRooms);
  const [isLeave, setIsLeave] = useState(false);
  const [isBlock, setIsBlock] = useState(false);
  const room = rooms.find((room) => room._id === id);

  useEffect(() => {
    if (isBlock) {
      const data = { roomId: id };
      dispatch(postBlockRoom(data))
        .unwrap()
        .then((res) => {
          navigate('/home');
        });
    }
  }, [id, isBlock, navigate, dispatch]);

  useEffect(() => {
    if (isLeave) {
      const data = { roomId: id };
      dispatch(postLeaveRoom(data))
        .unwrap()
        .then((res) => {
          dispatch(chatActions.updateRoomReq({ roomId: id }));
        })
        .catch((err) => {
          console.log('Error:', err);
        })
        .finally(() => {
          navigate(`/home`);
        });
    }
  }, [dispatch, id, isBlock, navigate, isLeave]);

  return (
    <>
      {room?.isGroup ? (
        <Button onClick={() => setIsLeave(true)}>{'Exit Group'}</Button>
      ) : (
        <Button onClick={() => setIsBlock(true)}>{'Block'}</Button>
      )}
    </>
  );
};

export default RoomBtn;
