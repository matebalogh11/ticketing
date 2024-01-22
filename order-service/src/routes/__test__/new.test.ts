import request from 'supertest';
import app from '../../app';
import { Ticket } from '../../models/ticket';
import { Order, OrderStatus } from '../../models/order';

it('has a route handler listening to /api/orders for post requests', async () => {
  const response = await request(app).post('/api/orders').send({});

  expect(response.status).not.toEqual(404);
});

it('can only be accessed if the user is signed in', async () => {
  const response = await request(app).post('/api/orders').send({});

  expect(response.status).toBe(401);
});

it('returns a status other than 401 if the user is signed in', async () => {
  const response = await request(app)
    .post('/api/orders')
    .set('Cookie', getAuthCookie())
    .send({});

  expect(response.status).not.toEqual(401);
});

it('returns an error if ticket id is not provided', async () => {
  await request(app)
    .post('/api/orders')
    .set('Cookie', getAuthCookie())
    .send({})
    .expect(400);
});

it('returns an error if ticket does not exists', async () => {
  const ticketId = generateMongooseId();
  await request(app)
    .post('/api/orders')
    .set('Cookie', getAuthCookie())
    .send({
      ticketId,
    })
    .expect(404);
});

it('returns an error if the ticket is reserved', async () => {
  const ticket = await Ticket.build({
    title: 'test',
    price: 20,
  }).save();

  await Order.build({
    userId: generateMongooseId(),
    status: OrderStatus.Created,
    expiresAt: new Date(),
    ticket,
  }).save();

  await request(app)
    .post('/api/orders')
    .set('Cookie', getAuthCookie())
    .send({
      ticketId: ticket.id,
    })
    .expect(400);
});

it('reserves a ticket', async () => {
  const ticket = await Ticket.build({
    title: 'test',
    price: 20,
  }).save();

  const response = await request(app)
    .post('/api/orders')
    .set('Cookie', getAuthCookie())
    .send({
      ticketId: ticket.id,
    })
    .expect(201);

  expect(response.body.ticket).toBeDefined();
  expect(response.body.ticket.title).toEqual(ticket.title);
});

it.todo('emits an order created event');
