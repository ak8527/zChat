import styles from './AnnouncementMessage.module.css';

const AnnouncementMessage = ({ message }) => {
  return (
    <div className={styles.announcement}>
      <span className={styles.message}>{message.text}</span>
    </div>
  );
};

export default AnnouncementMessage;
