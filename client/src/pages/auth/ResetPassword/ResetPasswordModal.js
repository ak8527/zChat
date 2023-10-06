import { useNavigate } from 'react-router-dom';
import Modal from 'react-modal';

import SucceedSvg from '../../../components/Svg/SucceedSvg';
import Button from '../../../components/Button/Button';
import styles from './ResetPasswordModal.module.css';

const ResetPasswordModal = ({ isOpen, closeModal }) => {
  const navigate = useNavigate();

  return (
    <Modal
      isOpen={isOpen}
      className={styles.modal}
      overlayClassName={styles.overlay}
      onRequestClose={() => closeModal()}
      shouldCloseOnOverlayClick={false}
      shouldCloseOnEsc={false}
    >
      <SucceedSvg />
      <div>Password changed successfully!</div>
      <p>Please login to your email account again</p>
      <Button onClick={() => navigate('/login', { replace: true })}>
        {'Login now'}
      </Button>
    </Modal>
  );
};

export default ResetPasswordModal;
