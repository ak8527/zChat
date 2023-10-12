import { Router } from 'express';

import {
  getUserInfo,
  getSearchUser,
  postUpdateUserInfo,
} from '../controllers/user.controller.js';

const router = Router();

router
  .get('/userInfo', getUserInfo) // Get User info like userId email etc
  .get('/searchUser', getSearchUser) // Get list of search user
  .patch('/userInfo', postUpdateUserInfo); // Update user info like username or image

export default router;
