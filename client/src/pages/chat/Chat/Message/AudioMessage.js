import { getTime } from '../../../../utils/dateTime';
import Audio from '../../../../components/Audio/Audio';
import styles from './AudioMessage.module.css';

const AudioMessage = ({ message }) => {
  const fileUrl = message.text;
  const fileName = message.fileMetaData?.name;
  const time = getTime(message?.date);

  return (
    <div className={styles.audio}>
      <Audio src={fileUrl} />
      <span>
        <a
          className={styles.name}
          href={fileUrl}
          target={'_blank'}
          rel={'noreferrer'}
          download
        >
          {fileName}
        </a>
        <time>{time}</time>
      </span>
    </div>
  );
};

export default AudioMessage;
