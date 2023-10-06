import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

import { getRooms } from '../../../../store/chat/chatSlice';
import CheckSvg from '../../../../components/Svg/CheckSvg';
import CloseSvg from '../../../../components/Svg/CloseSvg';
import styles from './Nav.module.css';

const Nav = ({ isEditing, onEdit, onLoad, children, editBtn }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const rooms = useSelector(getRooms);
  const room = rooms.find((room) => room._id === id);

  return (
    <nav className={styles.nav}>
      <span
        onClick={() => {
          if (isEditing) onEdit();
          else navigate(-1);
        }}
      >
        <CloseSvg />
      </span>
      {!isEditing && (
        <div>
          {children ?? `${room?.isGroup ? 'Group Info' : 'Contact Info'}`}
        </div>
      )}
      {room?.isGroup &&
        editBtn &&
        (isEditing ? (
          <span className={styles.edit} onClick={onLoad}>
            <CheckSvg />
          </span>
        ) : (
          <span className={styles.edit} onClick={onEdit}>
            Edit
          </span>
        ))}
    </nav>
  );
};

export default Nav;
