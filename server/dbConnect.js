import mongoose from 'mongoose';
import log from 'npmlog';

const dbConnect = () => {
  mongoose.set('strictQuery', true);
  mongoose.connect(process.env.MONGODB_URL);

  mongoose.connection.on('connected', () => {
    log.info('MongoDb', 'Connected to database successfully');
  });

  mongoose.connection.on('error', (err) => {
    log.error('MongoDb', 'Error while connecting to database', err);
  });

  mongoose.connection.on('disconnected', () => {
    log.info('MongoDb', 'Database connection disconnected');
  });
};

export default dbConnect;
