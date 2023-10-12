import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

import { postRooms } from '../../../../store/chat/chatMiddleware';
import { getRooms, getAllMessages } from '../../../../store/chat/chatSlice';
import useWindowDimensions from '../../../../hooks/useWindowDimensions';
import Search from './Search';
import Room from './Room';
import styles from './Rooms.module.css';

const Rooms = () => {
  const { id } = useParams();
  const { width } = useWindowDimensions();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const rooms = useSelector(getRooms);
  const allRoomMessages = useSelector(getAllMessages);
  const [roomQuery, setRoomQuery] = useState('');

  let searchRoomList = rooms.filter((room) =>
    room.name.toLowerCase().includes(roomQuery)
  );

  useEffect(() => {
    if (rooms.length === 0) dispatch(postRooms());
  }, [dispatch, rooms.length]);

  searchRoomList = [...searchRoomList, ...searchRoomList];
  searchRoomList = [...searchRoomList, ...searchRoomList];
  searchRoomList = [...searchRoomList, ...searchRoomList];

  return (
    <div className={styles.rooms}>
      <Search onChange={(e) => setRoomQuery(e.target.value.toLowerCase())} />
      <ul className={styles.userList}>
        {searchRoomList.map((room) => (
          <Room
            key={room._id}
            room={room}
            onClick={() => {
              setRoomQuery('');
              navigate(`${width > 960 ? '/home/chat' : '/chat'}/${room._id}`);
            }}
            activeRoomId={id}
            messages={allRoomMessages[room._id]}
          />
        ))}
      </ul>
    </div>
  );
};

export default Rooms;
