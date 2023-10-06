import { useState } from 'react';
import { useSelector } from 'react-redux';

import { getImageUrl } from '../../../../store/user/userSlice';
import NotificationModal from '../Modal/Notification/NotificationModal';
import BlockedRoomModal from '../Modal/BlockedContacts/BlockedRoomModal';
import NewGroupModal from '../Modal/NewGroup/NewGroupModal';
import ProfileModal from '../Modal/Profile/ProfileModal';
import LogoutModal from '../Modal/Logout/LogoutModal';
import KebabMenu from '../../../../components/Svg/KebabSvg';
import Image from '../../../../components/Image/Image';
import Menu from '../Menu/Menu';
import styles from './Nav.module.css';

const Nav = () => {
  const userImageUrl = useSelector(getImageUrl);
  const [showMenu, setShowMenu] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showNewGroupModal, setShowNewGroupModal] = useState(false);
  const [showBlockedRoomModal, setShowBlockedRoomModal] = useState(false);
  const [showNotificationModal, setShowNotificationModal] = useState(false);

  return (
    <>
      <nav className={styles.nav}>
        <Image className={styles.image} src={userImageUrl} />
        <span onClick={() => setShowMenu(true)}>
          <KebabMenu />
        </span>
        {showMenu && (
          <Menu
            onClose={() => setShowMenu(false)}
            onLogoutClick={() => {
              setShowMenu(false);
              setShowLogoutModal(true);
            }}
            onNewGroupClick={() => {
              setShowMenu(false);
              setShowNewGroupModal(true);
            }}
            onNotificationClick={() => {
              setShowMenu(false);
              setShowNotificationModal(true);
            }}
            onBlockContactsClick={() => {
              setShowMenu(false);
              setShowBlockedRoomModal(true);
            }}
            onProfileClick={() => {
              setShowMenu(false);
              setShowProfileModal(true);
            }}
          />
        )}
      </nav>
      <LogoutModal
        isOpen={showLogoutModal}
        closeModal={() => setShowLogoutModal(false)}
      />
      <NewGroupModal
        isOpen={showNewGroupModal}
        closeModal={() => setShowNewGroupModal(false)}
      />
      <ProfileModal
        isOpen={showProfileModal}
        closeModal={() => setShowProfileModal(false)}
      />
      <NotificationModal
        isOpen={showNotificationModal}
        closeModal={() => setShowNotificationModal(false)}
      />
      <BlockedRoomModal
        isOpen={showBlockedRoomModal}
        closeModal={() => setShowBlockedRoomModal(false)}
      />
    </>
  );
};

export default Nav;
