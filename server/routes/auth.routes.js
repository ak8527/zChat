import { Router } from 'express';

import {
  postLogin,
  postLogout,
  postSignup,
  getRefreshToken,
  postUpdatePassword,
  postForgotPassword,
} from '../controllers/auth.controllers.js';

import validate from '../middlewares/validation.middlewares.js';
import {
  loginSchema,
  signupSchema,
  emailSchema,
  passwordSchema,
} from '../utils/validation.js';

const router = Router();

router
  .post('/login', validate(loginSchema), postLogin) // Get Login info
  .post('/signup', validate(signupSchema), postSignup) // Create User
  .get('/refreshToken', getRefreshToken) // Generate New Refresh Token
  .post('/forgotPassword', validate(emailSchema), postForgotPassword) // Send Forgot Password Email
  .patch('/resetPassword', validate(passwordSchema), postUpdatePassword) // Change User Password
  .delete('/logout', postLogout); // Logout User

export default router;
