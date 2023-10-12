import { useOutlet } from 'react-router-dom';

import Nav from './Nav/Nav';
import Rooms from './Rooms/Rooms';
import SearchBtn from './SearchBtn/SearchBtn';
import backgroundImage from '../../../assets/chat-background.png';
import styles from './Home.module.css';

const Home = () => {
  const outlet = useOutlet();

  return (
    <div className={styles.container}>
      <div className={styles.home}>
        <Nav />
        <Rooms />
        {/* <SearchBtn /> */}
      </div>
      <div className={styles.outlet}>
        <div className={`${styles.image} ${outlet ? styles.hideImage : ''}`}>
          <img src={backgroundImage} alt='Background' />
          <p>Select a user to start conversation</p>
        </div>
        {outlet}
      </div>
    </div>
  );
};

export default Home;
