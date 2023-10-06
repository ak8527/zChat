import { useEffect, useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';

import {
  postUploadFile,
  postSignedUploadUrl,
} from '../store/chat/chatMiddleware';

const useFileUpload = (showProgress) => {
  const dispatch = useDispatch();
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFileUrl, setUploadedFileUrl] = useState(null);

  function getUploadFileUrl(filename) {
    return `${process.env.REACT_APP_FIREBASE_DOWNLOAD_BASE_URL}${filename}?alt=media`;
  }

  const onUploadProgress = useCallback((progressEvent) => {
    const { loaded, total } = progressEvent;
    let percent = Math.floor((loaded * 100) / total);
    if (percent <= 100) setProgress(percent);
  }, []);

  const uploadFile = useCallback(async () => {
    const data = {
      filename: `${Date.now()}-${file.name.replace(/\s+/g, '_')}`,
    };
    try {
      const response = await dispatch(postSignedUploadUrl(data)).unwrap();

      let result = {};
      if (response.data?.url)
        result = await dispatch(
          postUploadFile({
            url: response.data.url,
            file,
            ...(showProgress && { onUploadProgress }),
          })
        ).unwrap();

      if (result.status === 200)
        setUploadedFileUrl(getUploadFileUrl(data.filename));
    } catch (err) {
      console.log('Error:', err);
      setError(err ?? 'Something went wrong');
      setFile(null);
      setIsUploading(false);
    }
  }, [dispatch, file, onUploadProgress, showProgress]);

  useEffect(() => {
    if (isUploading && file) uploadFile();
  }, [isUploading, file, uploadFile]);

  return {
    file,
    error,
    setError,
    setFile,
    progress,
    isUploading,
    setIsUploading,
    uploadedFileUrl,
    setUploadedFileUrl,
  };
};
export default useFileUpload;
