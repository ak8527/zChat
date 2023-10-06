import { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useLocation, useParams } from 'react-router-dom';

import { getUsers } from '../../../../store/chat/chatMiddleware';
import { getUserInfo } from '../../../../store/user/userSlice';
import { getRooms, getRoomUsersInfo } from '../../../../store/chat/chatSlice';
import Title from '../Title/Title';
import Participant from './Participant';
import AddParticipantSvg from '../../../../components/Svg/AddParticipantSvg';
import AddParticipantsModal from '../Modal/AddParticipantsModal';
import styles from './Participants.module.css';

const Participants = () => {
  const { id: roomId } = useParams();
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const rooms = useSelector(getRooms);
  const room = rooms.find((room) => room._id === roomId);
  const loggedUser = useSelector(getUserInfo);
  const allRoomUsersInfo = useSelector(getRoomUsersInfo);
  const participants = allRoomUsersInfo[roomId]; // Object
  const [showAddParticipantModal, setShowAddParticipantModal] = useState(false);

  const userSize = room?.users?.length ?? -1;
  const participantSize = participants ? Object.keys(participants).length : -1;
  const isGroup = room?.isGroup ?? false;

  useEffect(() => {
    const data = { roomId };
    if (isGroup && userSize !== participantSize) dispatch(getUsers(data));
  }, [isGroup, userSize, participantSize, dispatch, roomId]);

  const closeModal = useCallback(() => {
    setShowAddParticipantModal(false);
  }, []);

  return (
    <>
      {room?.isGroup && participants && (
        <div className={styles.participants}>
          <Title
            title={`${Object.keys(participants).length} Participants`}
            showAll={true}
            onClick={() => navigate(`${location.pathname}/participants`)}
          />
          {room.admin === loggedUser.userId && (
            <div
              className={styles.addParticipant}
              onClick={() => setShowAddParticipantModal(true)}
            >
              <span>
                <AddParticipantSvg />
              </span>
              <div>Add Participants</div>
            </div>
          )}
          <ul>
            {Object.values(participants)
              .slice(0, 4)
              .map((participant) => (
                <Participant
                  key={participant._id}
                  participant={{
                    ...participant,
                    isAdmin: room.admin === participant._id,
                  }}
                />
              ))}
          </ul>
          {room.admin === loggedUser.userId && (
            <AddParticipantsModal
              isOpen={showAddParticipantModal}
              closeModal={closeModal}
            />
          )}
        </div>
      )}
    </>
  );
};

export default Participants;
