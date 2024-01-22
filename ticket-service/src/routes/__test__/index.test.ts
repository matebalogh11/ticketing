import request from 'supertest';
import app from '../../app';

it('can fetch a list of tickets', async () => {
  const ticketInfoList = [
    { title: 'movie', price: 23 },
    { title: 'concert', price: 24 },
    { title: 'rally', price: 25 },
  ];

  const promiseList = ticketInfoList.map((ticketInfo) => {
    return request(app)
      .post('/api/tickets')
      .set('Cookie', global.getAuthCookie())
      .send(ticketInfo)
      .expect(201);
  });

  await Promise.all(promiseList);

  const response = await request(app).get('/api/tickets').send().expect(200);

  expect(response.body.tickets.length).toEqual(ticketInfoList.length);
  for (let i = 0; i < ticketInfoList.length; i++) {
    expect(response.body.tickets[i].title).toEqual(ticketInfoList[i].title);
    expect(response.body.tickets[i].price).toEqual(ticketInfoList[i].price);
  }
});
