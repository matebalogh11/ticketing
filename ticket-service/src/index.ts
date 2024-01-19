import mongoose from 'mongoose';
import app from './app';
import { natsWrapper } from './nats-wrapper';

const start = async () => {
  const envVariables = ['JWT_KEY', 'MONGO_URI'];

  envVariables.forEach((envVar) => {
    if (!process.env[envVar]) {
      throw new Error(`${envVar} should be defined!`);
    }
  });

  try {
    await natsWrapper.connect(
      'ticketing',
      'my_client_id',
      'http://nats-srv:4222'
    );
    natsWrapper.client.on('close', () => {
      console.log('NATS connection closed');
      process.exit();
    });
    process.on('SIGINT', () => {
      natsWrapper.client.close();
    });
    process.on('SIGTERM', () => {
      natsWrapper.client.close();
    });

    await mongoose.connect(process.env.MONGO_URI!);
    console.log('Db connected!');
  } catch (err) {
    console.error(err);
  }

  app.listen(3000, () => {
    console.log('Listening on port 3000');
  });
};

start();
