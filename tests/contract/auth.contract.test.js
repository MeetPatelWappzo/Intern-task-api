const fs = require('fs');
const path = require('path');
const request = require('supertest');
const app = require('../../src/app');
const Auth = require('../../src/models/auth.model');
const Profile = require('../../src/models/profile.model');

jest.mock('../../src/models/auth.model');
jest.mock('../../src/models/profile.model');

describe('Auth OpenAPI Contract Verification Tests', () => {
  let openApiSpec;

  beforeAll(() => {
    const specPath = path.join(__dirname, '../../specs/002-refactor-auth-profile/contracts/auth.openapi.json');
    const specContent = fs.readFileSync(specPath, 'utf8');
    openApiSpec = JSON.parse(specContent);
  });

  test('OpenAPI contract schema file should load successfully', () => {
    expect(openApiSpec).toBeDefined();
    expect(openApiSpec.openapi).toBe('3.0.0');
    expect(openApiSpec.paths).toHaveProperty('/auth/signup');
    expect(openApiSpec.paths).toHaveProperty('/auth/login');
  });

  test('POST /api/auth/signup response payload matches contract SignupResponse schema', async () => {
    Auth.findOne.mockResolvedValue(null);
    
    Auth.mockImplementation(function (data) {
      const instance = {
        _id: 'mock_auth_id_123',
        email: data.email,
        password: data.password
      };
      instance.save = jest.fn().mockResolvedValue(instance);
      return instance;
    });

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
    
    // Validate contract structure for SignupResponse
    expect(response.body).toHaveProperty('message');
    expect(response.body).toHaveProperty('auth');
    expect(response.body.auth).toHaveProperty('id');
    expect(response.body.auth).toHaveProperty('email');
    expect(response.body).toHaveProperty('profile');
    expect(response.body.profile).toHaveProperty('fullName');
    expect(response.body.profile).toHaveProperty('gender');
    expect(response.body.profile).toHaveProperty('universityName');

    expect(response.body.message).toBe('Registration successful');
    expect(response.body.auth.email).toBe('refactor@example.com');
  });

  test('POST /api/auth/login response payload matches contract LoginResponse schema', async () => {
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

    // Validate contract structure for LoginResponse
    expect(response.body).toHaveProperty('message');
    expect(response.body).toHaveProperty('accessToken');
    expect(response.body).not.toHaveProperty('refreshToken');
    expect(response.body).not.toHaveProperty('user');
  });
});

