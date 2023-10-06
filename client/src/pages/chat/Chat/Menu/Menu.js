import styles from './Menu.module.css';

const Menu = ({ isGroup, onClose, onLeave, onBlock, onNavigate }) => {
  return (
    <>
      <menu className={styles.menu}>
        <li onClick={onNavigate}>{`${
          isGroup ? 'Group Info' : 'Contact Info'
        }`}</li>
        {isGroup ? (
          <li onClick={onLeave}>{'Exit Group'}</li>
        ) : (
          <li onClick={onBlock}>{'Block Contact'}</li>
        )}
      </menu>
      <div className={styles.overlay} onClick={onClose}></div>
    </>
  );
};

export default Menu;
