import CheckBox from '../../../../components/Checkbox/Checkbox';
import Image from '../../../../components/Image/Image';
import styles from './Participant.module.css';

const Participant = ({ participant, isLoggedUserAdmin, onChecked }) => (
  <li className={styles.participant}>
    <Image className={styles.image} src={participant.imageUrl} />
    <div className={styles.username}>{participant.username}</div>
    {!participant.isAdmin && isLoggedUserAdmin && (
      <div className={styles.checkbox}>
        <CheckBox onChange={(e) => onChecked(e.target.checked)} />
      </div>
    )}
    {participant.isAdmin && (
      <div className={styles.admin}>
        <span>admin</span>
      </div>
    )}
  </li>
);

export default Participant;
