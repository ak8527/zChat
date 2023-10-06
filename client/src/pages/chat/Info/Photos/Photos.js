import { useNavigate, useLocation } from 'react-router-dom';

import Title from '../Title/Title';
import Photo from './Photo';
import styles from './Photos.module.css';

const Photos = ({ photos }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const images = photos.toReversed().slice(0, 8);
  return (
    <>
      <div className={styles.photos}>
        <Title
          title='Photos'
          size={photos.length}
          showAll={photos.length > 4}
          onClick={() => navigate(`${location.pathname}/photos`)}
        />
        <ul>
          {images.map((message) => (
            <Photo key={message._id} src={message.text} />
          ))}
        </ul>
      </div>
    </>
  );
};
export default Photos;
