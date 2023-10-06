import LinkSvg from '../../../../components/Svg/LinkSvg';
import useUrlMetaData from '../../../../hooks/useUrlMetaData';
import styles from './Link.module.css';

const Link = ({ link }) => {
  const url = new URL(link);
  const metaData = useUrlMetaData(link);

  return (
    <li
      className={styles.link}
      onClick={() => window.open(url, '_blank', 'noreferrer')}
    >
      <span className={styles.image}>
        {metaData.imageUrl ? (
          <img src={metaData.imageUrl} alt='Link' />
        ) : (
          <span>
            <LinkSvg />
          </span>
        )}
      </span>
      <div className={styles.title}>{metaData.title ?? link}</div>
      <div className={styles.url}>{url.hostname}</div>
    </li>
  );
};

export default Link;
