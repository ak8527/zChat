import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Navigate, useNavigate, useParams } from 'react-router-dom';

import {
  getRooms,
  chatActions,
  getRoomUsersInfo,
} from '../../../../store/chat/chatSlice';
import { getUsers } from '../../../../store/chat/chatMiddleware';
import { getUserInfo } from '../../../../store/user/userSlice';
import { postRemoveParticipants } from '../../../../store/chat/chatMiddleware';
import Button from '../../../../components/Button/Button';
import Nav from '../Nav/Nav';
import Loader from '../../../../components/Loader/Loader';
import Participant from './Participant';
import styles from './AllParticipants.module.css';

const AllParticipants = () => {
  const { id: roomId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const rooms = useSelector(getRooms);
  const loggedUser = useSelector(getUserInfo);
  const room = rooms.find((room) => room._id === roomId);
  const allRoomUsersInfo = useSelector(getRoomUsersInfo);
  const participants = allRoomUsersInfo[roomId]; // Object
  const isLoggedUserAdmin = loggedUser?.userId === room?.admin;
  const [isLoading, setIsLoading] = useState(false);
  const [removeParticipantList, setRemoveParticipantList] = useState([]);

  const userSize = room?.users?.length ?? -1;
  const participantSize = participants ? Object.keys(participants).length : -1;
  const isGroup = room?.isGroup ?? false;

  useEffect(() => {
    const data = { roomId };
    if (isGroup && userSize !== participantSize) dispatch(getUsers(data));
  }, [isGroup, userSize, participantSize, dispatch, roomId]);

  useEffect(() => {
    if (isLoading) {
      const data = { roomId: roomId, participants: removeParticipantList };
      dispatch(postRemoveParticipants(data))
        .unwrap()
        .then((res) => {
          dispatch(
            chatActions.updateRoomReq({
              roomId: roomId,
            })
          );
        })
        .catch((err) => {
          console.log('Error:', false);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [isLoading, roomId, dispatch, removeParticipantList]);

  return (
    <>
      {!loggedUser || !room ? (
        <Navigate to={'/home'} />
      ) : (
        <div className={styles.participants}>
          <Nav onBack={() => navigate(-1)}>{'Participants'}</Nav>
          <ul>
            {Object.values(participants).map((participant) => (
              <Participant
                key={participant._id}
                isLoggedUserAdmin={isLoggedUserAdmin}
                onChecked={(value) => {
                  setRemoveParticipantList((prev) => {
                    return value
                      ? [...prev, participant._id]
                      : prev.filter((id) => id !== participant._id);
                  });
                }}
                participant={{
                  ...participant,
                  isAdmin: room.admin === participant._id,
                }}
              />
            ))}
          </ul>
          {isLoggedUserAdmin && (
            <div>
              <Button
                disabled={removeParticipantList.length > 0 ? false : true}
                onClick={() => setIsLoading(true)}
              >
                {'Remove Participants'}
              </Button>
            </div>
          )}
        </div>
      )}
      <Loader isOpen={isLoading} />
    </>
  );
};

export default AllParticipants;
