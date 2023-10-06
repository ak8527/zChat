import { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { chatActions } from '../../../../store/chat/chatSlice';
import { postCreatePrivateRoom } from '../../../../store/chat/chatMiddleware';
import useWindowDimensions from '../../../../hooks/useWindowDimensions';
import BackArrowSvg from '../../../../components/Svg/BackArrowSvg';
import User from './User';
import Loader from '../../../../components/Loader/Loader';
import useSearchUser from '../../../../hooks/useSearchUser';
import styles from './SearchUser.module.css';

const SearchUser = () => {
  const { width } = useWindowDimensions();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userList, setNameInput } = useSearchUser();
  const [isLoading, setIsLoading] = useState(false);

  const createNewRoom = useCallback(
    (receiverId) => {
      const data = { receiverId };
      setIsLoading(true);
      dispatch(postCreatePrivateRoom(data))
        .unwrap()
        .then((response) => {
          dispatch(
            chatActions.addNewRoomReq({
              roomId: response?.data?.room?._id,
            })
          );
          navigate(
            `${width > 960 ? '/home/chat' : '/chat'}/${response.data.room._id}`
          );
        })
        .catch((err) => {
          console.error('Error', err.message);
        })
        .finally(() => {
          setIsLoading(false);
        });
    },
    [width, dispatch, navigate]
  );

  return (
    <div className={styles.search}>
      <div className={styles.input}>
        <span
          onClick={() => {
            navigate('/home');
          }}
        >
          <BackArrowSvg />
        </span>
        <input
          placeholder='Search User...'
          onChange={(e) => setNameInput(e.target.value)}
        />
      </div>
      <ul>
        {userList.map((user) => (
          <User
            key={user._id}
            user={user}
            onClick={() => {
              createNewRoom(user._id);
            }}
          />
        ))}
      </ul>
      <Loader isOpen={isLoading} />
    </div>
  );
};

export default SearchUser;
