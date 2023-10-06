import Image from '../../../../components/Image/Image';
import Message from './Message';
import styles from './SendMessage.module.css';

const SendMessage = ({ message, isAuthorSame, isGroup }) => {
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
    <div className={styles.sendMessageContainer}>
      <div className={styles.sendMessage}>
        <div>
          {isGroup && <span className={userClassName}>You</span>}
          <div className={messageClassName}>
            <Message message={message} />
          </div>
        </div>
        {isGroup && (
          <span>
            <Image
              className={imageClassName}
              src={message?.author?.imageUrl}
              title={'You'}
            />
          </span>
        )}
      </div>
    </div>
  );
};
export default SendMessage;
