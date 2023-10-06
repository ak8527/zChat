import ViewAllArrow from '../../../../components/Svg/ViewAllArrow';
import styles from './Title.module.css';

const Title = ({ title, size, showAll, onClick }) => {
  return (
    <div className={styles.container}>
      <span className={styles.title}>{title}</span>
      <span className={styles.size}>{size}</span>
      {showAll && (
        <span className={styles.viewAll} onClick={onClick}>
          <span>View all</span>
          <ViewAllArrow />
        </span>
      )}
    </div>
  );
};

export default Title;
