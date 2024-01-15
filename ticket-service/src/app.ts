import express from 'express';
import { json } from 'body-parser';

import cookieSession from 'cookie-session';

import { currentUser, errorHandler } from '@ticketchef/common';
import { NotFoundError } from '@ticketchef/common';
import { createTicketRouter } from './routes/new';

const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test',
  })
);
app.use(currentUser);

app.use(createTicketRouter);

app.all('*', () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export default app;