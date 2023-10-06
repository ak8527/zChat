import { useDispatch, useSelector } from 'react-redux';
import Modal from 'react-modal';

import { getModalState, modalActions } from '../../../store/modal/modalSlice';
import BackArrowSvg from '../../../components/Svg/BackArrowSvg';
import styles from './ImageModal.module.css';

const ImageModal = () => {
  const dispatch = useDispatch();
  const modalState = useSelector(getModalState);

  return (
    <Modal
      isOpen={modalState.isOpen}
      className={styles.modal}
      onRequestClose={() => dispatch(modalActions.closeImageModal())}
      overlayClassName={styles.overlay}
      shouldCloseOnEsc={true}
    >
      <img src={modalState.src} alt={'img_modal'} />
      <div>
        <span onClick={() => dispatch(modalActions.closeImageModal())}>
          <BackArrowSvg />
        </span>
        <span className={styles.title}>{modalState.title ?? 'Photo'}</span>
      </div>
    </Modal>
  );
};

export default ImageModal;
