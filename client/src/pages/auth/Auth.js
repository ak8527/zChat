import { Outlet, Link } from 'react-router-dom';

import backgroundImage from '../../assets/home-background.png';
import BrandLogoSvg from '../../components/Svg/BrandLogoSvg';
import styles from './Auth.module.css';

const Auth = () => {
  return (
    <>
      <Link className={styles.logo} to='/login'>
        <BrandLogoSvg />
        <span>zChat</span>
      </Link>
      <div className={styles.auth}>
        <div>
          <img
            className={styles.backgroundImage}
            src={backgroundImage}
            alt='Background'
          />
        </div>
        <div className={styles.outlet}>
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default Auth;
