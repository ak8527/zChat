const iceConfiguration = {
  iceServers: [
    {
      // urls: 'stun:stun.l.google.com:19302'
      urls: process.env.REACT_APP_STUN_URL,
    },
    {
      urls: process.env.REACT_APP_TURN_URL,
      username: process.env.REACT_APP_TURN_USERNAME,
      credential: process.env.REACT_APP_TURN_CREDENTIAL,
    },
  ],
};

export default iceConfiguration;
