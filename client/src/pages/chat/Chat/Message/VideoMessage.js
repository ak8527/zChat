import { getTime } from '../../../../utils/dateTime';
import styles from './VideoMessage.module.css';

const VideoMessage = ({ message }) => {
  return (
    <div className={styles.video}>
      <video controls preload='metadata'>
        <source src={`${message.text}#t=0.1`} />
      </video>
      <div>
        <span>{message?.fileMetaData?.name}</span>
        <time>{getTime(message?.date)}</time>
      </div>
    </div>
  );
};
export default VideoMessage;
