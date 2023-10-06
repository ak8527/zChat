import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import MESSAGE_TYPE from '../../../../utils/messageType';
import { getAllMessages } from '../../../../store/chat/chatSlice';
import Nav from '../Nav/Nav';
import File from './File';
import styles from './AllFiles.module.css';

const AllFiles = () => {
  const { id: roomId } = useParams();
  const allRoomMessages = useSelector(getAllMessages);
  const messages = allRoomMessages[roomId];
  const files = [];

  messages?.forEach((message) => {
    if (
      message.type === MESSAGE_TYPE.VIDEO ||
      message.type === MESSAGE_TYPE.AUDIO ||
      message.type === MESSAGE_TYPE.FILE
    )
      files.push(message);
  });

  return (
    <div className={styles.files}>
      <Nav>{'Files'}</Nav>
      <ul>
        {files.toReversed().map((file) => (
          <File key={file._id} file={file} />
        ))}
      </ul>
    </div>
  );
};

export default AllFiles;
