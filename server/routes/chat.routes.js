import { Router } from 'express';

import {
  getUsers,
  getRooms,
  postCreateGroupRoom,
  postCreatePrivateRoom,
  getUrlMetaData,
  postAddParticipants,
  postUpdateRoomInfo,
  postRemoveParticipants,
  getBlockedRooms,
  postBlockRoom,
  postUnBlockRooms,
  postLeaveRoom,
  postSignedUploadUrl,
} from '../controllers/chat.controller.js';

const router = Router();

router
  .get('/rooms', getRooms) // Get list of room for user
  .get('/users/:roomId', getUsers) // Get a particular room info
  .get('/blockedRooms', getBlockedRooms) // Get blocked room list
  .post('/urlMetaData', getUrlMetaData) // Get url meta info like image, name etc
  .post('/createGroupRoom', postCreateGroupRoom) // Create a new group room
  .post('/createPrivateRoom', postCreatePrivateRoom) // Create a new private room
  .post('/blockRoom', postBlockRoom) // Block a particular room
  .post('/unblockRooms', postUnBlockRooms) // Unblock list of room
  .patch('/updateRoomInfo', postUpdateRoomInfo) // Update room info like room image or room name
  .patch('/addParticipants', postAddParticipants) // Add users in room
  .patch('/removeParticipants', postRemoveParticipants) // Remove participants from room
  .patch('/leaveRoom', postLeaveRoom) // leave the room
  .post('/signedUploadUrl', postSignedUploadUrl);

export default router;
