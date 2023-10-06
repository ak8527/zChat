import CloseSvg from '../../../../../../components/Svg/CloseSvg';
import Image from '../../../../../../components/Image/Image';
import styles from './Participant.module.css';

const Participant = (props) => {
  return (
    <li className={styles.container}>
      <div className={styles.userImage}>
        <Image
          className={styles.image}
          src={props.user?.imageUrl}
          isGroup={false}
        />
        <span className={styles.closeSvg} onClick={props.onClick}>
          <CloseSvg />
        </span>
      </div>
      <span className={styles.username}>{props.user?.username}</span>
    </li>
  );
};

export default Participant;
