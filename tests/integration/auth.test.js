const request = require('supertest');
const app = require('../../src/app');
const User = require('../../src/models/user.model');
const RefreshToken = require('../../src/models/token.model');
const jwt = require('jsonwebtoken');

jest.mock('../../src/models/user.model');
jest.mock('../../src/models/token.model');

describe('Auth API Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/auth/signup', () => {
    test('should register a new user successfully', async () => {
      User.findOne.mockResolvedValue(null);
      User.mockImplementation(function (data) {
        const instance = {
          _id: 'mock_user_id_123',
          name: data.name,
          email: data.email,
          password: data.password,
          gender: data.gender
        };
        instance.save = jest.fn().mockResolvedValue(instance);
        return instance;
      });

      const response = await request(app)
        .post('/api/auth/signup')
        .send({
          name: 'Jane Doe',
          email: 'jane@example.com',
          password: 'SecurePassword123!',
          gender: 'female'
        });

      if (response.status !== 201) {
        console.log('SIGNUP ERROR BODY:', response.body);
      }
      expect(response.status).toBe(201);
      expect(response.body).toEqual({
        message: 'Registration successful',
        user: {
          id: 'mock_user_id_123',
          email: 'jane@example.com',
          name: 'Jane Doe',
          gender: 'female'
        }
      });
    });

    test('should fail if email is already registered', async () => {
      User.findOne.mockResolvedValue({ email: 'jane@example.com' });

      const response = await request(app)
        .post('/api/auth/signup')
        .send({
          name: 'Jane Doe',
          email: 'jane@example.com',
          password: 'SecurePassword123!',
          gender: 'female'
        });

      expect(response.status).toBe(409);
      expect(response.body).toEqual({ error: 'Email is already registered' });
    });

    test('should fail if field is missing', async () => {
      const response = await request(app)
        .post('/api/auth/signup')
        .send({
          email: 'jane@example.com',
          password: 'SecurePassword123!'
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('required');
    });
  });

  describe('POST /api/auth/login', () => {
    test('should log in a user and return access and refresh tokens', async () => {
      const mockUser = {
        _id: 'mock_user_id_123',
        email: 'jane@example.com',
        name: 'Jane Doe',
        comparePassword: jest.fn().mockResolvedValue(true)
      };
      
      User.findOne.mockResolvedValue(mockUser);
      RefreshToken.prototype.save = jest.fn().mockResolvedValue(true);

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'jane@example.com',
          password: 'SecurePassword123!'
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('accessToken');
      expect(response.body).toHaveProperty('refreshToken');
      expect(response.body.user).toEqual({
        id: 'mock_user_id_123',
        email: 'jane@example.com',
        name: 'Jane Doe'
      });
    });

    test('should reject invalid credentials', async () => {
      const mockUser = {
        comparePassword: jest.fn().mockResolvedValue(false)
      };
      User.findOne.mockResolvedValue(mockUser);

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'jane@example.com',
          password: 'WrongPassword123!'
        });

      expect(response.status).toBe(401);
      expect(response.body).toEqual({ error: 'Invalid email or password' });
    });
  });

  describe('POST /api/auth/logout', () => {
    test('should successfully log out and invalidate refresh token', async () => {
      RefreshToken.findOneAndDelete.mockResolvedValue({ token: 'mock_refresh_token_123' });

      const response = await request(app)
        .post('/api/auth/logout')
        .send({
          refreshToken: 'mock_refresh_token_123'
        });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: 'Logged out successfully' });
    });

    test('should fail if token is missing', async () => {
      const response = await request(app)
        .post('/api/auth/logout')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: 'Refresh token is required' });
    });
  });
});
