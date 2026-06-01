const fs = require('fs');
const path = require('path');
const request = require('supertest');
const app = require('../../src/app');
const User = require('../../src/models/user.model');

jest.mock('../../src/models/user.model');

describe('Auth OpenAPI Contract Verification Tests', () => {
  let openApiSpec;

  beforeAll(() => {
    const specPath = path.join(__dirname, '../../specs/001-user-auth/contracts/auth.openapi.json');
    const specContent = fs.readFileSync(specPath, 'utf8');
    openApiSpec = JSON.parse(specContent);
  });

  test('OpenAPI contract schema file should load successfully', () => {
    expect(openApiSpec).toBeDefined();
    expect(openApiSpec.openapi).toBe('3.0.0');
    expect(openApiSpec.paths).toHaveProperty('/auth/signup');
    expect(openApiSpec.paths).toHaveProperty('/auth/login');
    expect(openApiSpec.paths).toHaveProperty('/auth/logout');
  });

  test('POST /api/auth/signup response payload matches contract SignupResponse schema', async () => {
    User.findOne.mockResolvedValue(null);
    User.mockImplementation(function (data) {
      const instance = {
        _id: '65b5974c5d5e5e4078cb8db2',
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
        name: 'John Doe',
        email: 'user@example.com',
        password: 'SecurePassword123!',
        gender: 'male'
      });

    expect(response.status).toBe(201);
    
    // Validate contract structure for SignupResponse
    const responseSchema = openApiSpec.components.schemas.SignupResponse;
    expect(response.body).toHaveProperty('message');
    expect(response.body).toHaveProperty('user');
    expect(response.body.user).toHaveProperty('id');
    expect(response.body.user).toHaveProperty('email');
    expect(response.body.user).toHaveProperty('name');
    expect(response.body.user).toHaveProperty('gender');

    expect(response.body.message).toBe('Registration successful');
    expect(response.body.user.email).toBe('user@example.com');
  });

  test('POST /api/auth/login response payload matches contract LoginResponse schema', async () => {
    const mockUser = {
      _id: '65b5974c5d5e5e4078cb8db2',
      email: 'user@example.com',
      name: 'John Doe',
      comparePassword: jest.fn().mockResolvedValue(true),
      save: jest.fn().mockResolvedValue(true)
    };
    
    User.findOne.mockResolvedValue(mockUser);

    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'user@example.com',
        password: 'SecurePassword123!'
      });

    expect(response.status).toBe(200);

    // Validate contract structure for LoginResponse
    const responseSchema = openApiSpec.components.schemas.LoginResponse;
    expect(response.body).toHaveProperty('message');
    expect(response.body).toHaveProperty('accessToken');
    expect(response.body).toHaveProperty('refreshToken');
    expect(response.body).toHaveProperty('user');
    expect(response.body.user).toHaveProperty('id');
    expect(response.body.user).toHaveProperty('email');
    expect(response.body.user).toHaveProperty('name');
  });
});
