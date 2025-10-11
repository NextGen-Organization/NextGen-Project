const request = require('supertest');
const app = require('../app');
const userModel = require('../models/userModel');
const bcrypt = require('bcrypt');

jest.mock('../models/userModel');

describe('Auth flows', () => {
  beforeEach(() => jest.resetAllMocks());

  test('registers a new user', async () => {
    // Simulate admin login to obtain access token
    const adminPasswordHash = await bcrypt.hash('adminpass', 10);
    const adminUser = { id: 99, email: 'admin@example.com', password_hash: adminPasswordHash, role: 'admin' };
    // first call to findUserByEmail for login should resolve to admin
    userModel.findUserByEmail.mockResolvedValueOnce(adminUser);
    userModel.findUserById.mockResolvedValueOnce(adminUser);

    const loginRes = await request(app).post('/api/auth/login').send({ email: 'admin@example.com', password: 'adminpass' });
    expect(loginRes.statusCode).toBe(200);
    const accessToken = loginRes.body.accessToken;

    // Now ensure createUser checks email not present and then creates user
    userModel.findUserByEmail.mockResolvedValueOnce(undefined);
    userModel.createUser.mockImplementation(async ({ first_name, last_name, email }) => ({ id: 1, first_name, last_name, email, role: 'student' }));

    const res = await request(app).post('/api/auth/admin/users').set('Authorization', `Bearer ${accessToken}`).send({
      first_name: 'John',
      last_name: 'Doe',
      email: 'john@example.com',
      role: 'student',
      cin: 'CIN12345'
    });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('user');
    expect(res.body).toHaveProperty('initialCredentials');
  });

  test('login with valid credentials', async () => {
    const password_hash = await bcrypt.hash('password123', 10);
    userModel.findUserByEmail.mockResolvedValue({ id: 2, email: 'jane@example.com', password_hash, role: 'teacher' });

    const res = await request(app).post('/api/auth/login').send({ email: 'jane@example.com', password: 'password123' });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('accessToken');
    expect(res.body).toHaveProperty('refreshToken');
  });

  test('refresh returns new access token', async () => {
    // We'll simulate creating a refresh token by calling login then using the returned token
    const password_hash = await bcrypt.hash('password123', 10);
    const user = { id: 3, email: 'rik@example.com', password_hash, role: 'admin' };
    userModel.findUserByEmail.mockResolvedValue(user);
    userModel.findUserById.mockResolvedValue(user);

    const loginRes = await request(app).post('/api/auth/login').send({ email: 'rik@example.com', password: 'password123' });
    expect(loginRes.statusCode).toBe(200);
    const { refreshToken } = loginRes.body;
    const refreshRes = await request(app).post('/api/auth/refresh').send({ token: refreshToken });
    expect(refreshRes.statusCode).toBe(200);
    expect(refreshRes.body).toHaveProperty('accessToken');
  });
});
