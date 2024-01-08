import request from 'supertest';
import app from '../../app';

describe('CurrentUser test cases', () => {
  it('returns the current user', async () => {
    const email = 'test@test.com';

    const cookie = await getAuthCookie();
    const response = await request(app)
      .get('/api/users/currentUser')
      .set('Cookie', cookie)
      .send()
      .expect(200);

    expect(response.body.currentUser.email).toBeDefined();
    expect(response.body.currentUser.id).toBeDefined();
    expect(response.body.currentUser.email).toEqual(email);
  });

  it('responds wuth null if not authenticated', async () => {
    const response = await request(app)
      .get('/api/users/currentUser')
      .send()
      .expect(200);

    expect(response.body.currentUser).toBe(null);
  });
});
