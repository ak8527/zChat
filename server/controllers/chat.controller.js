import { getStorage } from 'firebase-admin/storage';
import { load } from 'cheerio';
import log from 'npmlog';
import mongoose from 'mongoose';

import Room from '../models/Room.models.js';
import User from '../models/User.models.js';

// create message object
export function createMessage(user, type, text) {
  return {
    author: {
      authorId: user._id,
      username: user.username,
      imageUrl: user.imageUrl,
    },
    type: type,
    text: text,
    date: Date.now().toString(),
  };
}

// Get list of room
export async function getRooms(req, res, next) {
  try {
    const currentUserId = req.userId;

    const result = await User.findById(currentUserId)
      .select({ rooms: 1, blockedRooms: 1 })
      .populate({
        path: 'rooms',
        select: {
          name: 1,
          imageUrl: 1,
          users: 1,
          admin: 1,
          isGroup: 1,
          messages: { $slice: ['$messages', -1] },
        },
      })
      .lean();

    const blockedRooms = result.blockedRooms ?? [];

    const roomPromises = result.rooms
      .filter((room) => !blockedRooms.toString().includes(room._id.toString())) // Remove blocked room from active room list
      .map(async (room) => {
        if (room.isGroup || room.users.length !== 2) return room;

        // Change private group name or image to other user name or image
        const otherUserId =
          room.users[0]._id.toString() != currentUserId
            ? room.users[0]._id
            : room.users[1]._id;
        const otherUser = await User.findById(otherUserId)
          .select({ username: 1, imageUrl: 1, email: 1 })
          .lean();

        room.email = otherUser.email;
        room.name = otherUser.username;
        room.imageUrl = otherUser.imageUrl;
        return room;
      });

    const rooms = await Promise.all(roomPromises);

    // sort arry acc. to date
    const sortedRooms = rooms.sort((a, b) => {
      if (!a?.messages?.length && b?.messages?.length) return 1;
      else if (a?.messages?.length && !b?.messages?.length) return -1;
      else if (!a?.messages?.length && !b?.messages?.length) return 0;
      return Number(b?.messages[0]?.date) - Number(a?.messages[0]?.date);
    });

    return res.status(200).json({
      error: false,
      data: { blockedRooms: result.blockedRooms, rooms: sortedRooms },
    });
  } catch (err) {
    log.error('GetRooms Error:', err);
    next(err);
  }
}

// Create Personal Room
export async function postCreatePrivateRoom(req, res, next) {
  try {
    const authorId = req.userId;
    const receiverId = req.body.receiverId;

    if (!receiverId) throw new Error('receiver_id not found');

    const receiverInfo = await User.findById(receiverId)
      .select({ username: 1, imageUrl: 1, email: 1 })
      .lean();

    let room = await Room.findOne({
      users: {
        $all: [
          new mongoose.Types.ObjectId(authorId),
          new mongoose.Types.ObjectId(receiverId),
        ],
      },
      isGroup: false,
    }).lean();

    if (!room) {
      // Create new Room
      const users = [
        new mongoose.Types.ObjectId(authorId),
        new mongoose.Types.ObjectId(receiverId),
      ];
      room = await Room.create({ users });

      // Add room field to each user
      await User.updateMany(
        { _id: { $in: users } },
        { $push: { rooms: room._id } }
      );
    }

    const newRoom = { _id: room._id, users: room.users };
    // change room name and image to other username or image
    newRoom.name = receiverInfo.username;
    newRoom.imageUrl = receiverInfo.imageUrl;
    return res.status(200).json({ error: false, data: { room: newRoom } });
  } catch (err) {
    log.error('CreatePrivateRoom:', err);
    next(err);
  }
}

// Create new Group Room
export async function postCreateGroupRoom(req, res, next) {
  try {
    const admin = req.userId;
    const name = req.body.name;
    const users = req.body.users;
    const imageUrl = req.body.imageUrl;
    const isGroup = req.body.isGroup;

    if (users.length > 10) throw Error('Maximum 10 users can be in a group');

    const room = await Room.create({ name, imageUrl, isGroup, admin, users });

    // Add room field to each user
    await User.updateMany(
      { _id: { $in: users } },
      { $push: { rooms: room._id } }
    );

    return res.status(201).json({ error: false, data: { room } });
  } catch (err) {
    log.error('Error:', err);
    next(err);
  }
}

// Add Participants
export async function postAddParticipants(req, res, next) {
  try {
    const userId = req.userId;
    const roomId = req.body.roomId;
    const participants = req.body.participants;

    if (!roomId || !participants)
      throw new Error('roomId or participants is not provided');

    const room = await Room.findById(roomId);

    if (!room) throw new Error('room does not exist');
    if (room.admin.toString() !== userId.toString())
      throw new Error('user is not admin');
    if (!room.isGroup) throw new Error('room is not group');
    if (participants.length > 10 - room.users.length)
      throw new Error('Maximum 10 users are allowed');

    // current logged and admin user
    const adminUser = await User.findById(userId)
      .select({ username: 1, imageUrl: 1 })
      .lean();

    const users = await User.find(
      { _id: { $in: participants } },
      { username: 1, rooms: 1 }
    ).lean();

    // check if user is already present in room
    const addedParticipantsId = [];

    const messages = [];
    users.forEach((user) => {
      if (!room.users.toString().includes(user._id.toString())) {
        const text = `${user.username} has been added to group`;
        const message = createMessage(adminUser, 'announcement', text);
        messages.push(message);
        room.users.push(user._id);
        addedParticipantsId.push(user._id.toString());
      }
    });

    //Add room field to each user
    await User.updateMany(
      { _id: { $in: addedParticipantsId } },
      { $push: { rooms: room._id } }
    );

    room.messages.push(...messages);
    const result = await room.save();

    log.error('AddParticipantModal:', participants);

    return res.status(200).json({
      error: false,
      data: {
        room: {
          _id: result._id,
          users: result.users,
          // messages: result.messages,
          messages: result.messages.slice(0 - messages.length),
        },
      },
    });
  } catch (err) {
    next(err);
  }
}

// Remove participants
export async function postRemoveParticipants(req, res, next) {
  try {
    const participants = req.body.participants;
    const roomId = req.body.roomId;
    const userId = req.userId;

    const room = await Room.findById(roomId);

    if (!room || !room.isGroup) throw new Error('room is not valid');
    if (room.admin.toString() !== userId.toString())
      throw new Error('user is not admin');
    if (!(participants?.length > 0))
      throw new Error('participants does not found');

    const adminUser = await User.findById(userId)
      .select({ username: 1, imageUrl: 1 })
      .lean();

    const users = await User.find(
      { _id: { $in: participants } },
      { username: 1, imageUrl: 1 }
    ).lean();

    await User.updateMany(
      { _id: { $in: participants } },
      { $pull: { rooms: roomId } }
    );

    // Add remove message for user
    const messages = [];
    users.forEach((user) => {
      if (!room.users.toString().includes(user._id.toString())) return;

      const message = createMessage(
        adminUser,
        'announcement',
        `${user.username} has been removed from group`
      );
      messages.push(message);
      room.users = room.users.filter(
        (id) => id.toString() !== user._id.toString()
      );
    });

    room.messages.push(...messages);
    const result = await room.save();

    return res.status(201).json({
      error: false,
      data: {
        room: {
          _id: result._id,
          users: result.users,
          // messages: result.messages,
          messages: result.messages.slice(0 - messages.length),
        },
      },
    });
  } catch (err) {
    next(err);
  }
}

// Get specific room users details
export async function getUsers(req, res, next) {
  try {
    const roomId = req.params.roomId;

    // return res.status(401);
    const room = await Room.findById(roomId)
      .select({ users: 1 })
      .populate({
        path: 'users',
        select: { username: 1, imageUrl: 1 },
      })
      .lean();

    if (!room) throw new Error('room not found');

    return res.status(200).json({
      error: false,
      data: { room: { _id: room._id, users: room.users } },
    });
  } catch (err) {
    next(err);
  }
}

// Exit group
export async function postLeaveRoom(req, res, next) {
  try {
    const userId = req.userId;
    const roomId = req.body.roomId;
    const room = await Room.findById(roomId);
    const user = await User.findById(userId);

    room.users = room.users.filter((id) => id.toString() !== userId);
    user.rooms = user.rooms.filter((id) => id.toString() !== roomId);

    const message = createMessage(
      user,
      'announcement',
      `${user.username} has leave the group`
    );
    room.messages.push(message);

    await user.save();
    await room.save();

    return res.status(200).json({ error: false, data: { roomId: roomId } });
  } catch (err) {
    next(err);
  }
}

// Get Unblock Rooms
export async function getBlockedRooms(req, res, next) {
  try {
    const currentUserId = req.userId;
    log.warn('GetBlockedRooms:');

    const rooms = await User.findById(currentUserId)
      .select({
        blockedRooms: 1,
      })
      .populate({
        path: 'blockedRooms',
        select: { users: 1 },
        populate: { path: 'users', select: { username: 1, imageUrl: 1 } },
      })
      .lean();

    const result = rooms.blockedRooms.map((room) => {
      const otherUser =
        room.users[0]._id.toString() === currentUserId
          ? room.users[1]
          : room.users[2];
      return {
        _id: room._id,
        name: otherUser.username,
        imageUrl: otherUser.imageUrl,
      };
    });

    return res
      .status(200)
      .json({ error: false, data: { blockedRooms: result } });
  } catch (err) {
    next(err);
  }
}

// Blocked Room
export async function postBlockRoom(req, res, next) {
  try {
    const userId = req.userId;
    const roomId = req.body.roomId;

    const room = await Room.findById(roomId).select({ users: 1 }).lean();

    log.warn('PostBlockRoom:', req.body);
    if (!room || !room.users.toString().includes(userId))
      throw new Error('user is not found in room');

    const user = await User.findById(userId);

    if (user.blockedRooms.toString().includes(roomId))
      throw new Error('room is already blocked');

    user.blockedRooms.push(roomId);
    await user.save();

    return res.status(200).json({ error: false, data: { roomId } });
  } catch (err) {
    next(err);
  }
}

// UnBlock Rooms
export async function postUnBlockRooms(req, res, next) {
  try {
    const userId = req.userId;
    const blockedRoomsId = req.body.blockedRoomsId;

    const availableBlockedRoomIds = []; // Blocked Rooms id  present in user db;

    const loggedUser = await User.findById(userId);
    loggedUser.blockedRooms = loggedUser.blockedRooms.filter((id) => {
      if (!blockedRoomsId.toString().includes(id.toString())) return true;
      availableBlockedRoomIds.push(id);
      return false;
    });
    const updatedUser = await loggedUser.save();

    const unblockedRooms = await Room.find({ _id: availableBlockedRoomIds })
      .select({
        isGroup: 1,
        users: 1,
        messages: { $slice: ['$messages', -1] },
      })
      .populate({ path: 'users', select: { username: 1, imageUrl: 1 } })
      .lean();

    const rooms = unblockedRooms.map((room) => {
      const otherUser =
        room.users[0]._id.toString() === userId.toString()
          ? room.users[1]
          : room.users[0];
      return {
        _id: room._id,
        name: otherUser.username,
        imageUrl: otherUser.imageUrl,
        isGroup: room.isGroup,
        users: [room.users[0]._id, room.users[1]._id],
        messages: room.messages,
      };
    });

    return res.status(200).json({
      error: false,
      data: { blockedRooms: updatedUser.blockedRooms, rooms: rooms },
    });
  } catch (err) {
    next(err);
  }
}

// Get url meta data
export async function getUrlMetaData(req, res, next) {
  try {
    const url = req.body.url;
    const body = await fetch(url);
    const html = await body.text();
    const $ = load(html);

    const getMetaTag = (name) => {
      return (
        $(`meta[name=${name}]`).attr('content') ||
        $(`meta[name="og:${name}"]`).attr('content') ||
        $(`meta[name="twitter:${name}"]`).attr('content') ||
        $(`meta[property=${name}]`).attr('content') ||
        $(`meta[property="og:${name}"]`).attr('content') ||
        $(`meta[property="twitter:${name}"]`).attr('content')
      );
    };

    const metaTagData = {
      title:
        getMetaTag('title') ??
        ($(`h1`).text().length > 0 ? $(`h1`).text() : null),
      imageUrl: getMetaTag('image') ?? null,
      description:
        getMetaTag('description') ??
        ($(`p`).text().length > 0 ? $(`p`).text() : null),
    };

    return res.status(200).json({ error: false, data: { meta: metaTagData } });
  } catch (err) {
    next(err);
  }
}

// Update room info
export async function postUpdateRoomInfo(req, res, next) {
  try {
    const userId = req.userId;
    const roomId = req.body.roomId;
    const name = req.body.name;
    const imageUrl = req.body.imageUrl;

    if (!roomId) throw new Error('room_id not provided');

    if (!name && !imageUrl)
      throw new Error('room name or imageurl not provided');

    const room = await Room.findById(roomId);
    const user = await User.findById(userId).lean();

    const messages = [];
    if (name && name.length > 0 && room.name !== name) {
      const text = `${user.username} changed the group name from ${room.name} to ${name}`;
      const message = createMessage(user, 'announcement', text);
      messages.push(message);
      room.name = name;
    }

    if (imageUrl && room.imageUrl !== imageUrl) {
      const text = `${user.username} changed group icon`;
      const message = createMessage(user, 'announcement', text);
      messages.push(message);
      room.imageUrl = imageUrl;
    }

    room.messages.push(...messages);
    const result = await room.save();
    return res.status(201).json({
      error: false,
      data: {
        room: {
          _id: result._id,
          name: result.name,
          imageUrl: result.imageUrl,
          messages: result.messages.slice(0 - messages.length),
        },
      },
    });
  } catch (err) {
    next(err);
  }
}

// Get Signned url for uploading file
export async function postSignedUploadUrl(req, res, next) {
  try {
    const filename = req.body.filename;
    if (!filename) throw new Error('file not found');

    const options = {
      origin: ['*'],
      version: 'v4',
      action: 'write',
      expires: Date.now() + 5 * 60 * 1000, // 5 minutes valid url
    };

    const result = await getStorage()
      .bucket()
      .file(filename)
      .getSignedUrl(options);

    return res.status(200).json({ error: false, data: { url: result[0] } });

    // getStorage()
    //   .bucket()
    //   .file(filename)
    //   .getSignedUrl(options)
    //   .then((result) => {
    //     return res.status(200).json({ error: false, data: { url: result[0] } });
    //   });
  } catch (err) {
    next(err);
  }
}
