import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Outlet, Navigate } from 'react-router-dom';

import { getRefreshToken } from '../../store/auth/authMiddleware';
import { getAccessToken } from '../../store/auth/authSlice';
import useLocalStorage from '../../hooks/useLocalStorage';
import Loader from '../Loader/Loader';

const PersistLogin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isRefreshTokenCalled = useRef(null);
  const token = useSelector(getAccessToken);
  const [persist] = useLocalStorage('persist', false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!token && persist) setIsLoading(true);
  }, [token, persist]);

  useEffect(() => {
    if (!isRefreshTokenCalled.current && isLoading) {
      isRefreshTokenCalled.current = true;
      dispatch(getRefreshToken())
        .unwrap()
        .then(() => {
          setIsLoading(false);
        })
        .catch((err) => {
          navigate('/login', {
            replace: true,
          });
        });
    }
  }, [isLoading, dispatch, navigate]);

  return (
    <>
      {token ? (
        <Outlet />
      ) : !persist ? (
        <Navigate to={'/login'} replace />
      ) : (
        <></>
      )}
      <Loader isOpen={isLoading} />
    </>
  );
};

export default PersistLogin;
