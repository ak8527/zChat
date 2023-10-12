import Modal from 'react-modal';

import * as serviceWorkerRegistration from '../../../../../serviceWorkerRegistration';
import styles from './NotificationModal.module.css';

const NotificationModal = ({ isOpen, closeModal }) => {
  const requestPermission = () => {
    if (Notification.permission === 'granted') {
      serviceWorkerRegistration.register();
      closeModal();
    } else {
      Notification.requestPermission()
        .then((res) => {
          serviceWorkerRegistration.register();
          closeModal();
        })
        .catch((err) => console.log(err));
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      className={styles.modal}
      overlayClassName={styles.overlay}
      onRequestClose={() => closeModal()}
      shouldCloseOnEsc={true}
    >
      <div className={styles.title}>Notification?</div>
      <p className={styles.description}>Do you want show notification?</p>
      <div className={styles.btn}>
        <button
          className={`${styles.btn} ${styles.denyBtn}`}
          onClick={() => {
            serviceWorkerRegistration.unregister();
            closeModal();
          }}
        >
          DENY
        </button>
        <button
          className={`${styles.btn} ${styles.allowBtn}`}
          onClick={requestPermission}
        >
          ALLOW
        </button>
      </div>
    </Modal>
  );
};

export default NotificationModal;
