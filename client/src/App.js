import { Routes, Route, Navigate, useLocation } from 'react-router-dom';

import useWindowDimensions from './hooks/useWindowDimensions';
import Login from './pages/auth/Login/Login';
import Signup from './pages/auth/Signup/Signup';
import ResetPassword from './pages/auth/ResetPassword/ResetPassword';
import ForgotPassword from './pages/auth/ForgotPassword/ForgotPassword';
import Auth from './pages/auth/Auth';
import PersistLogin from './components/PersistLogin/PersistLogin';
import RequiredAuth from './pages/chat/RequiredAuth';
import RootPage from './pages/RootPage';
import Home from './pages/chat/Home/Home';
import Chat from './pages/chat/Chat/Chat';
import Search from './pages/chat/Search/Search';
import Info from './pages/chat/Info/Info';
import Page404 from './pages/404/Page404';
import AllLinks from './pages/chat/Info/Links/AllLinks';
import AllFiles from './pages/chat/Info/Files/AllFiles';
import AllPhotos from './pages/chat/Info/Photos/AllPhotos';
import AllParticipants from './pages/chat/Info/Participants/AllParticipants';

const App = () => {
  const { width } = useWindowDimensions();
  const location = useLocation();

  return (
    <Routes>
      <Route path='/' element={<RootPage />}>
        <Route index element={<Navigate to='/home' />} />
        <Route element={<Auth />}>
          <Route path='login' element={<Login />} />
          <Route path='signup' element={<Signup />} />
          <Route path='resetPassword' element={<ResetPassword />} />
          <Route path='forgotPassword' element={<ForgotPassword />} />
        </Route>
        <Route element={<PersistLogin />}>
          <Route element={<RequiredAuth />}>
            {width < 960 ? (
              <Route>
                <Route path='home' element={<Home />} />
                <Route path='search' element={<Search />} />
                <Route path='chat/:id' element={<Chat />} />
                <Route path='chat/:id/info' element={<Info />}>
                  <Route path='files' element={<AllFiles />} />
                  <Route path='photos' element={<AllPhotos />} />
                  <Route path='participants' element={<AllParticipants />} />
                  <Route path='links' element={<AllLinks />} />
                </Route>
                <Route
                  path='home/chat/:id/*'
                  element={
                    <Navigate to={location.pathname.replace('/home', '')} />
                  }
                />
              </Route>
            ) : (
              <Route>
                <Route path='home' element={<Home />}>
                  <Route path='chat/:id' element={<Chat />}>
                    <Route path='info' element={<Info />}>
                      <Route path='files' element={<AllFiles />} />
                      <Route path='photos' element={<AllPhotos />} />
                      <Route
                        path='participants'
                        element={<AllParticipants />}
                      />
                      <Route path='links' element={<AllLinks />} />
                    </Route>
                  </Route>
                </Route>
                <Route path='search' element={<Search />} />
                <Route
                  path='chat/:id/*'
                  element={<Navigate to={`/home${location.pathname}`} />}
                />
              </Route>
            )}
          </Route>
        </Route>
        <Route path='/*' element={<Page404 />} />
      </Route>
    </Routes>
  );
};

export default App;
