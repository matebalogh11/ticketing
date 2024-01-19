import request from 'supertest';
import app from '../../app';
import { natsWrapper } from '../../nats-wrapper';
import { Subjects } from '@ticketchef/common';

it('returns a 404 if the provice id does not exist', async () => {
  await request(app)
    .put(`/api/tickets/${generateMongooseId()}`)
    .set('Cookie', getAuthCookie())
    .send({
      title: 'asd',
      price: 20,
    })
    .expect(404);
});

it('returns a 401 if the user is not authenticated', async () => {
  await request(app)
    .put(`/api/tickets/${generateMongooseId()}`)
    .send({
      title: 'asd',
      price: 20,
    })
    .expect(401);
});

it('returns a 401 if the user does not own the ticket', async () => {
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', getAuthCookie())
    .send({
      title: 'foreignTicket',
      price: 20,
    });

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', getAuthCookie())
    .send({
      title: 'newTitle',
      price: 1000,
    })
    .expect(401);
});

it('returns a 400 if the user provides an invalid title or price', async () => {
  await request(app)
    .put(`/api/tickets/123`)
    .set('Cookie', getAuthCookie())
    .send({
      title: '',
      price: 20,
    })
    .expect(400);

  await request(app)
    .put(`/api/tickets/123`)
    .set('Cookie', getAuthCookie())
    .send({
      title: 'asd',
      price: -2,
    })
    .expect(400);
});

it('updates the ticket provided valid inputs', async () => {
  const cookie = getAuthCookie();
  const newTitle = 'newTitle';
  const newPrice = 1000;

  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'music',
      price: 20,
    });

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: newTitle,
      price: newPrice,
    });

  const updatedTicket = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .send()
    .expect(200);

  expect(updatedTicket.body.title).toEqual(newTitle);
  expect(updatedTicket.body.price).toEqual(newPrice);
});

it('publishes an event', async () => {
  const cookie = getAuthCookie();

  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'music',
      price: 20,
    });

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'new',
      price: 200,
    });

  expect(natsWrapper.client.publish).toHaveBeenCalledTimes(2);
  expect(natsWrapper.client.publish).toHaveBeenNthCalledWith(
    1,
    Subjects.TicketCreated,
    expect.anything(),
    expect.anything()
  );
  expect(natsWrapper.client.publish).toHaveBeenNthCalledWith(
    2,
    Subjects.TicketUpdated,
    expect.anything(),
    expect.anything()
  );
});
