import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import { getAllMessages } from '../../../../store/chat/chatSlice';
import MESSAGE_TYPE from '../../../../utils/messageType';
import Nav from '../Nav/Nav';
import Photo from './Photo';
import styles from './AllPhotos.module.css';

const AllPhotos = () => {
  const { id: roomId } = useParams();
  const allRoomMessages = useSelector(getAllMessages);
  const messages = allRoomMessages[roomId];
  const photos = [];

  messages?.forEach((message) => {
    if (message.type === MESSAGE_TYPE.IMAGE) photos.push(message);
  });

  return (
    <div className={styles.photos}>
      <Nav>{'Photos'}</Nav>
      <ul>
        {photos.toReversed().map((message) => (
          <Photo key={message._id} src={message.text} />
        ))}
      </ul>
    </div>
  );
};

export default AllPhotos;
