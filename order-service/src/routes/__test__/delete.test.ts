import request from 'supertest';
import app from '../../app';
import { Ticket } from '../../models/ticket';
import { Order, OrderStatus } from '../../models/order';
import { natsWrapper } from '../../nats-wrapper';
import { Subjects } from '@ticketchef/common';

jest.mock('../../nats-wrapper.ts');

it('cancels the order successfully', async () => {
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

  await request(app)
    .delete(`/api/orders/${order.id}`)
    .set('Cookie', user)
    .send()
    .expect(204);

  const updatedOrder = await Order.findById(order.id);

  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it('emits an order cancelled event', async () => {
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

  await request(app)
    .delete(`/api/orders/${order.id}`)
    .set('Cookie', user)
    .send()
    .expect(204);

  expect(natsWrapper.client.publish).toHaveBeenCalledTimes(2);
  expect(natsWrapper.client.publish).toHaveBeenLastCalledWith(
    Subjects.OrderCancelled,
    expect.anything(),
    expect.anything()
  );
});
