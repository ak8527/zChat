import Modal from 'react-modal';
import { useNavigate } from 'react-router-dom';

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
      // onRequestClose={() => closeModal()}
      shouldCloseOnOverlayClick={true}
    >
      {/* <img className={styles.succeed} src={succeed} alt='Logo' /> */}
      <SucceedSvg />
      <h4>Your account has been created successfully!</h4>
      <div className={styles.button} onClick={submitHandler}>
        <div>GET STARTED</div>
        <ArrowRightSvg />
        {/* <img src={arrow} alt='Get Started Button' /> */}
      </div>
    </Modal>
  );
};

export default SignupModal;
