import request from 'supertest';
import app from '../../app';
import { Order, OrderAtrrs, OrderStatus } from '../../models/order';
import { Ticket, TicketDoc } from '../../models/ticket';

const buildTicket = async () => {
  const ticket = Ticket.build({
    title: 'movie',
    price: 23,
  });

  await ticket.save();
  return ticket;
};

it('can fetch a list of orders for a user', async () => {
  const userOne = getAuthCookie();
  const userTwo = getAuthCookie();

  const ticketOne = await buildTicket();
  const ticketTwo = await buildTicket();
  const ticketThree = await buildTicket();

  await request(app)
    .post('/api/orders')
    .set('Cookie', userOne)
    .send({ ticketId: ticketOne.id })
    .expect(201);

  const { body: orderOne } = await request(app)
    .post('/api/orders')
    .set('Cookie', userTwo)
    .send({ ticketId: ticketTwo.id })
    .expect(201);

  const { body: orderTwo } = await request(app)
    .post('/api/orders')
    .set('Cookie', userTwo)
    .send({ ticketId: ticketThree.id })
    .expect(201);

  const response = await request(app)
    .get('/api/orders')
    .set('Cookie', userTwo)
    .expect(200);

  expect(response.body.length).toEqual(2);
  expect(response.body[0].ticket.id).toEqual(ticketTwo.id);
  expect(response.body[1].ticket.id).toEqual(ticketThree.id);
  expect(response.body[0].id).toEqual(orderOne.id);
  expect(response.body[1].id).toEqual(orderTwo.id);
});
