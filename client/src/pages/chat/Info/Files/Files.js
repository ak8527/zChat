import { useLocation, useNavigate } from 'react-router-dom';

import File from './File';
import Title from '../Title/Title';
import styles from './Files.module.css';

const Files = ({ files }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const fileList = files.toReversed().slice(0, 4);

  return (
    <div className={`${styles.files}`}>
      <Title
        title={'Files'}
        size={files.length}
        showAll={files.length > 2}
        onClick={() => navigate(`${location.pathname}/files`)}
      />
      <ul>
        {fileList.map((file) => (
          <File key={file._id} file={file} />
        ))}
      </ul>
    </div>
  );
};

export default Files;
