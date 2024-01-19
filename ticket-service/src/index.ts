import mongoose from 'mongoose';
import app from './app';
import { natsWrapper } from './nats-wrapper';

const start = async () => {
  const envVariables = [
    'JWT_KEY',
    'MONGO_URI',
    'CLUSTER_ID',
    'CLIENT_ID',
    'NATS_URL',
  ];

  envVariables.forEach((envVar) => {
    if (!process.env[envVar]) {
      throw new Error(`${envVar} should be defined!`);
    }
  });

  try {
    await natsWrapper.connect(
      process.env.CLUSTER_ID!,
      process.env.CLIENT_ID!,
      process.env.NATS_URL!
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
