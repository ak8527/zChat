import { Navigate, useOutlet } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { getSocketStatus } from '../../../store/chat/chatSlice';
import Nav from './Nav/Nav';
import Media from './Media/Media';
import Profile from './Profile/Profile';
import RoomBtn from './RoomBtn/RoomBtn';
import Participants from './Participants/Participants';
import styles from './Info.module.css';

const Info = () => {
  const outlet = useOutlet();
  const isSocketConnected = useSelector(getSocketStatus);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isEditing && outlet) {
      setIsEditing(false);
    }
  }, [isEditing, outlet]);

  return (
    <>
      {isSocketConnected ? (
        outlet ? (
          <div className={styles.outlet}>{outlet}</div>
        ) : (
          <div className={styles.info}>
            <Nav
              editBtn={true}
              isEditing={isEditing}
              onEdit={() => setIsEditing((prev) => !prev)}
              onLoad={() => setIsLoading((prev) => !prev)}
            />
            <div className={styles.content}>
              <Profile
                isLoading={isLoading}
                isEditing={isEditing}
                onEdit={() => setIsEditing((prev) => !prev)}
                onLoad={() => setIsLoading((prev) => !prev)}
              />
              <Participants />
              <Media />
              <RoomBtn />
            </div>
          </div>
        )
      ) : (
        <Navigate to={'/home'} />
      )}
    </>
  );
};

export default Info;
