import log from 'npmlog';

import User from '../models/User.models.js';
import mongoose from 'mongoose';

// User  info
export async function getUserInfo(req, res, next) {
  const userId = req.userId;
  try {
    const user = await User.findById(userId).lean();

    if (!user) throw new Error('User does not found');

    return res.status(200).json({
      error: false,
      data: {
        userId: user._id,
        username: user.username,
        email: user.email,
        imageUrl: user.imageUrl,
      },
    });
  } catch (err) {
    log.error('GetUserInfo Error:', err);
    next(err);
  }
}

// Search user with name
export async function getSearchUser(req, res, next) {
  const name = req.query.name; // email query
  const userId = req.userId;

  try {
    const users = await User.find({
      $and: [
        { _id: { $ne: new mongoose.Types.ObjectId(userId) } },
        { email: { $regex: `${name}`, $options: 'i' } },
      ],
    })
      .select({ username: 1, imageUrl: 1, email: 1 })
      .limit(10);

    return res.status(200).json({ error: false, data: { users: users } });
  } catch (err) {
    log.error('GetSearchUser Error:', err);
    next(err);
  }
}

// Update user detail
export async function postUpdateUserInfo(req, res, next) {
  const username = req.body.username;
  const imageUrl = req.body.imageUrl;

  try {
    const user = await User.findById(req.userId);

    if (
      (!username || username.length === 0 || username === user.username) &&
      !imageUrl
    )
      throw new Error('Please provide valid detail');

    if (username && username.length > 0 && username !== user.username)
      user.username = username;

    if (imageUrl) user.imageUrl = imageUrl;

    const result = await user.save();

    return res.status(200).json({
      error: false,
      data: { username: result.username, imageUrl: result.imageUrl },
    });
  } catch (err) {
    log.error('PostUpdateUserInfo Error:', err);
    next(err);
  }
}
