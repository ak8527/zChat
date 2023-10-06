import { useEffect, useState, useRef } from 'react';
import { useDispatch } from 'react-redux';

import { postUrlMetaData } from '../store/chat/chatMiddleware';

const useUrlMetaData = (url) => {
  const dispatch = useDispatch();
  const [metaData, setMetaData] = useState({});
  const isUrlMetaDataCalled = useRef(false);

  useEffect(() => {
    if (!isUrlMetaDataCalled.current && url) {
      isUrlMetaDataCalled.current = true;
      const data = { url: url };
      dispatch(postUrlMetaData(data))
        .unwrap()
        .then((res) => {
          const result = res.data.meta;
          if (result.title || result.description || result.imageUrl)
            setMetaData(res.data.meta);
        })
        .catch((err) => {
          console.log('Error:', err.message);
        });
    }
  }, [dispatch, url]);

  return metaData;
};

export default useUrlMetaData;
