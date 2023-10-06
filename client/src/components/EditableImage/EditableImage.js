import { useRef } from 'react';

import EditSvg from '../Svg/EditSvg';
import Image from '../Image/Image';
import styles from './EditableImage.module.css';

const EditableImage = ({
  src,
  edit,
  option,
  isGroup,
  className,
  onImageSelected,
}) => {
  const imageInputRef = useRef(null);

  return (
    <div className={`${styles.container} ${className ?? ''}`}>
      <Image
        className={styles.image}
        src={src}
        option={option}
        isGroup={isGroup}
      />
      {edit && (
        <span
          onClick={() => imageInputRef.current.click()}
          className={styles.editSvg}
        >
          <EditSvg />
        </span>
      )}
      <input
        ref={imageInputRef}
        type={'file'}
        onChange={(e) => {
          if (
            e.target.files &&
            e.target.files[0] &&
            e.target.files[0].type.includes('image')
          )
            onImageSelected(e.target.files[0]);
        }}
        hidden
      />
    </div>
  );
};

export default EditableImage;
