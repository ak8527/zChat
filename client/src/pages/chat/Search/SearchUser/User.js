import Image from '../../../../components/Image/Image';
import styles from './User.module.css';

const User = ({ user, onClick }) => (
  <li className={styles.userInfo} onClick={onClick}>
    <Image className={styles.image} src={user.imageUrl} />
    <div className={styles.user}>
      <div className={styles.username}>{user.username}</div>
      <div className={styles.email}>{user.email}</div>
    </div>
  </li>
);

export default User;
