import { createSlice } from '@reduxjs/toolkit';

import {
  getUsers,
  postRooms,
  postLeaveRoom,
  postBlockRoom,
  postUnblockRooms,
  postUpdateRoomInfo,
  postAddParticipants,
  postCreateGroupRoom,
  postCreatePrivateRoom,
  postRemoveParticipants,
} from './chatMiddleware';
/*
rooms =[{_id:roomId,  status: offline,isGroup: false, users: [userId], messages: []}]
*/
const initialState = {
  rooms: [],
  roomsJoin: [],
  messages: {}, // {RoomId: []}
  usersInfo: {}, // {RoomId: {UserId: Info}}
  blockedRooms: [], // [roomId]
  privateRoomStatus: {}, // current status of private room
  error: null,
  success: null,
  isConnected: false,
  isEstablishingConnection: false,
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    startConnecting: (state) => {
      state.isEstablishingConnection = true;
    },
    connectionEstablished: (state) => {
      state.isEstablishingConnection = true;
      state.isConnected = true;
    },
    resetChatState: (state) => {
      state.rooms = [];
      state.roomsJoin = [];
      state.messages = {};
      state.usersInfo = {};
      state.blockedRooms = [];
      state.privateRoomStatus = {};
      state.error = null;
      state.isConnected = false;
      state.isEstablishingConnection = false;
    },
    joinRoomReq: () => {
      return;
    },
    joinRoomRes: (state, { payload }) => {
      state.roomsJoin.push(payload.roomId);
    },
    submitMessage: (state, { payload }) => {
      const data = payload;
      data.message._id = crypto.randomUUID();
      state.messages[data.roomId].push(data.message);
      state.rooms = state.rooms.reduce((rooms, room) => {
        room._id === data.roomId ? rooms.unshift(room) : rooms.push(room);
        return rooms;
      }, []);
    },
    receivedMessage: (state, { payload }) => {
      const data = payload;
      data.message._id = crypto.randomUUID();
      state.messages[data.roomId].push(data.message);
      state.rooms = state.rooms.reduce((rooms, room) => {
        room._id === data.roomId ? rooms.unshift(room) : rooms.push(room);
        return rooms;
      }, []);
    },
    updateRoomReq: () => {
      return;
    },
    updateRoomRes: (state, { payload }) => {
      const data = payload;
      const updateRoom = { ...data.room };
      const roomId = updateRoom._id;
      const filterRoom = state.rooms.filter(
        (room) => room._id !== updateRoom._id
      );
      state.rooms = [updateRoom, ...filterRoom];
      state.messages[roomId] = [...updateRoom.messages];
      state.usersInfo[roomId] = {};
      // state.roomsJoin = state.roomsJoin.filter((id) => id !== roomId);
    },
    messagesReq: () => {
      return;
    },
    messagesRes: (state, { payload }) => {
      const data = payload;
      state.messages[data.roomId] = [...data.messages];
    },
    privateRoomStatusReq: () => {
      return;
    },
    privateRoomStatusRes: (state, { payload }) => {
      state.privateRoomStatus = payload.room; // data = {lastSeen, roomId, status}
    },
    addNewRoomReq: () => {
      return;
    },
    addNewRoomRes: (state, { payload }) => {
      const data = payload;
      const roomIndex = state.rooms.findIndex(
        (room) => room._id === data.room._id
      );
      if (roomIndex > 0) return;
      state.rooms = [data.room, ...state.rooms];
      state.messages[data.room._id] = [];
    },
    // setChatError: (state, { payload }) => {
    //   state.error = payload?.data?.message;
    // },
    setResponse: (state, { payload }) => {
      // state.error = null;
      state.error = payload?.data?.error;
      state.success = null;
    },
    socketDisconnect: () => {
      return;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(postRooms.fulfilled, (state, { payload }) => {
        const data = payload.data;
        state.rooms = [...data.rooms];
        state.blockedRooms = [...data.blockedRooms];
        data.rooms.forEach((room) => {
          const roomId = room._id;
          state.messages[roomId] =
            room.messages && room.messages[0] ? [room.messages[0]] : [];
        });
        state.error = null;
        state.success = null;
      })
      .addCase(postRooms.rejected, (state, { payload }) => {
        state.error = payload.data?.message;
        state.success = null;
      })
      .addCase(postCreateGroupRoom.fulfilled, (state, { payload }) => {
        const data = payload.data;
        const roomIndex = state.rooms.findIndex(
          (room) => room._id === data.room._id
        );
        if (roomIndex >= 0) return;
        state.rooms = [data.room, ...state.rooms];
        state.messages[data.room._id] = [];
        state.error = null;
        state.success = 'Room created successfully';
      })
      .addCase(postCreateGroupRoom.rejected, (state, { payload }) => {
        state.error = payload?.data?.message;
        state.success = null;
      })
      .addCase(postCreatePrivateRoom.fulfilled, (state, { payload }) => {
        const data = payload.data;
        const roomIndex = state.rooms.findIndex(
          (room) => room._id === data.room._id
        );
        if (roomIndex >= 0 || state.blockedRooms.includes(data.room._id))
          return;
        state.rooms = [data.room, ...state.rooms];
        state.messages[data.room._id] = [];
        state.error = null;
        state.success = null;
      })
      .addCase(postUpdateRoomInfo.fulfilled, (state, { payload }) => {
        console.log('Payload:', payload);
        const data = payload?.data;
        const roomId = data?.room._id;
        const roomIndex = state.rooms.findIndex((room) => room._id === roomId);
        if (roomIndex === -1) return;
        state.rooms[roomIndex]['name'] = data.room.name;
        state.rooms[roomIndex]['imageUrl'] = data.room.imageUrl;
        if (data.room.messages)
          state.messages[roomId] = [
            ...state.messages[roomId],
            ...data.room.messages,
          ];
        state.success = 'RoomInfo updated successfully';
        // state.messages[roomId].push(...payload.data.messages);
      })
      .addCase(postUpdateRoomInfo.rejected, (state, { payload }) => {
        state.error = payload.data.message;
      })
      .addCase(postAddParticipants.fulfilled, (state, { payload }) => {
        console.log('Payload:', payload);
        const data = payload.data;
        const roomIndex = state.rooms.findIndex(
          (room) => room._id === data.room._id
        );
        if (roomIndex === -1) return;
        state.rooms[roomIndex].users = [...data.room.users];
        if (data.room.messages)
          state.messages[data.room._id] = [
            ...state.messages[data.room._id],
            ...data.room.messages,
          ];
        state.error = null;
        state.success = 'Users added to room successfully';
      })
      .addCase(postAddParticipants.rejected, (state, { payload }) => {
        state.error = payload.data?.message;
        state.success = null;
      })
      .addCase(postRemoveParticipants.fulfilled, (state, { payload }) => {
        console.log('Payload:', payload);
        const data = payload.data;
        const roomIndex = state.rooms.findIndex(
          (room) => room._id === data.room._id
        );
        if (roomIndex === -1) return;
        state.rooms[roomIndex].users = [...data.room.users];
        if (data.room.messages)
          state.messages[data.room._id] = [
            ...state.messages[data.room._id],
            ...data.room.messages,
          ];
        state.error = null;
        state.success = 'Users removed from room successfully';
      })
      .addCase(postRemoveParticipants.rejected, (state, { payload }) => {
        state.error = payload.data?.message;
        state.success = null;
      })
      .addCase(getUsers.fulfilled, (state, { payload }) => {
        const room = payload.data.room;
        const users = {};
        room.users.forEach((user) => {
          users[user._id] = user;
        });
        state.usersInfo[room._id] = users;
        state.error = null;
        // state.success = null;
      })
      .addCase(getUsers.rejected, (state, { payload }) => {
        state.error = payload?.data?.message;
        state.success = null;
      })
      .addCase(postBlockRoom.fulfilled, (state, { payload }) => {
        const blockedRoomId = payload.data.roomId;
        state.rooms = state.rooms.filter((room) => room._id !== blockedRoomId);
        state.roomsJoin = state.roomsJoin.filter((id) => id !== blockedRoomId);
        state.blockedRooms = state.blockedRooms.filter(
          (id) => id !== blockedRoomId
        );
        delete state.messages[blockedRoomId];
        state.error = null;
      })
      .addCase(postBlockRoom.rejected, (state, { payload }) => {
        state.error = payload.data?.message;
      })
      .addCase(postUnblockRooms.fulfilled, (state, { payload }) => {
        const unblockedRooms = payload.data.rooms;
        state.blockedRooms = [...payload.data.blockedRooms];
        state.rooms = [...state.rooms, ...unblockedRooms];
        unblockedRooms.forEach((room) => {
          state.messages[room._id] = room.messages ? [...room.messages] : [];
        });
        state.error = null;
      })
      .addCase(postLeaveRoom.fulfilled, (state, { payload }) => {
        const roomId = payload?.data?.roomId;
        state.rooms = state.rooms.filter((room) => room._id !== roomId);
        state.roomsJoin = state.roomsJoin.filter((id) => id !== roomId);
        delete state.messages[roomId];
        delete state.usersInfo[roomId];
        state.error = null;
      })
      .addCase(postLeaveRoom.rejected, (state, { payload }) => {
        state.error = payload.data?.message;
      });
  },
});

export const chatActions = chatSlice.actions;
export const chatReducer = chatSlice.reducer;

export const getRooms = (state) => state.chat.rooms;
export const getChatError = (state) => state.chat.error;
export const getChatSuccess = (state) => state.chat.success;
export const getAllMessages = (state) => state.chat.messages;
export const getAllJoinRooms = (state) => state.chat.roomsJoin;
export const getSocketStatus = (state) => state.chat.isConnected;
export const getRoomUsersInfo = (state) => state.chat.usersInfo;
export const getPrivateRoomStatus = (state) => state.chat.privateRoomStatus;
