import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from 'react-modal';

import ResetEmailSvg from '../../../components/Svg/ResetEmailSvg';
import styles from './ForgotPasswordModal.module.css';

const ForgotPasswordModal = ({ isOpen, closeModal }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (isOpen) {
        closeModal();
        navigate('/login', { replace: true });
      }
    }, 5000);
    return () => {
      clearTimeout(timer);
    };
  }, [closeModal, navigate, isOpen]);

  return (
    <Modal
      isOpen={isOpen}
      className={styles.modal}
      overlayClassName={styles.overlay}
      onRequestClose={() => closeModal()}
      shouldCloseOnEsc={true}
      shouldCloseOnOverlayClick={true}
    >
      <ResetEmailSvg />
      <div>Check your mail</div>
      <p>We have sent password reset instruction to your email</p>
    </Modal>
  );
};

export default ForgotPasswordModal;
