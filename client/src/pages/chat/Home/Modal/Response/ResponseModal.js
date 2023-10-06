import Modal from 'react-modal';
import { useDispatch, useSelector } from 'react-redux';

import CloseSvg from '../../../../../components/Svg/CloseSvg';
import {
  chatActions,
  getChatError,
  getChatSuccess,
} from '../../../../../store/chat/chatSlice';
import {
  getUserError,
  getUserSuccess,
  userActions,
} from '../../../../../store/user/userSlice';
import styles from './ResponseModal.module.css';

const ResponseModal = () => {
  const dispatch = useDispatch();
  const chatError = useSelector(getChatError);
  const userError = useSelector(getUserError);
  const chatSuccess = useSelector(getChatSuccess);
  const userSuccess = useSelector(getUserSuccess);

  let result;
  if (chatError) result = chatError;
  else if (userError) result = userError;
  else if (chatSuccess) result = chatSuccess;
  else if (userSuccess) result = userSuccess;

  const resetMessage = () => {
    if (chatError || chatSuccess) dispatch(chatActions.setResponse());
    else if (userError || userSuccess) dispatch(userActions.setResponse());
  };

  return (
    <Modal
      isOpen={result ? true : false}
      className={styles.modal}
      overlayClassName={styles.overlay}
      shouldCloseOnEsc={false}
    >
      <div
        className={`${styles.container} ${
          chatError || userError
            ? styles.error
            : chatSuccess || userSuccess
            ? styles.success
            : ''
        }`}
      >
        <span>{result}</span>
        <span className={styles.closeSvg} onClick={resetMessage}>
          <CloseSvg />
        </span>
      </div>
    </Modal>
  );
};

export default ResponseModal;
