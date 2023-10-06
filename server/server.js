import admin from 'firebase-admin';
import cookieParser from 'cookie-parser';
import express from 'express';
import log from 'npmlog';

import dbConnect from './dbConnect.js';
import cors from './middlewares/cors.middlewares.js';
import errorHandler from './middlewares/error.middlewares.js';
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import chatRoutes from './routes/chat.routes.js';
import initWs from './services/websocket.js';
import isAuth from './middlewares/isAuth.middlewares.js';
import serviceAccount from './firebase.json' assert { type: 'json' };

// Configure npmlog
log.enableColor();

// init app
const app = express();

// built-in middleware for json
app.use(express.json());

// middleware for cookies
app.use(cookieParser());

// Cross Origin resource sharing
app.use(cors);

// firebase app initialization
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: process.env.BUCKET_NAME,
});

// routes
app.use('/api/auth', authRoutes);
app.use('/api/user', isAuth, userRoutes);
app.use('/api/chat', isAuth, chatRoutes);

// Error Handling MIDDLEWARE
app.use(errorHandler);

try {
  // Connect to mongodb database
  dbConnect();
  // Listening port 8080
  const server = app.listen(process.env.PORT);
  // initialize websocket
  initWs(server);
} catch (error) {
  log.error(error);
}
