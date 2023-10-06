import { model, Schema } from 'mongoose';

const roomSchema = new Schema(
  {
    name: {
      type: String,
    },
    imageUrl: {
      type: String,
    },
    users: [
      {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User',
      },
    ],
    admin: {
      type: Schema.Types.ObjectId,
    },
    isGroup: {
      type: Boolean,
      default: false,
    },
    messages: [
      {
        author: {
          authorId: {
            type: Schema.Types.ObjectId,
            required: true,
          },
          username: {
            type: String,
          },
          imageUrl: {
            type: String,
          },
        },
        type: {
          type: String,
          required: true,
        },
        text: {
          type: String,
          required: true,
        },
        fileMetaData: {
          _id: false,
          name: {
            type: String,
          },
          size: {
            type: Number,
          },
          mimetype: {
            type: String,
          },
        },
        date: {
          type: String,
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);

export default model('Room', roomSchema);
