import { Router } from 'express';

import {
  getUserInfo,
  getSearchUser,
  postUpdateUserInfo,
} from '../controllers/user.controller.js';

const router = Router();

router
  .get('/userInfo', getUserInfo)
  .get('/searchUser', getSearchUser)
  .patch('/userInfo', postUpdateUserInfo);

export default router;
