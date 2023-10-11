import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import log from 'npmlog';

import User from '../models/User.models.js';
import generateToken from '../utils/generateTokens.js';
import sendEmail from '../utils/resetPassword/sendEmail.js';

// Login
export async function postLogin(req, res, next) {
  const cookies = req?.cookies;
  const { email, password, remember } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) throw new Error('Invalid email or password');

    const verifiedPassword = await bcrypt.compare(password, user.password);
    if (!verifiedPassword) throw new Error('Inavalid email or password');

    const { accessToken, refreshToken } = await generateToken(user);

    if (cookies?.jwt)
      res.clearCookie('jwt', {
        httpOnly: true,
        sameSite: 'None',
        secure: true,
      });

    user.refreshToken = refreshToken;
    await user.save();

    if (remember)
      res.cookie('jwt', refreshToken, {
        httpOnly: true,
        sameSite: 'None',
        secure: true,
        maxAge: 24 * 60 * 60 * 1000, // 1 day
      });

    return res.status(200).json({
      error: false,
      data: {
        accessToken: accessToken,
      },
    });
  } catch (err) {
    next(err);
  }
}

// Signup
export async function postSignup(req, res, next) {
  const { username, email, password } = req.body;
  try {
    const user = await User.findOne({ email }).lean();
    if (user) throw new Error('User with given email already exist');

    const hashedPw = await bcrypt.hash(password, 12);

    await new User({ username, email, password: hashedPw }).save();

    return res.status(201).json({
      error: false,
      data: { message: 'Account created successfully' },
    });
  } catch (err) {
    next(err);
  }
}

// logout
export async function postLogout(req, res, next) {
  const cookies = req.cookies;
  const refreshToken = cookies?.jwt;

  try {
    // Clear cookie
    res.clearCookie('jwt', {
      httpOnly: true,
      sameSite: 'None',
      secure: true,
    });

    const user = await User.findOne({ refreshToken: refreshToken });
    if (user) {
      user.refreshToken = null;
      await user.save();
    }

    return res
      .status(200)
      .json({ error: false, data: { message: 'Logout succesfully' } });
  } catch (err) {
    log.warn('Logout:', err);
    next(err);
  }
}

// Refresh Token
export async function getRefreshToken(req, res, next) {
  try {
    const cookies = req.cookies;
    if (!cookies?.jwt) throw new Error('token not found');

    const refreshToken = cookies.jwt;
    res.clearCookie('jwt', {
      httpOnly: true,
      sameSite: 'None',
      secure: true,
    });

    const user = await User.findOne({ refreshToken });
    // Detected refresh token reuse
    if (!user) {
      jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_PRIVATE_KEY,
        async (err, decoded) => {
          if (err) throw new Error('Forbidden Request');

          // attemped refresh token reuse
          const hackedUser = await User.findOne({ email: decoded.email });
          if (hackedUser) {
            hackedUser.refreshToken = undefined; // Delete  refresh token for user
            await hackedUser.save();
          }
        }
      );
      throw new Error('Forbidden Request');
    }

    // Check RT
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_PRIVATE_KEY,
      async (err, decoded) => {
        if (err) {
          user.refreshToken = undefined;
          await user.save();
          next('Token expire!!!');
        }

        const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
          await generateToken(decoded);

        user.refreshToken = newRefreshToken;
        await user.save();

        res.cookie('jwt', newRefreshToken, {
          httpOnly: true,
          secure: true,
          sameSite: 'None',
          maxAge: 24 * 60 * 60 * 1000,
        });

        return res
          .status(200)
          .json({ error: false, data: { accessToken: newAccessToken } });
      }
    );
  } catch (err) {
    next(err);
  }
}

// Reset Password Send Email
export async function postForgotPassword(req, res, next) {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) throw new Error('User with given email does not exist');

    const payload = { _id: user._id, email: user.email };

    // Generate token for change password
    const token = jwt.sign(payload, process.env.EMAIL_TOKEN_PRIVATE_KEY, {
      expiresIn: '15m',
    });

    // Token for change password
    user.resetPasswordToken = token;
    await user.save();

    const baseUrl = process.env.CLIENT_URL;
    const resetPasswordUrl = `${baseUrl}resetPassword?token=${token}`;
    const userInfo = {
      username: user.username,
      email: user.email,
      baseUrl: baseUrl,
      resetPasswordUrl: resetPasswordUrl,
    };

    // Send email with password change instruction to user
    sendEmail(userInfo, () => {
      return res
        .status(201)
        .json({ error: false, data: { message: 'Email sent successfully' } });
    });
  } catch (err) {
    next(err);
  }
}

// Change password
export async function postUpdatePassword(req, res, next) {
  const newPassword = req.body.password;
  const token = req.query?.token;

  //token not exist
  if (!token) throw new Error('Invalid token');

  try {
    // verify token
    jwt.verify(
      token,
      process.env.EMAIL_TOKEN_PRIVATE_KEY,
      async (err, decoded) => {
        if (err) throw new Error('Invalid token');

        // Check if user exist for given email
        const user = await User.findOne({ email: decoded?.email });
        if (!user) throw new Error('User does not found');

        // Check if refresh password token exist in db
        if (user.resetPasswordToken !== token) throw new Error('Invalid token');

        // Generate hashed password
        bcrypt.hash(newPassword, 12, async (err, hashedPw) => {
          if (err) throw err;

          user.password = hashedPw;
          user.refreshToken = [];
          user.resetPasswordToken = undefined;
          await user.save();

          return res.status(201).json({
            error: false,
            data: { message: 'Password change successfully!!!' },
          });
        });
      }
    );
  } catch (err) {
    next(err);
  }
}
