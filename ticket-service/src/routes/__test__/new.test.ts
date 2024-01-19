import request from 'supertest';
import app from '../../app';
import { Ticket } from '../../models/ticket';
import { natsWrapper } from '../../nats-wrapper';
import { Subjects } from '@ticketchef/common';

it('has a route handler listening to /api/tickets for post requests', async () => {
  const response = await request(app).post('/api/tickets').send({});

  expect(response.status).not.toEqual(404);
});

it('can only be accessed if the user is signed in', async () => {
  const response = await request(app).post('/api/tickets').send({});

  expect(response.status).toBe(401);
});

it('returns a status other than 401 if the user is signed in', async () => {
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', getAuthCookie())
    .send({});

  expect(response.status).not.toEqual(401);
});

it('returns an error if an invalid title is provided', async () => {
  await request(app)
    .post('/api/tickets')
    .set('Cookie', getAuthCookie())
    .send({
      title: '',
      price: 10,
    })
    .expect(400);

  await request(app)
    .post('/api/tickets')
    .set('Cookie', getAuthCookie())
    .send({
      price: 10,
    })
    .expect(400);
});

it('return an error if an invalid price is provided', async () => {
  await request(app)
    .post('/api/tickets')
    .set('Cookie', getAuthCookie())
    .send({
      title: 'The phantom',
      price: -10,
    })
    .expect(400);

  await request(app)
    .post('/api/tickets')
    .set('Cookie', getAuthCookie())
    .send({
      title: 'The phantom',
    })
    .expect(400);
});

it('creates a ticket with valid inputs', async () => {
  expect(await Ticket.countDocuments()).toEqual(0);
  const title = 'The phantom';
  const price = 20;

  await request(app)
    .post('/api/tickets')
    .set('Cookie', getAuthCookie())
    .send({
      title,
      price,
    })
    .expect(201);

  const tickets = await Ticket.find({});

  expect(tickets.length).toEqual(1);
  expect(tickets[0].title).toEqual(title);
  expect(tickets[0].price).toEqual(price);
});

it('publishes an event', async () => {
  const title = 'The phantom';

  await request(app)
    .post('/api/tickets')
    .set('Cookie', getAuthCookie())
    .send({
      title,
      price: 20,
    })
    .expect(201);

  expect(natsWrapper.client.publish).toHaveBeenCalledTimes(1);
  expect(natsWrapper.client.publish).toHaveBeenCalledWith(
    Subjects.TicketCreated,
    expect.anything(),
    expect.anything()
  );
});
