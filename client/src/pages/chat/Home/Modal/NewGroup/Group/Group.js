import { useRef, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';

import { getUserId } from '../../../../../../store/user/userSlice';
import useFileUpload from '../../../../../../hooks/useFileUpload';
import BackArrowSvg from '../../../../../../components/Svg/BackArrowSvg';
import Participant from '../Participant/Participant';
import Button from '../../../../../../components/Button/Button';
import EditableImage from '../../../../../../components/EditableImage/EditableImage';
import styles from './Group.module.css';
import Loader from '../../../../../../components/Loader/Loader';

const Group = ({
  participants,
  onBack,
  onRemoveParticipant,
  onCreateNewRoom,
}) => {
  const {
    file: newImage,
    setFile: setNewImage,
    isUploading: newImageUploading,
    uploadedFileUrl: uploadedNewImageUrl,
    setIsUploading: setNewImageUploading,
  } = useFileUpload();
  const groupNameInputRef = useRef(null);
  const loggedUserId = useSelector(getUserId);
  let newImageUrl = null;
  if (newImage) newImageUrl = URL.createObjectURL(newImage);

  const onSubmit = useCallback(() => {
    const groupName = groupNameInputRef.current.value;
    const participantsId =
      participants.map((participant) => participant._id) || [];
    participantsId.push(loggedUserId);
    const data = { isGroup: true };
    data['users'] = participantsId;
    data['name'] = groupName;
    data['imageUrl'] = uploadedNewImageUrl;
    onCreateNewRoom(data);
  }, [participants, onCreateNewRoom, loggedUserId, uploadedNewImageUrl]);

  useEffect(() => {
    if (!uploadedNewImageUrl) return;
    onSubmit();
  }, [uploadedNewImageUrl, onSubmit]);

  return (
    <>
      <div className={`${styles.container}`}>
        <nav className={styles.nav}>
          <span className={styles.onBack} onClick={onBack}>
            <BackArrowSvg />
          </span>
          <span> {'New Group'}</span>
        </nav>
        <div className={styles.groupInfo}>
          <EditableImage
            className={styles.image}
            edit={true}
            src={newImageUrl}
            option={true}
            onImageSelected={(image) => setNewImage(image)}
          />
          <input
            className={styles.input}
            ref={groupNameInputRef}
            defaultValue={'New Group'}
          />
          {participants?.length > 0 && (
            <div
              className={styles.participantSize}
            >{`Participants: ${participants.length}`}</div>
          )}
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
          <div className={styles.button}>
            <Button
              onClick={() => {
                if (newImage) setNewImageUploading(true);
                else onSubmit();
              }}
            >
              {'Continue'}
            </Button>
          </div>
        </div>
      </div>
      <Loader isOpen={newImageUploading} />
    </>
  );
};

export default Group;
