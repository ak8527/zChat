import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Modal from 'react-modal';

import { chatActions } from '../../../../../store/chat/chatSlice';
import { postCreateGroupRoom } from '../../../../../store/chat/chatMiddleware';
import useWindowDimensions from '../../../../../hooks/useWindowDimensions';
import SearchUser from './SearchUser/SearchUser';
import Group from './Group/Group';
import styles from './NewGroupModal.module.css';

const NewGroupModal = ({ isOpen, closeModal }) => {
  const { width } = useWindowDimensions;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [participants, setParticipants] = useState([]);
  const [userSelected, setUserSelected] = useState(false);

  const resetModal = useCallback(() => {
    setParticipants([]);
    setUserSelected(false);
    closeModal();
  }, [closeModal]);

  const createNewRoom = useCallback(
    (data) => {
      dispatch(postCreateGroupRoom(data))
        .unwrap()
        .then((res) => {
          dispatch(chatActions.addNewRoomReq({ roomId: res.data.room._id }));
          navigate(
            `${width < 960 ? '/chat' : '/home/chat/'}${res.data.room._id}`
          );
        })
        .catch((err) => {
          console.log('Error:', err);
        })
        .finally(() => {
          setParticipants([]);
          setUserSelected(false);
          closeModal();
        });
    },
    [width, navigate, dispatch, closeModal, setParticipants]
  );

  const addParticipant = useCallback(
    (participant) => {
      const participantId = participant._id;
      const participantIndex = participants.findIndex(
        (participant) => participant._id === participantId
      );
      if (participantIndex >= 0) return;
      if (participants.length >= 9)
        dispatch(
          chatActions.setResponse({
            data: { error: 'Maximum 10 user are allowed' },
          })
        );
      else
        setParticipants((prevParticipants) => [
          ...prevParticipants,
          participant,
        ]);
    },
    [participants, dispatch]
  );

  const removeParticipant = useCallback(
    (participant) => {
      const participantId = participant._id;
      const newParticipants = participants.filter(
        (participant) => participant._id !== participantId
      );
      if (userSelected && newParticipants.length === 0) setUserSelected(false);
      setParticipants(() => newParticipants);
    },
    [participants, userSelected]
  );

  return (
    <Modal
      isOpen={isOpen}
      className={styles.modal}
      overlayClassName={styles.overlay}
      shouldCloseOnEsc={false}
    >
      {!userSelected && (
        <SearchUser
          onClose={resetModal}
          participants={participants}
          onAddParticipant={addParticipant}
          onRemoveParticipant={removeParticipant}
          onUserSelected={() => {
            setUserSelected(true);
          }}
        />
      )}
      {userSelected && participants.length > 0 && (
        <Group
          participants={participants}
          onBack={() => setUserSelected(false)}
          onRemoveParticipant={removeParticipant}
          onCreateNewRoom={createNewRoom}
        />
      )}
    </Modal>
  );
};

export default NewGroupModal;
