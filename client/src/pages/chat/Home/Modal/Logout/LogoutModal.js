import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Modal from 'react-modal';

import { postLogout } from '../../../../../store/auth/authMiddleware';
import { authActions } from '../../../../../store/auth/authSlice';
import { userActions } from '../../../../../store/user/userSlice';
import { chatActions } from '../../../../../store/chat/chatSlice';
import styles from './LogoutModal.module.css';

const LogoutModal = ({ isOpen, closeModal }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onLogout = useCallback(async () => {
    try {
      await dispatch(postLogout()).unwrap();
      dispatch(chatActions.socketDisconnect());
    } catch (err) {
      console.log('Error:', err);
    } finally {
      dispatch(chatActions.resetChatState());
      dispatch(authActions.resetAuthState());
      dispatch(userActions.resetUserState());
      navigate('/login', { replace: true });
    }
  }, [dispatch, navigate]);

  return (
    <Modal
      isOpen={isOpen}
      className={styles.modal}
      overlayClassName={styles.overlay}
      shouldCloseOnEsc={false}
    >
      <div>Logout?</div>
      <div>Are you sure you want to logout?</div>
      <div className={styles.button}>
        <button className={styles.cancelBtn} onClick={closeModal}>
          CANCEL
        </button>
        <button className={styles.logoutBtn} onClick={onLogout}>
          LOG OUT
        </button>
      </div>
    </Modal>
  );
};

export default LogoutModal;
