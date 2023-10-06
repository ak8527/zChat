import Modal from 'react-modal';

import styles from './Loader.module.css';

const Loader = ({ isOpen }) => {
  return (
    <Modal
      className={styles.modal}
      isOpen={isOpen}
      overlayClassName={styles.overlay}
      shouldCloseOnEsc={false}
      shouldCloseOnOverlayClick={false}
    >
      <div className={styles.spinner}>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </Modal>
  );
};

export default Loader;
