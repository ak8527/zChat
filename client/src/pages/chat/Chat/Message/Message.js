import LinkMessage from './LinkMessage';
import TextMessage from './TextMessage';
import FileMessage from './FileMessage';
import ImageMessage from './ImageMessage';
import VideoMessage from './VideoMessage';
import AudioMessage from './AudioMessage';
import MESSAGE_TYPE from '../../../../utils/messageType';

const Message = ({ message }) => {
  const { type } = message;
  if (type === MESSAGE_TYPE.TEXT) return <TextMessage message={message} />;
  else if (type === MESSAGE_TYPE.URL) return <LinkMessage message={message} />;
  else if (type === MESSAGE_TYPE.IMAGE)
    return <ImageMessage message={message} />;
  else if (type === MESSAGE_TYPE.VIDEO)
    return <VideoMessage message={message} />;
  else if (type === MESSAGE_TYPE.AUDIO)
    return <AudioMessage message={message} />;
  else if (type === MESSAGE_TYPE.FILE) return <FileMessage message={message} />;
  else return <></>;
};
export default Message;
