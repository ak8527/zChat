import { useCallback, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import { getRooms } from '../../../../store/chat/chatSlice';
import { chatActions } from '../../../../store/chat/chatSlice';
import { postUpdateRoomInfo } from '../../../../store/chat/chatMiddleware';
import useFileUpload from '../../../../hooks/useFileUpload';
import Loader from '../../../../components/Loader/Loader';
import EditableImage from '../../../../components/EditableImage/EditableImage';
import styles from './Profile.module.css';

const Profile = ({ isEditing, isLoading, onEdit, onLoad }) => {
  const { id } = useParams();
  const {
    file: newImage,
    setFile: setNewImage,
    isUploading: isImageUploading,
    setIsUploading: setIsImageUploading,
    uploadedFileUrl: uploadedImageUrl,
    setUploadedFileUrl: setImageUploadedUrl,
  } = useFileUpload();
  const nameInputRef = useRef();
  const dispatch = useDispatch();
  const rooms = useSelector(getRooms);
  const room = rooms.find((room) => room._id === id);

  let newImageUrl = null;
  if (newImage) newImageUrl = URL.createObjectURL(newImage);

  const updateProfile = useCallback(async () => {
    try {
      const data = { roomId: room?._id };
      if (uploadedImageUrl && room?.imageUrl !== uploadedImageUrl)
        data['imageUrl'] = uploadedImageUrl;
      if (room?.name !== nameInputRef.current.value)
        data['name'] = nameInputRef.current.value;

      if (Object.keys(data).length < 2) return;

      const result = await dispatch(postUpdateRoomInfo(data)).unwrap();

      if (result?.data?.room?._id)
        dispatch(chatActions.updateRoomReq({ roomId: room?._id }));

      onLoad();
      onEdit();
      setImageUploadedUrl(null);
      setIsImageUploading(false);
      setNewImage(null);
    } catch (err) {
      dispatch(chatActions.setResponse({ data: { error: err.message } }));
      console.log('Error:', err);
    }
  }, [
    onEdit,
    onLoad,
    dispatch,
    room?._id,
    room?.name,
    room?.imageUrl,
    setNewImage,
    uploadedImageUrl,
    setImageUploadedUrl,
    setIsImageUploading,
  ]);

  useEffect(() => {
    if (!isLoading) return;

    if (newImage) setIsImageUploading(true);
    else updateProfile();
  }, [isLoading, setIsImageUploading, newImage, updateProfile]);

  useEffect(() => {
    if (uploadedImageUrl) updateProfile();
  }, [updateProfile, uploadedImageUrl]);

  return (
    <div className={styles.profile}>
      <EditableImage
        src={newImageUrl ?? room?.imageUrl}
        isGroup={room?.isGroup}
        edit={isEditing}
        className={styles.profileImage}
        onImageSelected={(image) => setNewImage(image)}
      />
      <input
        key={room?.name}
        className={styles.roomname}
        disabled={!isEditing}
        ref={nameInputRef}
        defaultValue={room?.name ?? ''}
      />
      {room?.email && <div className={styles.email}>{room?.email}</div>}
      <Loader isOpen={isImageUploading} />
    </div>
  );
};

export default Profile;
