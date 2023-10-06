import CloseSvg from '../../../../../../components/Svg/CloseSvg';
import User from '../../../../Search/SearchUser/User';
import Participant from '../Participant/Participant';
import Button from '../../../../../../components/Button/Button';
import useSearchUser from '../../../../../../hooks/useSearchUser';
import styles from './SearchUser.module.css';

const SearchUser = ({
  participants,
  onClose,
  onUserSelected,
  onAddParticipant,
  onRemoveParticipant,
}) => {
  const { userList, setNameInput } = useSearchUser();

  return (
    <div className={styles.container}>
      <div className={styles.input}>
        <span onClick={onClose}>
          <CloseSvg />
        </span>
        <input
          placeholder='Search User...'
          onChange={(e) => setNameInput(e.target.value)}
        />
      </div>
      <ul className={styles.participants}>
        {participants.map((participant) => (
          <Participant
            key={participant._id}
            user={participant}
            onClick={() => {
              onRemoveParticipant(participant);
            }}
          />
        ))}
      </ul>
      <ul className={styles.users}>
        {userList.map((user) => (
          <User
            key={user._id}
            user={user}
            onClick={() => {
              onAddParticipant(user);
            }}
          />
        ))}
      </ul>
      {participants.length > 0 && (
        <div className={styles.button}>
          <Button onClick={onUserSelected}>{'Continue'}</Button>
        </div>
      )}
    </div>
  );
};

export default SearchUser;
