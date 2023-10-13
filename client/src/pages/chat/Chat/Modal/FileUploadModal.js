import { useState, useRef, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import Modal from 'react-modal';

import { chatActions } from '../../../../store/chat/chatSlice';
import { getUserInfo } from '../../../../store/user/userSlice';
import MESSAGE_TYPE from '../../../../utils/messageType';
import CircularProgressBar from './CircularProgressBar';
import CloudSvg from '../../../../components/Svg/CloudSvg';
import CloseSvg from '../../../../components/Svg/CloseSvg';
import useFileUpload from '../../../../hooks/useFileUpload';
import styles from './FileUploadModal.module.css';

const FileUploadModal = ({ isOpen, closeModal }) => {
  const {
    file,
    error,
    setFile,
    setError,
    progress,
    isUploading,
    setIsUploading,
    uploadedFileUrl,
    setUploadedFileUrl,
  } = useFileUpload(true);
  const { id } = useParams();
  const dispatch = useDispatch();
  const fileInputRef = useRef();
  const loggedUser = useSelector(getUserInfo);
  const [dragActive, setDragActive] = useState(false);

  const checkFile = (currentFile) => {
    let error = null;
    if (!currentFile) error = 'File not found';
    if (currentFile && currentFile.size > 20 * 1024 * 1024)
      error = 'File size exceed limit';
    return error;
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
    else if (e.type === 'dragleave') setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const { files } = e.dataTransfer;
    const fileError = checkFile(files[0]);
    if (fileError) {
      setError(fileError);
    } else {
      setFile(files[0]);
      setIsUploading(true);
    }
  };

  const handleChange = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const { files } = e.target;
    const fileError = checkFile(files[0]);
    if (fileError) {
      setError(fileError);
    } else {
      setFile(files[0]);
      setIsUploading(true);
    }
  };

  const resetModal = useCallback(() => {
    setFile(null);
    setError(null);
    setDragActive(false);
    setIsUploading(false);
    setUploadedFileUrl(null);
    closeModal();
  }, [closeModal, setFile, setError, setIsUploading, setUploadedFileUrl]);

  useEffect(() => {
    if (!uploadedFileUrl) return;
    const fileInfo = {
      name: file.name,
      size: file.size,
      mimetype: file.type,
    };
    const data = {
      roomId: id,
      message: getMessage(loggedUser, uploadedFileUrl, fileInfo),
    };
    dispatch(chatActions.submitMessage(data));
    resetModal();
  }, [id, file, dispatch, loggedUser, resetModal, uploadedFileUrl]);

  return (
    <Modal
      isOpen={isOpen}
      className={styles.modal}
      overlayClassName={styles.overlay}
      shouldCloseOnEsc={false}
    >
      <nav className={styles.nav}>
        <span>Upload Files</span>
        <span onClick={() => resetModal()}>
          <CloseSvg />
        </span>
      </nav>
      <input ref={fileInputRef} type={'file'} onChange={handleChange} hidden />
      {!isUploading && (
        <div
          className={`${styles.dragAndDrop} ${
            dragActive ? styles.dragActive : ''
          }`}
          onDrop={handleDrop}
          onDragOver={handleDrag}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
        >
          <div className={styles.cloudSvg}>
            <CloudSvg />
          </div>
          <div className={styles.fileSelect}>
            Select a File to
            <span onClick={() => fileInputRef.current.click()}> upload</span>
          </div>
          <div className={styles.fileDrop}>
            or Drag & Drop it here(max. size: 20mb)
          </div>
        </div>
      )}
      {isUploading && (
        <CircularProgressBar
          className={styles.circularProgressBar}
          strokeWidth={'8'}
          progress={progress}
          labelSize={'1.5rem'}
        />
      )}
      {error && <p className={styles.error}>{error}</p>}
    </Modal>
  );
};

function getMessage(user, text, fileInfo) {
  if (!user || !fileInfo || !text) return;
  return {
    author: {
      authorId: user.userId,
      username: user.username,
      imageUrl: user.imageUrl,
    },
    type: fileInfo.mimetype.includes(MESSAGE_TYPE.IMAGE)
      ? MESSAGE_TYPE.IMAGE
      : fileInfo.mimetype.includes(MESSAGE_TYPE.VIDEO)
      ? MESSAGE_TYPE.VIDEO
      : fileInfo.mimetype.includes(MESSAGE_TYPE.AUDIO)
      ? MESSAGE_TYPE.AUDIO
      : MESSAGE_TYPE.FILE,
    text: text,
    // date: Date.now().toString(),
    fileMetaData: fileInfo,
  };
}

export default FileUploadModal;
