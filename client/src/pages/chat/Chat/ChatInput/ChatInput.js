import { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useParams } from 'react-router-dom';
import { chatActions } from '../../../../store/chat/chatSlice';
import { getUserInfo } from '../../../../store/user/userSlice';
import FileUploadModal from '../Modal/FileUploadModal';
import SendArrowSvg from '../../../../components/Svg/SendArrowSvg';
import LinkSvg from '../../../../components/Svg/LinkSvg';
import styles from './ChatInput.module.css';
import MESSAGE_TYPE from '../../../../utils/messageType';

const ChatInput = () => {
  const { id } = useParams();
  const inputRef = useRef();
  const dispatch = useDispatch();
  const loggedUser = useSelector(getUserInfo);
  const [showFileUploadModal, setShowFileUploadModal] = useState(false);

  const sendMessage = () => {
    const text = inputRef.current.value;
    if (text.length === 0) return;
    const data = {
      roomId: id,
      message: {
        author: {
          authorId: loggedUser.userId,
          username: loggedUser.username,
          imageUrl: loggedUser.imageUrl,
        },
        type: isUrl(text) ? MESSAGE_TYPE.URL : MESSAGE_TYPE.TEXT,
        text: text,
        date: Date.now().toString(),
      },
    };
    inputRef.current.value = '';
    dispatch(chatActions.submitMessage(data));
  };

  return (
    <>
      <div className={styles.chatInput}>
        <span
          className={styles.link}
          onClick={() => setShowFileUploadModal(true)}
        >
          <LinkSvg />
        </span>
        <div className={styles.textarea}>
          <textarea ref={inputRef} rows={1} spellCheck={false}></textarea>
        </div>
        <span className={styles.send} onClick={sendMessage}>
          <SendArrowSvg />
        </span>
      </div>
      <FileUploadModal
        isOpen={showFileUploadModal}
        closeModal={() => setShowFileUploadModal(false)}
      />
    </>
  );
};

function isUrl(text) {
  try {
    new URL(text);
    return true;
  } catch (err) {
    return false;
  }
}

export default ChatInput;
