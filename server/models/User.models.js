import { model, Schema } from 'mongoose';

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
  },
  resetPasswordToken: {
    type: String,
  },
  refreshToken: String,
  lastSeen: {
    type: String,
  },
  rooms: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Room',
    },
  ],
  blockedRooms: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Room',
    },
  ],
});

export default model('User', userSchema);
