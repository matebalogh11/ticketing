import mongoose from 'mongoose';
import app from './app';

const start = async () => {
  const envVariables = ['JWT_KEY', 'MONGO_URI'];

  envVariables.map((envVar) => {
    if (!process.env[envVar]) {
      throw new Error(`${envVar} should be defined!`);
    }
  });

  try {
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
