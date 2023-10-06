import { getDate } from '../../../../utils/dateTime';
import fileSize from '../../../../utils/fileSize';
import FileTypeSvg from '../../../../components/FileType/FileTypeSvg';
import styles from './File.module.css';

const File = ({ file }) => {
  const { text: url, date, fileMetaData } = file;
  const { name, size, mimetype } = fileMetaData ?? {};
  const type = name.split('.').pop().toString().toUpperCase();

  return (
    <li
      className={styles.file}
      onClick={() => window.open(url, '_blank', 'noreferrer')}
    >
      <span className={styles.card}>
        <FileTypeSvg mimetype={mimetype} />
      </span>
      <div className={styles.name}>{name}</div>
      <span className={styles.type}>{type}</span>
      <span className={styles.size}>{fileSize(size)}</span>
      <time className={styles.date}>{getDate(date)}</time>
    </li>
  );
};

export default File;
