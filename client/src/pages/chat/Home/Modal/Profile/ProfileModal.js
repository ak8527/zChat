import { useCallback, useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Modal from 'react-modal';

import { getUserInfo } from '../../../../../store/user/userSlice';
import { postUpdateUserInfo } from '../../../../../store/user/userMiddleware';
import useFileUpload from '../../../../../hooks/useFileUpload';
import CloseSvg from '../../../../../components/Svg/CloseSvg';
import EditableImage from '../../../../../components/EditableImage/EditableImage';
import Loader from '../../../../../components/Loader/Loader';
import styles from './ProfileModal.module.css';
import CheckSvg from '../../../../../components/Svg/CheckSvg';

const ProfileModal = ({ isOpen, closeModal }) => {
  const {
    error,
    setError,
    isUploading,
    setIsUploading,
    uploadedFileUrl,
    setUploadedFileUrl,
    file: newImage,
    setFile: setNewImage,
  } = useFileUpload();
  const dispatch = useDispatch();
  const nameInputRef = useRef(null);
  const loggedUser = useSelector(getUserInfo);
  const [isEditable, setIsEditable] = useState(false);
  let newImageUrl = null;
  if (newImage) newImageUrl = URL.createObjectURL(newImage);

  const resetModal = useCallback(() => {
    setNewImage(null);
    setIsEditable(false);
    setIsUploading(false);
    setUploadedFileUrl(null);
    setError(null);
    closeModal();
  }, [
    setError,
    closeModal,
    setNewImage,
    setIsEditable,
    setIsUploading,
    setUploadedFileUrl,
  ]);

  const updateUser = useCallback(async () => {
    try {
      const data = {};
      const updatedUsername = nameInputRef.current.value;
      if (updatedUsername.length > 0 && loggedUser.username !== updatedUsername)
        data['username'] = updatedUsername;
      if (uploadedFileUrl && loggedUser.imageUrl !== uploadedFileUrl)
        data['imageUrl'] = uploadedFileUrl;
      if (Object.keys(data).length === 0) {
        setError('Please provide valid detail');
        return;
      }
      await dispatch(postUpdateUserInfo(data)).unwrap();
      resetModal();
    } catch (err) {
      setError(err?.data?.message ?? 'Something went wrong');
      setIsUploading(false);
    }
  }, [
    setError,
    dispatch,
    resetModal,
    setIsUploading,
    uploadedFileUrl,
    loggedUser.username,
    loggedUser.imageUrl,
  ]);

  useEffect(() => {
    if (uploadedFileUrl) updateUser();
  }, [uploadedFileUrl, updateUser]);

  return (
    <>
      <Modal
        isOpen={isOpen}
        className={styles.modal}
        overlayClassName={styles.overlay}
        shouldCloseOnEsc={false}
      >
        <nav className={styles.nav}>
          <div>
            <span
              className={styles.closeSvg}
              onClick={() => {
                if (isEditable) setIsEditable(false);
                else resetModal();
              }}
            >
              <CloseSvg />
            </span>
            <span
              style={
                isEditable
                  ? { visibility: 'hidden' }
                  : { visibility: 'visible' }
              }
            >
              Profile
            </span>
          </div>
          {isEditable ? (
            <span
              className={styles.update}
              onClick={() => {
                if (newImage) setIsUploading(true);
                else updateUser();
              }}
            >
              <CheckSvg />
            </span>
          ) : (
            <span
              className={styles.edit}
              onClick={() => {
                setIsEditable(true);
              }}
            >
              Edit
            </span>
          )}
        </nav>
        <div className={styles.info}>
          <EditableImage
            edit={isEditable}
            src={newImageUrl ?? loggedUser.imageUrl}
            className={styles.image}
            isGroup={false}
            onImageSelected={(image) => setNewImage(image)}
          />
          <input
            ref={nameInputRef}
            defaultValue={loggedUser.username}
            disabled={!isEditable}
          />
          <div className={styles.email}>{loggedUser.email}</div>
          {error && <p>{error}</p>}
        </div>
      </Modal>
      <Loader isOpen={isUploading} />
    </>
  );
};

export default ProfileModal;
