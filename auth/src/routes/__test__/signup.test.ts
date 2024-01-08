import request from 'supertest';
import app from '../../app';

describe('Signup test cases', () => {
  it('returns a 201 on successful signup', async () => {
    await request(app)
      .post('/api/users/signup')
      .send({
        email: 'test@test.com',
        password: 'password',
      })
      .expect(201);
  });

  it.each([
    ['email', 'invalid.com', 'password'],
    ['password', 'test@test.com', 'asd'],
  ])('returns a 400 with an invalid %s', async (_, email, password) => {
    await request(app)
      .post('/api/users/signup')
      .send({
        email,
        password,
      })
      .expect(400);
  });

  it('returns a 400 with missing email and password', async () => {
    await request(app).post('/api/users/signup').send({}).expect(400);
  });

  it('disallows duplicate emails', async () => {
    await request(app)
      .post('/api/users/signup')
      .send({
        email: 'test@test.com',
        password: 'password',
      })
      .expect(201);

    await request(app)
      .post('/api/users/signup')
      .send({
        email: 'test@test.com',
        password: 'password',
      })
      .expect(400);
  });

  it('contains the header set-cookie after successful signup', async () => {
    const response = await request(app)
      .post('/api/users/signup')
      .send({
        email: 'test@test.com',
        password: 'password',
      })
      .expect(201);

    expect(response.get('Set-Cookie')).toBeDefined();
  });
});
