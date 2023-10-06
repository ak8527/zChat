import SearchUser from './SearchUser/SearchUser';
import backgroundImage from '../../../assets/chat-background.png';
import styles from './Search.module.css';

const Search = () => (
  <div className={styles.search}>
    <div className={styles.usersearch}>
      <SearchUser />
    </div>
    <div className={styles.image}>
      <img src={backgroundImage} alt='Background' />
      <div>Select a user to start conversation</div>
    </div>
  </div>
);

export default Search;
