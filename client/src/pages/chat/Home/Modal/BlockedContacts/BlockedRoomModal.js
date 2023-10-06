import { useEffect, useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import Modal from 'react-modal';

import {
  getBlockedRooms,
  postUnblockRooms,
} from '../../../../../store/chat/chatMiddleware';
import Loader from '../../../../../components/Loader/Loader';
import Image from '../../../../../components/Image/Image';
import Button from '../../../../../components/Button/Button';
import CloseSvg from '../../../../../components/Svg/CloseSvg';
import Checkbox from '../../../../../components/Checkbox/Checkbox';
import styles from './BlockedRoomModal.module.css';

const BlockedRoomModal = ({ isOpen, closeModal }) => {
  const dispatch = useDispatch();
  const unblockRef = useRef(new Set());
  const [blockedRoomsList, setBlockedRoomsList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    dispatch(getBlockedRooms())
      .unwrap()
      .then((res) => {
        console.log('BlockedRoomList:', res);
        setBlockedRoomsList([...res.data.blockedRooms]);
      })
      .catch((err) => console.log('Error:', err.message));
  }, [dispatch, isOpen]);

  useEffect(() => {
    if (!isLoading) return;
    const unblockRoomSet = unblockRef.current.values();
    const blockedRoomsId = Array.from(unblockRoomSet);
    const data = { blockedRoomsId: blockedRoomsId };
    dispatch(postUnblockRooms(data))
      .unwrap()
      .then((res) => {
        console.log('Blocked Room Id:', res);
      })
      .finally(() => {
        setIsLoading(false);
        setBlockedRoomsList([]);
        unblockRef.current = new Set();
        closeModal();
      });
  }, [isLoading, dispatch, closeModal]);

  return (
    <Modal
      isOpen={isOpen}
      className={styles.modal}
      overlayClassName={styles.overlay}
      shouldCloseOnEsc={false}
    >
      <nav>
        <span className={styles.close} onClick={closeModal}>
          <CloseSvg />
        </span>
        <span>Blocked Room</span>
      </nav>
      <ul className={styles.blockedrooms}>
        {blockedRoomsList.map((room) => (
          <li className={styles.blockedroom} key={room._id}>
            <Image className={styles.image} src={room.imageUrl}>
              {room.imageUrl}
            </Image>
            <div className={styles.roomname}>{room.name}</div>
            <div className={styles.checkbox}>
              <Checkbox
                onChange={(e) => {
                  const unblockRoomSet = unblockRef.current;
                  e.target.checked
                    ? unblockRoomSet.add(room._id)
                    : unblockRoomSet.delete(room._id);
                }}
              />
            </div>
          </li>
        ))}
      </ul>
      <div className={styles.button}>
        <Button
          disabled={blockedRoomsList.length > 0 ? false : true}
          onClick={() => setIsLoading(true)}
        >
          {'Unblock Contact'}
        </Button>
      </div>
      <Loader isOpen={isLoading} />
    </Modal>
  );
};

export default BlockedRoomModal;
