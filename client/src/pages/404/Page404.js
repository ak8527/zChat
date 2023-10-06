import { useNavigate } from 'react-router-dom';

import styles from './Page404.module.css';

const Page404 = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.page}>
      <span>Oops!</span>
      <div>404 - PAGE NOT FOUND</div>
      <p>
        The page you are looking for might have been removed, had its name
        changed or is temporarily unavailable.
      </p>
      <button
        onClick={() =>
          navigate('/', {
            replace: true,
          })
        }
      >
        GO TO HOMEPAGE
      </button>
    </div>
  );
};

export default Page404;
