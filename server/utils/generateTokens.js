import jwt from 'jsonwebtoken';

// Generate Access and Refresh Token
const generateToken = async (user) => {
  try {
    const payload = { _id: user._id, email: user.email };

    const accessToken = jwt.sign(
      payload,
      process.env.ACCESS_TOKEN_PRIVATE_KEY,
      { expiresIn: '1h' }
    );

    const refreshToken = jwt.sign(
      payload,
      process.env.REFRESH_TOKEN_PRIVATE_KEY,
      { expiresIn: '1d' }
    );

    return Promise.resolve({ accessToken, refreshToken });
  } catch (err) {
    return Promise.reject(err);
  }
};

export default generateToken;
