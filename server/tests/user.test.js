const request = require('supertest');
const app = require('../index'); // express app
const sequelize = require('../db');

let token;

describe('User API', () => {
  const testUser = {
    username: "testdoctor",
    email: "testdoctor@example.com",
    password: "test1234",
    role: "Doctor"
  };

  it('🟢 Admin can register Doctor', async () => {
    const loginRes = await request(app)
      .post('/api/users/login')
      .send({ email: "admin@example.com", password: "admin" });

    expect(loginRes.statusCode).toBe(200);
    token = loginRes.body.token;

    const res = await request(app)
      .post('/api/users/registration')
      .set('Authorization', `Bearer ${token}`)
      .send(testUser);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
  });

  it('🟢 Doctor can log in', async () => {
    const res = await request(app)
      .post('/api/users/login')
      .send({
        email: testUser.email,
        password: testUser.password
      });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
  });

  it('🟢 Check token', async () => {
    const res = await request(app)
      .get('/api/users/auth')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('role');
  });

  afterAll(async () => {
    await sequelize.close();
  });
});
