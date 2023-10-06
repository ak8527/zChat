import { configureStore } from '@reduxjs/toolkit';

import { authReducer } from './auth/authSlice';
import { userReducer } from './user/userSlice';
import { chatReducer } from './chat/chatSlice';
import { modalReducer } from './modal/modalSlice';
import { webrtcReducer } from './webrtc/webrtcSlice';
import chatMiddleware from './chat/chatMiddleware';

const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    chat: chatReducer,
    modal: modalReducer,
    webrtc: webrtcReducer,
  },
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware().concat([chatMiddleware]);
  },
});

export default store;
