const request = require('supertest');
const app = require('../../src/app');
const Auth = require('../../src/models/auth.model');
const Profile = require('../../src/models/profile.model');
const jwt = require('jsonwebtoken');

jest.mock('../../src/models/auth.model');
jest.mock('../../src/models/profile.model');

describe('Auth API Integration Tests (Refactored)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/auth/signup', () => {
    test('should register a new account (creating Auth & Profile split records)', async () => {
      Auth.findOne.mockResolvedValue(null);
      
      // Mock Auth instantiation
      Auth.mockImplementation(function (data) {
        const instance = {
          _id: 'mock_auth_id_123',
          email: data.email,
          password: data.password
        };
        instance.save = jest.fn().mockResolvedValue(instance);
        return instance;
      });

      // Mock Profile instantiation
      Profile.mockImplementation(function (data) {
        const instance = {
          authId: data.authId,
          fullName: data.fullName,
          gender: data.gender,
          universityName: null
        };
        instance.save = jest.fn().mockResolvedValue(instance);
        return instance;
      });

      const response = await request(app)
        .post('/api/auth/signup')
        .send({
          email: 'refactor@example.com',
          password: 'SecurePassword123!',
          fullName: 'Jane Doe',
          gender: 'female'
        });

      expect(response.status).toBe(201);
      expect(response.body).toEqual({
        message: 'Registration successful',
        auth: {
          id: 'mock_auth_id_123',
          email: 'refactor@example.com'
        },
        profile: {
          fullName: 'Jane Doe',
          gender: 'female',
          universityName: null
        }
      });
    });

    test('should fail if email is already registered', async () => {
      Auth.findOne.mockResolvedValue({ email: 'refactor@example.com' });

      const response = await request(app)
        .post('/api/auth/signup')
        .send({
          email: 'refactor@example.com',
          password: 'SecurePassword123!',
          fullName: 'Jane Doe',
          gender: 'female'
        });

      expect(response.status).toBe(409);
      expect(response.body).toEqual({ error: 'Email is already registered' });
    });

    test('should fail if mandatory signup field is missing', async () => {
      const response = await request(app)
        .post('/api/auth/signup')
        .send({
          email: 'refactor@example.com',
          password: 'SecurePassword123!'
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('required');
    });
  });

  describe('POST /api/auth/login', () => {
    test('should authenticate user and return ONLY accessToken', async () => {
      const mockAuth = {
        _id: 'mock_auth_id_123',
        email: 'refactor@example.com',
        comparePassword: jest.fn().mockResolvedValue(true)
      };
      
      Auth.findOne.mockResolvedValue(mockAuth);

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'refactor@example.com',
          password: 'SecurePassword123!'
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('accessToken');
      expect(response.body).not.toHaveProperty('refreshToken'); // Strict token cleanup check
      expect(response.body.message).toBe('Login successful');
    });

    test('should reject incorrect login credentials', async () => {
      const mockAuth = {
        comparePassword: jest.fn().mockResolvedValue(false)
      };
      Auth.findOne.mockResolvedValue(mockAuth);

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'refactor@example.com',
          password: 'WrongPassword123!'
        });

      expect(response.status).toBe(401);
      expect(response.body).toEqual({ error: 'Invalid email or password' });
    });
  });

  describe('POST /api/auth/logout', () => {
    test('should successfully log out statelessly', async () => {
      const response = await request(app)
        .post('/api/auth/logout')
        .send();

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: 'Logged out successfully' });
    });
  });
});
