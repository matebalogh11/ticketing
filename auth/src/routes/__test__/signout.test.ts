import request from 'supertest';
import app from '../../app';

describe('Signout test cases', () => {
  it('removes the cookie when signing out ', async () => {
    const email = 'test@test.com';
    const password = 'password';

    await request(app)
      .post('/api/users/signup')
      .send({
        email,
        password,
      })
      .expect(201);

    await request(app)
      .post('/api/users/signin')
      .send({
        email,
        password,
      })
      .expect(200);

    const response = await request(app)
      .post('/api/users/signout')
      .send({})
      .expect(200);

    expect(response.get('Set-Cookie')[0]).toEqual(
      'session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; httponly'
    );
  });
});
