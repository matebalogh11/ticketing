import request from 'supertest';
import app from '../../app';
import { Ticket } from '../../models/ticket';

it('fetches the order', async () => {
  const user = getAuthCookie();

  const ticket = await Ticket.build({
    title: 'movie',
    price: 23,
  }).save();

  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ ticketId: ticket.id })
    .expect(201);

  const { body: fetchOrder } = await request(app)
    .get(`/api/orders/${order.id}`)
    .set('Cookie', user)
    .send()
    .expect(200);

  expect(fetchOrder.id).toEqual(order.id);
});

it('returns 401 if the orders user id is different than in the request', async () => {
  const ticket = await Ticket.build({
    title: 'movie',
    price: 23,
  }).save();

  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', getAuthCookie())
    .send({ ticketId: ticket.id })
    .expect(201);

  const { body: fetchOrder } = await request(app)
    .get(`/api/orders/${order.id}`)
    .set('Cookie', getAuthCookie())
    .send()
    .expect(401);
});
