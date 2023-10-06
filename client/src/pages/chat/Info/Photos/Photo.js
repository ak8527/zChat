import { useDispatch } from 'react-redux';
import styles from './Photo.module.css';
import { modalActions } from '../../../../store/modal/modalSlice';

const Photo = ({ src }) => {
  const dispatch = useDispatch();

  return (
    <li
      className={styles.photo}
      onClick={() => dispatch(modalActions.showImageModal({ src: src }))}
    >
      <img loading={'lazy'} src={src} alt='Photos' />
    </li>
  );
};

export default Photo;
