import { getTime } from '../../../../utils/dateTime';
import styles from './TextMessage.module.css';

const TextMessage = ({ message }) => {
  const text = message.text;
  const date = getTime(message.date);

  return (
    <div className={styles.textMessage}>
      <span className={styles.text}>{text}</span>
      <time className={styles.time}>{date}</time>
    </div>
  );
};

export default TextMessage;
