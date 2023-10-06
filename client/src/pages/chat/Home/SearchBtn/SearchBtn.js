import { Link } from 'react-router-dom';

import MessageSvg from '../../../../components/Svg/MessageSvg';
import styles from './SearchBtn.module.css';

const SearchBtn = () => (
  <Link className={styles.link} to={'/search'}>
    <MessageSvg />
  </Link>
);

export default SearchBtn;
