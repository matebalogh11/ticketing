import request from 'supertest';
import app from '../../app';

describe('Signin test cases', () => {
  it('returns a 201 and cookie header on successful signin', async () => {
    const email = 'test@test.com';
    const password = 'password';

    await request(app)
      .post('/api/users/signup')
      .send({
        email,
        password,
      })
      .expect(201);

    const response = await request(app)
      .post('/api/users/signin')
      .send({
        email,
        password,
      })
      .expect(200);

    expect(response.get('Set-Cookie')).toBeDefined();
  });

  it('fails when a non existent email is supplied', async () => {
    const email = 'test@test.com';
    const password = 'password';

    await request(app)
      .post('/api/users/signin')
      .send({
        email,
        password,
      })
      .expect(400);
  });

  it('fails when an incorrect password is supplied', async () => {
    const email = 'test@test.com';
    const password = 'password';
    const wrongPw = 'wrongPasswordd';

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
        wrongPw,
      })
      .expect(400);
  });

  it.each([
    ['email', 'invalid.com', 'password'],
    ['password', 'test@test.com', 'asd'],
  ])('returns a 400 with an invalid %s', async (_, email, password) => {
    await request(app)
      .post('/api/users/signin')
      .send({
        email,
        password,
      })
      .expect(400);
  });
});
