import { useState, useEffect, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import Modal from 'react-modal';

import { getRooms, chatActions } from '../../../../store/chat/chatSlice';
import { postAddParticipants } from '../../../../store/chat/chatMiddleware';
import SearchUser from '../../Home/Modal/NewGroup/SearchUser/SearchUser';
import Loader from '../../../../components/Loader/Loader';
import styles from './AddParticipantsModal.module.css';

const AddParticipantsModal = ({ isOpen, closeModal }) => {
  const { id: roomId } = useParams();
  const dispatch = useDispatch();
  const rooms = useSelector(getRooms);
  const room = rooms?.find((room) => room._id === roomId);
  const [participants, setParticipants] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const roomUsers = useMemo(() => {
    return room.users.toString();
  }, [room.users]);

  const resetModal = useCallback(() => {
    setParticipants([]);
    setIsLoading(false);
    closeModal();
  }, [closeModal]);

  useEffect(() => {
    if (isLoading && participants.length > 0) {
      const participantsId = participants.map((user) => user._id);
      const data = { roomId: roomId, participants: participantsId };
      dispatch(postAddParticipants(data))
        .unwrap()
        .then((res) => {
          dispatch(
            chatActions.updateRoomReq({
              roomId: roomId,
            })
          );
          resetModal();
        })
        .catch((err) => {
          console.log('Error:', err);
          setIsLoading(false);
        });
    }
  }, [resetModal, isLoading, participants, dispatch, roomId]);

  const addParticipant = useCallback(
    (participant) => {
      const participantId = participant._id;
      const participantIndex = participants.findIndex(
        (participant) => participant._id === participantId
      );
      if (participantIndex >= 0 || roomUsers.includes(participantId)) return;
      else if (room.users.length + participants.length >= 9)
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
    [participants, roomUsers, dispatch, room.users.length]
  );

  const removeParticipant = useCallback(
    (participant) => {
      console.log('RemoveParticpant:', participant._id);
      const participantId = participant._id;
      const newParticipants = participants.filter(
        (participant) => participant._id !== participantId
      );
      if (roomUsers.includes(participantId)) return;
      setParticipants(newParticipants);
    },
    [participants, roomUsers]
  );

  return (
    <>
      <Modal
        isOpen={isOpen}
        className={styles.modal}
        overlayClassName={styles.overlay}
        shouldCloseOnEsc={false}
      >
        <SearchUser
          onClose={resetModal}
          participants={participants}
          onAddParticipant={addParticipant}
          onRemoveParticipant={removeParticipant}
          onUserSelected={() => {
            setIsLoading(true);
          }}
        />
      </Modal>
      <Loader isOpen={isLoading} />
    </>
  );
};
export default AddParticipantsModal;
