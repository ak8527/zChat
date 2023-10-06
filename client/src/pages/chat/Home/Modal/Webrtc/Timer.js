import { useEffect, useState } from 'react';

import formatTimeMMSS from '../../../../../utils/formatTimeMMSS';

const Timer = ({ isConnected }) => {
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    if (!isConnected) return;
    const interVal = setInterval(() => {
      setTimer((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interVal);
  }, [isConnected]);

  return <div>{formatTimeMMSS(timer)}</div>;
};

export default Timer;
