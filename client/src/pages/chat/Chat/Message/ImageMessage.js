import { useState } from 'react';
import { useDispatch } from 'react-redux';

import { getTime } from '../../../../utils/dateTime';
import { modalActions } from '../../../../store/modal/modalSlice';
import Placeholder from '../../../../components/Svg/PlaceholderSvg';
import styles from './ImageMessage.module.css';

const ImageMessage = ({ message }) => {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  const fileUrl = message.text;
  const date = getTime(message.date);

  return (
    <div className={styles.imageContainer}>
      <div className={styles.image}>
        <img
          loading={'lazy'}
          alt={'send_image'}
          src={fileUrl}
          onLoad={() => setIsLoaded(true)}
          onClick={() =>
            dispatch(modalActions.showImageModal({ src: fileUrl }))
          }
        />
        {!isLoaded && (
          <div className={styles.placeholder}>
            <Placeholder />
          </div>
        )}
        <time>{date}</time>
      </div>
    </div>
  );
};

export default ImageMessage;
