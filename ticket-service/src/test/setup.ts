import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

declare global {
  var getAuthCookie: () => string[];
  var generateMongooseId: () => string;
}

let mongo: any;

beforeAll(async () => {
  process.env.JWT_KEY = 'testKey';

  mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();

  await mongoose.connect(mongoUri, {});
});

beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();
  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  if (mongo) {
    await mongo.stop();
  }
  await mongoose.connection.close();
});

global.getAuthCookie = () => {
  const token = jwt.sign(
    {
      id: generateMongooseId(),
      email: 'test@test.com',
    },
    process.env.JWT_KEY!
  );

  const base64 = Buffer.from(JSON.stringify({ jwt: token })).toString('base64');

  return [`session=${base64}`];
};

global.generateMongooseId = () => {
  return new mongoose.Types.ObjectId().toHexString();
};
