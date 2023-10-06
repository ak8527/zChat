import { useEffect } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { getUserId } from '../../store/user/userSlice';
import { postUserInfo } from '../../store/user/userMiddleware';
import { getAccessToken } from '../../store/auth/authSlice';
import { chatActions, getSocketStatus } from '../../store/chat/chatSlice';
import ResponseModal from './Home/Modal/Response/ResponseModal';
import WebrtcModal from './Home/Modal/Webrtc/WebrtcModal';
import ImageModal from './Modal/ImageModal';

const RequiredAuth = () => {
  const dispatch = useDispatch();
  const token = useSelector(getAccessToken);
  const loggedUserId = useSelector(getUserId);
  const socketConnected = useSelector(getSocketStatus);

  useEffect(() => {
    if (!loggedUserId) dispatch(postUserInfo());
  }, [dispatch, loggedUserId]);

  useEffect(() => {
    if (!socketConnected) dispatch(chatActions.startConnecting());
  }, [dispatch, socketConnected]);

  return (
    <>
      {token ? (
        <>
          <ResponseModal />
          <WebrtcModal />
          <ImageModal />
          <Outlet />
        </>
      ) : (
        <Navigate to={'/login'} />
      )}
    </>
  );
};

export default RequiredAuth;
