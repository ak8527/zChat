import { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';

import backgroundImage from '../../assets/home-background.png';
import BrandLogoSvg from '../../components/Svg/BrandLogoSvg';
import styles from './Auth.module.css';

const Auth = () => {
  const [isBackgroundImageLoaded, setIsBackgroundImageLoaded] = useState(false);

  return (
    <>
      <Link className={styles.logo} to='/login'>
        <BrandLogoSvg />
        <span>zChat</span>
      </Link>
      <div className={styles.auth}>
        <div className={styles.background}>
          <img
            className={`${styles.backgroundImage} ${
              isBackgroundImageLoaded ? styles.loaded : ''
            }`}
            src={backgroundImage}
            alt='Background'
            loading={'lazy'}
            onLoad={() => setIsBackgroundImageLoaded(true)}
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
