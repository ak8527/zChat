import Message from './Message';
import Image from '../../../../components/Image/Image';
import styles from './ReceiveMessage.module.css';

const ReceiveMessage = ({ message, isAuthorSame, isGroup }) => {
  const userClassName = `${styles.username} ${
    isAuthorSame ? styles.hideUserName : ''
  }`;

  const imageClassName = `${styles.image} ${
    isAuthorSame ? styles.hideImage : ''
  }`;

  const messageClassName = `${styles.message} ${
    isAuthorSame ? styles.borderAllRounded : ''
  } ${isGroup && isAuthorSame ? styles.groupAuthorSame : ''}`;

  return (
    <div className={styles.receivedMessageContainer}>
      <div className={styles.receivedMessage}>
        {isGroup && (
          <span>
            <Image
              className={imageClassName}
              src={message?.author?.imageUrl}
              title={message?.author?.username}
            />
          </span>
        )}
        <div>
          {isGroup && (
            <span className={userClassName}>{message?.author?.username}</span>
          )}
          <div className={messageClassName}>
            <Message message={message} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReceiveMessage;
