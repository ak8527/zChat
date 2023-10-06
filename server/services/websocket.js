import WebSocket, { WebSocketServer } from 'ws';
import jwt from 'jsonwebtoken';
import log from 'npmlog';

import Room from '../models/Room.models.js';
import User from '../models/User.models.js';
import Events from '../utils/events.js';

const rooms = new Map(); // Map<Room, Set<SocketId>>
const clientMap = new Map(); // Map<UserId, WebSocket>
const initWs = (server) => {
  // initialize new websocket server
  const wss = new WebSocketServer({ noServer: true });

  wss.on('connection', (ws, req) => {
    ws.info = {
      userId: req.userId,
      email: req.email,
    };

    log.warn('WebSocket:', ws.info.email, 'connected');

    // map websocket with userId
    clientMap.set(req.userId, ws);

    const sendData = (clientId, event, data) => {
      const websocket = clientMap.get(clientId);
      if (websocket && websocket.readyState === WebSocket.OPEN)
        websocket.send(JSON.stringify({ event, data }));
    };

    ws.on('close', async () => {
      try {
        log.info('Socket Disconnected:', ws.info.email);
        await User.updateOne(
          { _id: ws.info.userId },
          { $set: { lastSeen: Date.now() } }
        );
        clientMap.delete(req.userId);
        ws.terminate();
      } catch (err) {
        log.error('Socket Disconnected:', err.message);
      }
    });

    ws.on('message', async (message) => {
      try {
        const { event, data } = JSON.parse(message) || {};
        log.warn('Websocket:', event);

        switch (event) {
          case Events.ADD_NEW_ROOM_REQ:
            {
              const userId = ws.info.userId;
              const roomId = data.roomId;
              const room = await Room.findById(roomId)
                .select({
                  name: 1,
                  imageUrl: 1,
                  admin: 1,
                  isGroup: 1,
                  users: 1,
                  messages: { $slice: ['$messages', -1] },
                })
                .lean();

              // Check if room exist for given roomId
              if (!room) return;

              // if room is private then set room name & imageUrl
              if (!room.isGroup && room.users.length === 2) {
                const otherUserId =
                  userId === room.users[0]._id.toString()
                    ? room.users[1]._id
                    : room.users[0]._id;
                const otherUser = await User.findById(otherUserId)
                  .select({ username: 1, imageUrl: 1 })
                  .lean();
                room.name = otherUser.username;
                room.imageUrl = otherUser.imageUrl;
              }

              // Send rooms detail to every connected client of room
              room.users.forEach((user) => {
                const id = user._id.toString();
                if (id !== userId)
                  sendData(id, Events.ADD_NEW_ROOM_RES, {
                    room: room,
                  });
              });
            }
            break;

          case Events.UPDATE_ROOM_REQ:
            {
              const userId = ws.info.userId;
              const roomId = data.roomId;
              log.warn('Update Room Req:', data);
              const room = await Room.findById(roomId)
                .select({
                  name: 1,
                  imageUrl: 1,
                  admin: 1,
                  isGroup: 1,
                  users: 1,
                  messages: 1,
                  // messages: { $slice: ['$messages', -1] },
                })
                .lean();

              const usersSet = rooms.get(roomId);
              const previousUserSet = new Set(usersSet);

              const newUserSet = new Set();
              room.users.forEach((id) => newUserSet.add(id.toString()));
              rooms.delete(roomId);
              rooms.set(roomId, newUserSet);

              const currentSet =
                previousUserSet?.size > newUserSet.size
                  ? previousUserSet
                  : newUserSet; // Check if user is deleted or add by measuring size of room set

              // log.warn('Update Room Req: UserSet:', currentSet);
              // log.warn('Update Room Req: PreivousSet:', previousUserSet);
              // log.warn('Update Room Req: Users:', room.users);
              // log.warn('Update Room Req: New UserSet:', newUserSet);

              currentSet.forEach((id) => {
                if (userId !== id)
                  sendData(id, Events.UPDATE_ROOM_RES, {
                    room: room,
                  });
              });
            }
            break;

          case Events.JOIN_ROOM_REQ:
            {
              const userId = ws.info.userId;
              // Check if room already exist in rooms map
              let userSet = rooms.get(data.roomId);
              let room = null;
              log.info('JOIN ROOM:', userSet);
              if (userSet) {
                userSet.has(userId) && (room = data.roomId);
                // room = data.roomId;
              } else {
                // Check if room exist in db
                const dbRoom = await Room.findById(data.roomId).lean();
                if (!dbRoom) return;

                const isUserAvailableInDbRoom = dbRoom.users
                  .toString()
                  .includes(userId);
                if (!isUserAvailableInDbRoom) return;
                // Create new user set for room with userId
                userSet = new Set();
                dbRoom.users.forEach((id) => userSet.add(id.toString()));
                rooms.set(data.roomId, userSet);
                room = data.roomId;
              }
              sendData(userId, Events.JOIN_ROOM_RES, {
                roomId: room,
              });
            }
            break;

          case Events.SUBMIT_MESSAGE:
            {
              // Message author id
              const message = data.message;
              const author = message.author.authorId;
              // Set of UserId for Given room
              const usersSet = rooms.get(data.roomId);
              log.warn('SubmitMessage:', message);
              log.warn('SubmitMessage:', usersSet);
              if (!usersSet || !usersSet.has(author)) return;
              // Save message to db
              await Room.updateOne(
                { _id: data.roomId },
                { $push: { messages: message } }
              );
              // Send message to available users connected to room
              usersSet.forEach((id) => {
                // Check if current userId is same as message author userId
                if (id !== author) {
                  sendData(id, Events.RECEIVED_MESSAGE, {
                    roomId: data.roomId,
                    message: data.message,
                  });
                }
              });
            }
            break;

          case Events.MESSAGES_REQ:
            {
              // Get messages form roomId
              const roomId = data.roomId;
              const userId = ws.info.userId;
              log.warn('All Message Req:', roomId);

              const result = await Room.findById(roomId)
                .select({ messages: 1 })
                .lean();

              sendData(userId, Events.MESSAGES_RES, {
                roomId: data.roomId,
                messages: result?.messages ?? [],
              });
            }
            break;

          case Events.PRIVATE_ROOM_STATUS_REQ:
            {
              // Get user status, if it is online or last seen
              log.warn(Events.PRIVATE_ROOM_STATUS_REQ, data);
              const roomId = data.roomId;
              const otherUserId = data.otherUserId;
              const currentUserId = ws.info.userId;

              const otherUser = await User.findById(otherUserId)
                .select({ lastSeen: 1 })
                .lean();

              const room = { roomId: roomId, lastSeen: otherUser.lastSeen };
              room.status = clientMap.get(otherUserId) ? 'online' : 'offline';

              sendData(currentUserId, Events.PRIVATE_ROOM_STATUS_RES, {
                room: room,
              });
            }
            break;

          case Events.WEBRTC_CALLING:
            const currentUserId = ws.info.userId;
            const receiverId = data.receiver._id;
            log.info('Calling Data:', data);

            // start calling other user
            const receiver = clientMap.get(receiverId);
            if (!receiver) {
              const newData = {
                error: 'User Offline...',
              };
              sendData(currentUserId, Events.WEBRTC_ERROR, newData);
            } else if (receiver && receiver.info.webrtcRoomId) {
              const newData = {
                error: 'User Busy...',
              };
              sendData(currentUserId, Events.WEBRTC_ERROR, newData);
            } else {
              const currentUser = await User.findById(currentUserId)
                .select({ username: 1, imageUrl: 1 })
                .lean();

              // send info like roomId or calltype like audio call or video call etc
              const newData = {
                roomId: data.roomId,
                callType: data.callType,
                receiver: {
                  _id: currentUser._id.toString(),
                  name: currentUser.username,
                  imageUrl: currentUser.imageUrl,
                },
              };
              log.info('Calling:', newData);
              sendData(receiverId, Events.WEBRTC_CALLING, newData);
            }
            break;

          case Events.WEBRTC_SDP:
            {
              // send sdp for establishing connection
              const receiverId = data.receiverId;
              const currentUserId = ws.info.userId;

              if (!clientMap.get(receiverId)) {
                const newData = {
                  error: 'User Offline...',
                };
                delete ws.info.webrtcRoomId;
                sendData(currentUserId, Events.WEBRTC_ERROR, newData);
              } else {
                const newData = {
                  roomId: data.roomId,
                  sdp: data.sdp,
                };

                ws.info.webrtcRoomId = data.roomId;
                sendData(receiverId, Events.WEBRTC_SDP, newData);
              }
            }
            break;

          case Events.WEBRTC_CANDIDATE:
            {
              // Send ice candidate to other user
              const currentUserId = ws.info.userId;
              const receiverId = data.receiverId;

              if (!clientMap.get(receiverId)) {
                const newData = {
                  error: 'User Offline...',
                };
                delete ws.info.webrtcRoomId;
                sendData(currentUserId, Events.WEBRTC_ERROR, newData);
              } else {
                const newData = {
                  roomId: data.roomId,
                  candidate: data.candidate,
                };

                sendData(receiverId, Events.WEBRTC_CANDIDATE, newData);
              }
            }
            break;

          case Events.WEBRTC_DECLINE_CALL:
            {
              const receiverId = data.receiverId;
              const receiver = clientMap.get(receiverId);

              // Delete webrtcRoomid property from users of room
              delete receiver?.info?.webrtcRoomId;
              delete ws.info.webrtcRoomId;

              const newData = {
                roomId: data.roomId,
                status: data.status,
              };

              sendData(receiverId, Events.WEBRTC_CLOSE_CONNECTION, newData);
            }
            break;

          default:
            break;
        }
      } catch (err) {
        sendData(ws.info.userId, Events.ERROR, {
          data: { error: err.message },
        });
        log.error('Error:', err.message);
      }
    });
  });

  // Upgrade express server to ws
  server.on('upgrade', (req, socket, head) => {
    const token = req.url.split('=')[1]; // url => ws://localhost:8080/token=fjdkjfkd...
    let decodedToken;
    try {
      decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_PRIVATE_KEY);
    } catch (err) {
      return;
    }

    if (!decodedToken) {
      socket.write('HTTP/1.1 401 Unauthorized \r\n\r\n');
      socket.destroy();
      return;
    }

    req.userId = decodedToken._id;
    req.email = decodedToken.email;

    wss.handleUpgrade(req, socket, head, (ws) => {
      wss.emit('connection', ws, req);
    });
  });
};

export default initWs;
