import { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';

import { getDate } from '../../../../utils/dateTime';
import { getUserId } from '../../../../store/user/userSlice';
import { chatActions } from '../../../../store/chat/chatSlice';
import { getAllMessages } from '../../../../store/chat/chatSlice';
import { getRooms, getAllJoinRooms } from '../../../../store/chat/chatSlice';
import AnnouncementMessage from '../Message/AnnouncementMessage';
import ReceiveMessages from '../Message/ReceiveMessage';
import SendMessage from '../Message/SendMessage';
import DateMessage from '../Message/DateMessage';
import MESSAGE_TYPE from '../../../../utils/messageType';

const Messages = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const messagesRef = useRef(null);
  // const messageEndRef = useRef(null);
  const rooms = useSelector(getRooms);
  const loggedUserId = useSelector(getUserId);
  const joinRooms = useSelector(getAllJoinRooms);
  const allRoomMessages = useSelector(getAllMessages);
  const room = rooms?.find((room) => room._id === id);
  const messages = allRoomMessages[room?._id];
  const chatRoomJoined = joinRooms.includes(room?._id);
  let previousMessage = null;
  let previousDate = null;

  useEffect(() => {
    if (!chatRoomJoined) dispatch(chatActions.joinRoomReq({ roomId: id }));
  }, [id, dispatch, chatRoomJoined]);

  useEffect(() => {
    if (chatRoomJoined) dispatch(chatActions.messagesReq({ roomId: id }));
  }, [id, dispatch, chatRoomJoined]);

  useEffect(() => {
    // if (messageEndRef.current)
    //   messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
    if (messagesRef.current)
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
  }, [messages]);

  return (
    <ul ref={messagesRef}>
      {messages &&
        messages.map((message, index) => {
          // console.log('Messages.js Called..');
          const isDateSame =
            getDate(message.date).toString() ===
            getDate(previousDate).toString();
          const isMessageAuthorSame =
            previousMessage?.type === MESSAGE_TYPE.ANNOUNCEMENT
              ? false
              : previousMessage?.author?.authorId ===
                  message?.author?.authorId && isDateSame;
          previousMessage = { ...message };
          previousDate = message.date;
          return (
            <li key={message._id}>
              {!isDateSame && <DateMessage date={message.date} />}
              {message.type === MESSAGE_TYPE.ANNOUNCEMENT ? (
                <AnnouncementMessage message={message} />
              ) : loggedUserId === message.author.authorId ? (
                <SendMessage
                  message={message}
                  isGroup={room.isGroup}
                  isAuthorSame={isMessageAuthorSame}
                />
              ) : (
                <ReceiveMessages
                  isGroup={room.isGroup}
                  message={message}
                  isAuthorSame={isMessageAuthorSame}
                />
              )}
              {message.type !== MESSAGE_TYPE.ANNOUNCEMENT &&
                messages[index + 1]?.type !== MESSAGE_TYPE.ANNOUNCEMENT &&
                message.author.authorId !==
                  messages[index + 1]?.author.authorId && <br />}
            </li>
          );
        })}
      {/* <div ref={messageEndRef}></div> */}
    </ul>
  );
};

export default Messages;
