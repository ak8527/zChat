import { createSlice } from '@reduxjs/toolkit';

import WebrtcState from '../../utils/webrtcState';

const initialState = {
  sdp: null,
  roomId: null,
  status: null, // 'calling, notification, connecting, disconnecting'
  receiver: null,
  callType: null,
  candidates: null,
  error: null,
};

const webrtcSlice = createSlice({
  name: 'webrtc',
  initialState,
  reducers: {
    callingReq: (state, { payload }) => {
      const data = payload;
      state.roomId = data.roomId;
      state.callType = data.callType;
      state.receiver = {
        _id: data.receiver?._id,
        name: data.receiver?.name,
        imageUrl: data.receiver?.imageUrl,
      };
      state.status = WebrtcState.CALLING;
    },
    callingRes: (state, { payload }) => {
      const data = payload;
      state.roomId = data.roomId;
      state.callType = data.callType;
      state.receiver = {
        _id: data.receiver?._id,
        name: data.receiver?.name,
        imageUrl: data.receiver?.imageUrl,
      };
      state.status = WebrtcState.NOTIFICATION;
    },
    acceptCall: (state) => {
      console.log('Accept Call:');
      state.status = WebrtcState.CONNECTING;
      console.log('WebrtcSTatus:', WebrtcState.CONNECTING);
    },
    declineCall: (state) => {
      console.log('Decline Call:', Date.now());
      state.roomId = null;
      state.callType = null;
      state.receiver = null;
      state.sdp = null;
      state.candidates = null;
      state.status = null;
      state.error = null;
    },
    sendSdp: () => {
      return;
    },
    receivedSdp: (state, { payload }) => {
      state.sdp = payload.sdp;
      state.status = WebrtcState.CONNECTING;
    },
    sendCandidate: () => {
      return;
    },
    receivedCandidate: (state, { payload }) => {
      // state.candidate = payload.candidate;
      state.candidates = state.candidates
        ? [...state.candidates, payload.candidate]
        : [payload.candidate];
    },
    closeConnection: (state, { payload }) => {
      console.log('Close Connection:', Date.now());
      if (state.status && payload?.status === WebrtcState.DISCONNECTING) {
        state.status = WebrtcState.DISCONNECTING;
      } else {
        state.roomId = null;
        state.callType = null;
        state.receiver = null;
        state.sdp = null;
        state.candidates = null;
        state.status = null;
        state.error = null;
      }
    },
    webrtcError: (state, { payload }) => {
      console.log('Error:', payload);
      state.error = payload.error;
    },
  },
});

export const webrtcActions = webrtcSlice.actions;
export const webrtcReducer = webrtcSlice.reducer;

export const getWebrtcState = (state) => state.webrtc;
