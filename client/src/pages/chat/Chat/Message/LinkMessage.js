import { getTime } from '../../../../utils/dateTime';
import useUrlMetaData from '../../../../hooks/useUrlMetaData';
import styles from './LinkMessage.module.css';

const LinkMessage = ({ message }) => {
  const link = message.text;
  const date = getTime(message.date);
  const url = new URL(link);
  const metaData = useUrlMetaData(link);

  return (
    <div className={styles.linkContainer}>
      {metaData?.title ? (
        <a
          href={link}
          target={'_blank'}
          rel={'noreferrer'}
          className={styles.previewLink}
        >
          <img src={metaData?.imageUrl} alt={'Link'} />
          <span>{metaData?.title}</span>
          <p>{metaData?.description}</p>
          <div>{url.hostname}</div>
          <time>{date}</time>
        </a>
      ) : (
        <div className={styles.link}>
          <a href={link} target={'_blank'} rel={'noreferrer'}>
            {link}
          </a>
          <time>{date}</time>
        </div>
      )}
    </div>
  );
};

export default LinkMessage;
