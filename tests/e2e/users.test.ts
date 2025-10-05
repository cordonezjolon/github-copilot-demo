import 'reflect-metadata';
import request from 'supertest';
import app from '../../src/app';
import { sequelize } from '../../src/config/database';
import { User } from '../../src/models/User';

describe('Users API E2E Tests', () => {
  beforeAll(async () => {
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  beforeEach(async () => {
    await User.destroy({ where: {}, truncate: true });
  });

  describe('POST /api/users', () => {
    it('should create a new user', async () => {
      const userData = {
        email: 'test@example.com',
        name: 'John Doe',
        age: 25,
      };

      const response = await request(app)
        .post('/api/users')
        .send(userData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.email).toBe(userData.email);
      expect(response.body.data.name).toBe(userData.name);
      expect(response.body.data.age).toBe(userData.age);
      expect(response.body.data.id).toBeDefined();
    });

    it('should return 400 for invalid email', async () => {
      const userData = {
        email: 'invalid-email',
        name: 'John Doe',
        age: 25,
      };

      const response = await request(app)
        .post('/api/users')
        .send(userData)
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('should return 409 for duplicate email', async () => {
      const userData = {
        email: 'test@example.com',
        name: 'John Doe',
        age: 25,
      };

      await request(app).post('/api/users').send(userData).expect(201);

      const response = await request(app)
        .post('/api/users')
        .send(userData)
        .expect(409);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('already exists');
    });
  });

  describe('GET /api/users', () => {
    it('should return all users', async () => {
      await User.create({
        email: 'user1@example.com',
        name: 'User 1',
        age: 25,
        isActive: true,
      });
      await User.create({
        email: 'user2@example.com',
        name: 'User 2',
        age: 30,
        isActive: true,
      });

      const response = await request(app).get('/api/users').expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(2);
    });

    it('should return empty array when no users exist', async () => {
      const response = await request(app).get('/api/users').expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(0);
    });
  });

  describe('GET /api/users/:id', () => {
    it('should return a user by id', async () => {
      const user = await User.create({
        email: 'test@example.com',
        name: 'John Doe',
        age: 25,
        isActive: true,
      });

      const response = await request(app).get(`/api/users/${user.id}`).expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBe(user.id);
      expect(response.body.data.email).toBe(user.email);
    });

    it('should return 404 for non-existent user', async () => {
      const fakeId = '123e4567-e89b-12d3-a456-426614174000';
      const response = await request(app).get(`/api/users/${fakeId}`).expect(404);

      expect(response.body.success).toBe(false);
    });
  });

  describe('PUT /api/users/:id', () => {
    it('should update a user', async () => {
      const user = await User.create({
        email: 'test@example.com',
        name: 'John Doe',
        age: 25,
        isActive: true,
      });

      const updateData = {
        name: 'Jane Doe',
        age: 30,
      };

      const response = await request(app)
        .put(`/api/users/${user.id}`)
        .send(updateData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe(updateData.name);
      expect(response.body.data.age).toBe(updateData.age);
    });

    it('should return 404 for non-existent user', async () => {
      const fakeId = '123e4567-e89b-12d3-a456-426614174000';
      const updateData = { name: 'Jane Doe' };

      const response = await request(app)
        .put(`/api/users/${fakeId}`)
        .send(updateData)
        .expect(404);

      expect(response.body.success).toBe(false);
    });
  });

  describe('DELETE /api/users/:id', () => {
    it('should delete a user', async () => {
      const user = await User.create({
        email: 'test@example.com',
        name: 'John Doe',
        age: 25,
        isActive: true,
      });

      await request(app).delete(`/api/users/${user.id}`).expect(204);

      const deletedUser = await User.findByPk(user.id);
      expect(deletedUser).toBeNull();
    });

    it('should return 404 for non-existent user', async () => {
      const fakeId = '123e4567-e89b-12d3-a456-426614174000';
      const response = await request(app).delete(`/api/users/${fakeId}`).expect(404);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/health', () => {
    it('should return health check', async () => {
      const response = await request(app).get('/api/health').expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('API is running');
    });
  });
});
