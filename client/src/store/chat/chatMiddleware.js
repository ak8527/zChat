import { createAsyncThunk } from '@reduxjs/toolkit';

import { chatActions } from './chatSlice';
import { webrtcActions } from '../webrtc/webrtcSlice';
import MESSAGE_TYPE from '../../utils/messageType';
import axiosPrivate from 'axios';
import axios from '../../client/axios';
import Events from '../../utils/events';

const chatMiddleware = (store) => {
  let socket;
  return (next) => (action) => {
    const isConnectionEstablished = socket && store.getState().chat.isConnected;
    const token = store.getState().auth.accessToken;
    if (token && chatActions.startConnecting.match(action)) {
      socket = new WebSocket(
        `${process.env.REACT_APP_WEBSOCKET_URL}token=${token}`
      );

      socket.onopen = () => {
        console.log('Socket Connected!!!');
        store.dispatch(chatActions.connectionEstablished());
      };

      socket.onclose = () => {
        console.log('Socket Closed');
        store.dispatch(chatActions.startConnecting());
      };

      socket.onerror = (error) => {
        console.log('Error:', error);
        // store.dispatch(
        //   chatActions.setResponse({
        //     data: { error: 'Socket Error... Try refreshing...' },
        //   })
        // );
      };

      socket.onmessage = (e) => {
        const { event, data } = JSON.parse(e.data);
        switch (event) {
          case Events.RECEIVED_MESSAGE:
            showNotification(data.message);
            store.dispatch(chatActions.receivedMessage(data));
            break;

          case Events.MESSAGES_RES:
            store.dispatch(chatActions.messagesRes(data));
            break;

          case Events.ADD_NEW_ROOM_RES:
            store.dispatch(chatActions.addNewRoomRes(data));
            break;

          case Events.JOIN_ROOM_RES:
            store.dispatch(chatActions.joinRoomRes(data));
            break;

          case Events.PRIVATE_ROOM_STATUS_RES:
            store.dispatch(chatActions.privateRoomStatusRes(data));
            break;

          case Events.UPDATE_ROOM_RES:
            store.dispatch(chatActions.updateRoomRes(data));
            break;

          case Events.ERROR:
            store.dispatch(chatActions.setResponse(data));
            break;

          case Events.WEBRTC_SDP:
            store.dispatch(webrtcActions.receivedSdp(data));
            break;

          case Events.WEBRTC_CANDIDATE:
            store.dispatch(webrtcActions.receivedCandidate(data));
            break;

          case Events.WEBRTC_CALLING:
            store.dispatch(webrtcActions.callingRes(data));
            break;

          case Events.WEBRTC_CLOSE_CONNECTION:
            store.dispatch(webrtcActions.closeConnection(data));
            break;

          case Events.WEBRTC_ERROR:
            store.dispatch(webrtcActions.webrtcError(data));
            break;

          default:
            break;
        }
      };
    }

    if (isConnectionEstablished) {
      let event = null;
      switch (true) {
        case chatActions.joinRoomReq.match(action):
          event = Events.JOIN_ROOM_REQ;
          break;

        case chatActions.addNewRoomReq.match(action):
          event = Events.ADD_NEW_ROOM_REQ;
          break;

        case chatActions.submitMessage.match(action):
          event = Events.SUBMIT_MESSAGE;
          break;

        case chatActions.messagesReq.match(action):
          event = Events.MESSAGES_REQ;
          break;

        case chatActions.privateRoomStatusReq.match(action):
          event = Events.PRIVATE_ROOM_STATUS_REQ;
          break;

        case chatActions.updateRoomReq.match(action):
          event = Events.UPDATE_ROOM_REQ;
          break;

        case chatActions.socketDisconnect.match(action):
          socket.close();
          break;

        case webrtcActions.callingReq.match(action):
          event = Events.WEBRTC_CALLING;
          break;

        case webrtcActions.sendSdp.match(action):
          event = Events.WEBRTC_SDP;
          break;

        case webrtcActions.sendCandidate.match(action):
          event = Events.WEBRTC_CANDIDATE;
          break;

        case webrtcActions.declineCall.match(action):
          event = Events.WEBRTC_DECLINE_CALL;
          break;

        default:
          break;
      }

      if (event)
        socket.send(JSON.stringify({ event: event, data: action.payload }));
    }

    next(action);
  };
};

function showNotification(message) {
  if (
    // document.visibilityState === 'hidden' &&
    document.hidden &&
    Notification.permission === 'granted' &&
    localStorage.getItem('notification')
  ) {
    new Notification(message.author.username, {
      body:
        message.type === MESSAGE_TYPE.TEXT || message.type === MESSAGE_TYPE.URL
          ? message.text
          : message.type === MESSAGE_TYPE.IMAGE
          ? 'Photos'
          : 'File',

      tag: message.author.authorId,
      icon: message.author.imageUrl,
    });
  }
}

export const postRooms = createAsyncThunk(
  'chat/rooms',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('chat/rooms');
      return response.data;
    } catch (err) {
      return rejectWithValue(err?.response?.data);
    }
  }
);

export const postCreateGroupRoom = createAsyncThunk(
  'chat/createGroupRoom',
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post('chat/createGroupRoom', data);
      return response.data;
    } catch (err) {
      return rejectWithValue(err?.response?.data);
    }
  }
);

export const postCreatePrivateRoom = createAsyncThunk(
  'chat/createPrivateRoom',
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post('chat/createPrivateRoom', data);
      return response.data;
    } catch (err) {
      return rejectWithValue(err?.response?.data);
    }
  }
);

export const postUrlMetaData = createAsyncThunk(
  'chat/urlMetaData',
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post('chat/urlMetaData', data);
      return response.data;
    } catch (err) {
      console.log('Error:', err);
      return rejectWithValue(err?.response?.data);
    }
  }
);

export const postUpdateRoomInfo = createAsyncThunk(
  'chat/updateRoomInfo',
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.patch('chat/updateRoomInfo', data);
      return response.data;
    } catch (err) {
      console.log('UpdateUserInfo:', err);
      return rejectWithValue(err?.response?.data);
    }
  }
);

export const postAddParticipants = createAsyncThunk(
  'chat/addParticipants',
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.patch('chat/addParticipants', data);
      return response.data;
    } catch (err) {
      console.log('Error:', err);
      return rejectWithValue(err?.response?.data);
    }
  }
);

export const postRemoveParticipants = createAsyncThunk(
  'chat/removeParticipants',
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.patch('chat/removeParticipants', data);
      return response.data;
    } catch (err) {
      console.log('Error:', err);
      return rejectWithValue(err?.response?.data);
    }
  }
);

export const getUsers = createAsyncThunk(
  'chat/users',
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.get(`chat/users/${data.roomId}`);
      return response.data;
    } catch (err) {
      return rejectWithValue(err?.response?.data);
    }
  }
);

export const postLeaveRoom = createAsyncThunk(
  'chat/leaveGroup',
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.patch('chat/leaveRoom', data);
      return response.data;
    } catch (err) {
      return rejectWithValue(err?.response?.data);
    }
  }
);

export const postBlockRoom = createAsyncThunk(
  'chat/blockRoom',
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post('chat/blockRoom', data);
      return response.data;
    } catch (err) {
      return rejectWithValue(err?.response?.data);
    }
  }
);

export const postUnblockRooms = createAsyncThunk(
  'chat/unblockRooms',
  async (data, { rejectWithValue }) => {
    console.log('unblockroom:', data);
    try {
      const response = await axios.post('chat/unblockRooms', data);

      console.log('PostUnblockResult:', response.data);
      return response.data;
    } catch (err) {
      return rejectWithValue(err?.response?.data);
    }
  }
);

export const getBlockedRooms = createAsyncThunk(
  'chat/blockedRooms',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('chat/blockedRooms');
      return response.data;
    } catch (err) {
      return rejectWithValue(err?.response?.data);
    }
  }
);

export const postSignedUploadUrl = createAsyncThunk(
  'chat/signedUploadUrl',
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post('chat/signedUploadUrl', data);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const postUploadFile = createAsyncThunk(
  'chat/uploadFile',
  async ({ url, file, onUploadProgress }, { rejectWithValue }) => {
    try {
      const response = await axiosPrivate.put(url, file, {
        headers: {
          'Content-Type': `${file.type}`,
        },
        onUploadProgress: onUploadProgress,
      });
      return { status: response.status, statusText: response.statusText };
    } catch (err) {
      return rejectWithValue(err.code);
    }
  }
);

export default chatMiddleware;
