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
      <h1>Check your mail</h1>
      <h2>We have sent password reset instruction to your email</h2>
    </Modal>
  );
};

export default ForgotPasswordModal;
