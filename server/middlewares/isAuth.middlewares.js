import jwt from 'jsonwebtoken';

// Check if user is authorized
const isAuth = (req, res, next) => {
  // Check if header contains authorization token
  const authHeader = req.headers.authorization || req.headers.Authorization;

  if (!authHeader?.startsWith('Bearer '))
    return res
      .status(401)
      .json({ error: true, data: { message: 'Invalid token' } });
  const token = authHeader.split(' ')[1];

  // Verify access token
  jwt.verify(token, process.env.ACCESS_TOKEN_PRIVATE_KEY, (err, decoded) => {
    if (err)
      return res
        .status(401)
        .json({ error: true, data: { message: 'Invalid token' } });
    req.userId = decoded?._id;
    next();
  });
};

export default isAuth;
