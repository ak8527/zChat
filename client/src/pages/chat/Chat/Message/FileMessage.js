import { getTime } from '../../../../utils/dateTime';
import FileTypeSvg from '../../../../components/FileType/FileTypeSvg';
import styles from './FileMessage.module.css';

const FileMessage = ({ message }) => {
  const fileUrl = message.text;
  const time = getTime(message.date);
  const { name, size, mimetype } = message.fileMetaData;
  const fileType = name.split('.').pop().toString().toUpperCase();

  const fileSize = (size) => {
    if (size < 1024) return `${size} bytes`;
    else if (size < 1024 * 1024) return `${Math.floor(size / 1024)} KB`;
    else return `${Math.floor(size / (1024 * 1024))} MB`;
  };

  return (
    <div className={styles.file}>
      <div className={styles.card}>
        <FileTypeSvg mimetype={mimetype} />
      </div>
      <a
        className={styles.name}
        href={fileUrl}
        target={'_blank'}
        rel={'noreferrer'}
      >
        {name}
      </a>
      <span className={styles.size}>{fileSize(size)}</span>
      <span className={styles.type}>{fileType}</span>
      <time className={styles.time}>{time}</time>
    </div>
  );
};

export default FileMessage;
