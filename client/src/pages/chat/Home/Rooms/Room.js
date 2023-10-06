import { memo } from 'react';
import { useSelector } from 'react-redux';

import { getUserId } from '../../../../store/user/userSlice';
import { getDate, getTime } from '../../../../utils/dateTime';
import MESSAGE_TYPE from '../../../../utils/messageType';
import Image from '../../../../components/Image/Image';
import styles from './Room.module.css';

const Room = ({ onClick, activeRoomId, room, messages }) => {
  const loggedUserId = useSelector(getUserId);
  const isActive = activeRoomId && activeRoomId === room?._id;

  const { author, text, type, date, fileMetaData } = messages?.at(-1) ?? {};
  const fileName = fileMetaData?.name;
  const isGroup = room?.isGroup;
  const isAnnouncement = type === MESSAGE_TYPE.ANNOUNCEMENT;
  const isAuthor = loggedUserId === author?.authorId;

  let messageText;
  let messageDate;
  if (messages?.at(-1)) {
    messageText = !isAnnouncement
      ? `${isGroup ? `${isAuthor ? 'You' : author?.username}:` : ''} ${
          type === MESSAGE_TYPE.IMAGE
            ? `${'🖼️'} Photo`
            : type === MESSAGE_TYPE.AUDIO
            ? `${'🎧'} ${fileName}`
            : type === MESSAGE_TYPE.VIDEO
            ? `${'🎥'} ${fileName}`
            : type === MESSAGE_TYPE.FILE
            ? `${'📁'} ${fileName}`
            : text
        }`
      : text;

    messageDate = date && getDate(date);
    messageDate =
      date && getDate(date) === getDate()
        ? getTime(date)
        : messageDate === getDate(Date.now() - 86400000)
        ? 'Yesterday'
        : messageDate;
  }

  return (
    <li className={`${styles.room} ${isActive ? styles.isActive : ''}`}>
      <Image
        className={styles.image}
        src={room?.imageUrl}
        isGroup={isGroup}
        title={room.name}
      />
      <div className={styles.link} onClick={onClick}>
        <span>{room?.name}</span>
        <time>{messageDate}</time>
        <div>{messageText}</div>
      </div>
    </li>
  );
};

export default Room;
