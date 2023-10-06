import { useSelector } from 'react-redux';

import { getAuthError } from '../../../store/auth/authSlice';
import styles from './Error.module.css';

const Error = () => {
  const authError = useSelector(getAuthError);

  return <>{authError && <div className={styles.error}>{authError}</div>}</>;
};

export default Error;
