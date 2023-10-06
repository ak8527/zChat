import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { getAllMessages } from '../../../../store/chat/chatSlice';
import Photos from '../Photos/Photos';
import Files from '../Files/Files';
import Links from '../Links/Links';
import MESSAGE_TYPE from '../../../../utils/messageType';

const Media = () => {
  const { id: roomId } = useParams();
  const allRoomMessages = useSelector(getAllMessages);
  const messages = allRoomMessages[roomId];
  const [media, setMedia] = useState({ files: [], links: [], photos: [] });

  useEffect(() => {
    const mediaFiles = { files: [], links: [], photos: [] };
    messages?.forEach((message) => {
      if (
        message.type === MESSAGE_TYPE.FILE ||
        message.type === MESSAGE_TYPE.AUDIO ||
        message.type === MESSAGE_TYPE.VIDEO
      )
        mediaFiles.files.push(message);
      else if (message.type === MESSAGE_TYPE.IMAGE)
        mediaFiles.photos.push(message);
      else if (message.type === MESSAGE_TYPE.URL)
        mediaFiles.links.push(message);
    });
    setMedia(mediaFiles);
  }, [messages]);

  return (
    <>
      {media.photos.length > 0 && <Photos photos={media.photos} />}
      {media.files.length > 0 && <Files files={media.files} />}
      {media.links.length > 0 && <Links links={media.links} />}
    </>
  );
};

export default Media;
