import SearchSvg from '../../../../components/Svg/SearchSvg';
import styles from './Search.module.css';

const Search = ({ onChange }) => (
  <div className={styles.search}>
    <div className={styles.input}>
      <SearchSvg />
      <input placeholder={'Search User'} onChange={onChange} />
    </div>
  </div>
);

export default Search;
