import { useDispatch } from 'react-redux';
import { useState, useEffect } from 'react';

import { modalActions } from '../../store/modal/modalSlice';
import UserIconSvg from '../Svg/UserIconSvg';
import GroupIconSvg from '../Svg/GroupIconSvg';
import CameraSvg from '../Svg/CameraSvg';
import styles from './Image.module.css';

const Image = ({ src, title, option, isGroup, onClick, className }) => {
  const dispatch = useDispatch();
  const [imageSrc, setImageSrc] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setImageSrc(src);
  }, [src]);

  return (
    <div className={`${styles.image} ${className ?? ''}`} onClick={onClick}>
      {imageSrc && (
        <img
          alt={'IMG'}
          src={imageSrc}
          loading={'lazy'}
          onClick={(e) => {
            e.stopPropagation();
            dispatch(
              modalActions.showImageModal({
                src: imageSrc,
                title: title,
              })
            );
          }}
          onError={(err) => {
            setIsLoaded(false);
            setImageSrc(null);
          }}
          onLoad={() => {
            setIsLoaded(true);
          }}
        />
      )}
      {!isLoaded && !isGroup && !option && <UserIconSvg />}
      {!isLoaded && isGroup && !option && <GroupIconSvg />}
      {!isLoaded && !isGroup && option && <CameraSvg />}
    </div>
  );
};

export default Image;
