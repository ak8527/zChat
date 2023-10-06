import { Profiler } from 'react';
import { Navigate } from 'react-router-dom';
import { useOutlet } from 'react-router-dom';

import { useSelector } from 'react-redux';
import { getSocketStatus } from '../../../store/chat/chatSlice';
import ChatInput from './ChatInput/ChatInput';
import Messages from './Messages/Messages';
import Nav from './Nav/Nav';
import styles from './Chat.module.css';

const Chat = () => {
  const outlet = useOutlet();
  const isSocketConnected = useSelector(getSocketStatus);

  return (
    <Profiler id='messages' onRender={onRender}>
      {isSocketConnected ? (
        <div className={styles.container}>
          <div className={styles.chat}>
            <Nav />
            <Messages />
            <ChatInput />
          </div>
          <div className={outlet ? styles.outlet : ''}>{outlet}</div>
        </div>
      ) : (
        <Navigate to={'/home'} />
      )}
    </Profiler>
  );
};

function onRender(
  id,
  phase,
  actualDuration,
  baseDuration,
  startTime,
  commitTime
) {
  // Aggregate or log render timings...
  // console.log('Id:', id);
  // console.log('Phase:', phase);
  // console.log('Actual Duration:', actualDuration);
  // console.log('Base Duration:', baseDuration);
  // console.log('Start Time:', startTime);
  // console.log('Commmit Time:', commitTime);
}

export default Chat;
