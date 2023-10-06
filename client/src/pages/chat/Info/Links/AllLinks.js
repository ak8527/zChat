import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import { getAllMessages } from '../../../../store/chat/chatSlice';
import MESSAGE_TYPE from '../../../../utils/messageType';
import Nav from '../Nav/Nav';
import Link from './Link';
import styles from './AllLinks.module.css';

const AllLinks = () => {
  const { id: roomId } = useParams();
  const allRoomMessages = useSelector(getAllMessages);
  const messages = allRoomMessages[roomId];
  const links = [];

  messages?.forEach((message) => {
    if (message.type === MESSAGE_TYPE.URL) links.push(message);
  });

  return (
    <div className={styles.links}>
      <Nav>{'Links'}</Nav>
      <ul>
        {links.toReversed().map((link) => (
          <Link key={link._id} link={link.text} />
        ))}
      </ul>
    </div>
  );
};

export default AllLinks;
