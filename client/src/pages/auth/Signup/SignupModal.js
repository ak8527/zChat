import { useNavigate } from 'react-router-dom';
import Modal from 'react-modal';

import ArrowRightSvg from '../../../components/Svg/ArrowRightSvg';
import SucceedSvg from '../../../components/Svg/SucceedSvg';
import styles from './SignupModal.module.css';

Modal.setAppElement('#root');

const SignupModal = ({ isOpen, closeModal }) => {
  const navigate = useNavigate();

  const submitHandler = () => {
    closeModal();
    navigate('/login');
  };

  return (
    <Modal
      overlayClassName={styles.overlay}
      className={styles.modal}
      isOpen={isOpen}
      shouldCloseOnOverlayClick={true}
    >
      <SucceedSvg />
      <p>Your account has been created successfully!</p>
      <div className={styles.button} onClick={submitHandler}>
        <div>GET STARTED</div>
        <ArrowRightSvg />
      </div>
    </Modal>
  );
};

export default SignupModal;
