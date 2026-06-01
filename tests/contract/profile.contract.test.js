const fs = require('fs');
const path = require('path');
const request = require('supertest');
const app = require('../../src/app');
const Profile = require('../../src/models/profile.model');
const jwt = require('jsonwebtoken');
const cloudinaryService = require('../../src/services/cloudinary.service');

jest.mock('../../src/models/profile.model');
jest.mock('../../src/services/cloudinary.service');

describe('Profile OpenAPI Contract Verification Tests', () => {
  let openApiSpec;
  let validToken;
  const mockAuthId = 'mock_auth_id_123';

  beforeAll(() => {
    const specPath = path.join(__dirname, '../../specs/003-user-profile-upload/contracts/profile.openapi.json');
    const specContent = fs.readFileSync(specPath, 'utf8');
    openApiSpec = JSON.parse(specContent);

    const jwtSecret = process.env.JWT_SECRET || 'fallback_signature_secret_key_123';
    validToken = 'Bearer ' + jwt.sign({ id: mockAuthId, email: 'refactor@example.com' }, jwtSecret);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('OpenAPI contract schema file should load successfully', () => {
    expect(openApiSpec).toBeDefined();
    expect(openApiSpec.openapi).toBe('3.0.0');
    expect(openApiSpec.paths).toHaveProperty('/profile');
  });

  test('GET /api/profile response payload matches contract ProfileResponse schema', async () => {
    const mockProfile = {
      _id: 'mock_profile_id_999',
      authId: mockAuthId,
      fullName: 'John Doe',
      gender: 'male',
      profileUrl: null,
      address: null,
      universityName: null,
      city: null,
      guardianName: null,
      guardianPhoneNumber: null,
      personalMobileNumber: null
    };

    Profile.findOne.mockResolvedValue(mockProfile);

    const response = await request(app)
      .get('/api/profile')
      .set('Authorization', validToken);

    expect(response.status).toBe(200);

    // Validate OpenAPI ProfileResponse keys
    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('authId');
    expect(response.body).toHaveProperty('fullName');
    expect(response.body).toHaveProperty('gender');
    expect(response.body).toHaveProperty('profileUrl');
    expect(response.body).toHaveProperty('address');
    expect(response.body).toHaveProperty('universityName');
    expect(response.body).toHaveProperty('city');
    expect(response.body).toHaveProperty('guardianName');
    expect(response.body).toHaveProperty('guardianPhoneNumber');
    expect(response.body).toHaveProperty('personalMobileNumber');

    expect(response.body.fullName).toBe('John Doe');
  });

  test('PATCH /api/profile response payload matches contract ProfileResponse schema', async () => {
    const mockProfile = {
      _id: 'mock_profile_id_999',
      authId: mockAuthId,
      fullName: 'Jane Updated',
      gender: 'female',
      profileUrl: 'https://cloudinary.com/avatar.png',
      address: 'New Address',
      universityName: 'Stanford University',
      city: null,
      guardianName: null,
      guardianPhoneNumber: null,
      personalMobileNumber: null,
      save: jest.fn().mockImplementation(function() {
        return Promise.resolve(this);
      })
    };

    Profile.findOne.mockResolvedValue(mockProfile);
    cloudinaryService.uploadImageBuffer.mockResolvedValue({
      secure_url: 'https://cloudinary.com/avatar.png'
    });

    const response = await request(app)
      .patch('/api/profile')
      .set('Authorization', validToken)
      .attach('profileImage', Buffer.from('fake-image-bytes'), 'avatar.png')
      .field('fullName', 'Jane Updated')
      .field('universityName', 'Stanford University')
      .field('address', 'New Address');

    expect(response.status).toBe(200);

    // Validate OpenAPI contract keys are present in response body
    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('authId');
    expect(response.body).toHaveProperty('fullName');
    expect(response.body).toHaveProperty('gender');
    expect(response.body).toHaveProperty('profileUrl');
    expect(response.body.fullName).toBe('Jane Updated');
    expect(response.body.profileUrl).toBe('https://cloudinary.com/avatar.png');
  });
});
