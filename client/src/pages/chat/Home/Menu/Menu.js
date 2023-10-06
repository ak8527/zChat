import styles from './Menu.module.css';

const Menu = ({
  onClose,
  onLogoutClick,
  onProfileClick,
  onNewGroupClick,
  onBlockContactsClick,
  onNotificationClick,
}) => (
  <>
    <menu className={styles.menu}>
      <li onClick={onProfileClick}>Profile</li>
      <li onClick={onNewGroupClick}>New Group</li>
      <li onClick={onBlockContactsClick}>Blocked Contacts</li>
      <li onClick={onNotificationClick}>Notifications</li>
      <li onClick={onLogoutClick}>Logout</li>
    </menu>
    <div className={styles.overlay} onClick={onClose}></div>
  </>
);

export default Menu;
