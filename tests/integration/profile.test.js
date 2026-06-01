const request = require('supertest');
const app = require('../../src/app');
const Profile = require('../../src/models/profile.model');
const jwt = require('jsonwebtoken');
const cloudinaryService = require('../../src/services/cloudinary.service');

jest.mock('../../src/models/profile.model');
jest.mock('../../src/services/cloudinary.service');

describe('Profile API Integration Tests', () => {
  let validToken;
  const mockAuthId = 'mock_auth_id_123';

  beforeAll(() => {
    const jwtSecret = process.env.JWT_SECRET || 'fallback_signature_secret_key_123';
    validToken = 'Bearer ' + jwt.sign({ id: mockAuthId, email: 'refactor@example.com' }, jwtSecret);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/profile', () => {
    test('should fetch and return linked profile for authenticated user', async () => {
      const mockProfile = {
        _id: 'mock_profile_id_999',
        authId: mockAuthId,
        fullName: 'Jane Doe',
        gender: 'female',
        profileUrl: 'http://cloudinary.com/avatar.png',
        universityName: 'Stanford University',
        address: '123 Main St'
      };

      Profile.findOne.mockResolvedValue(mockProfile);

      const response = await request(app)
        .get('/api/profile')
        .set('Authorization', validToken);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        id: 'mock_profile_id_999',
        authId: mockAuthId,
        fullName: 'Jane Doe',
        gender: 'female',
        profileUrl: 'http://cloudinary.com/avatar.png',
        universityName: 'Stanford University',
        address: '123 Main St'
      });
      expect(Profile.findOne).toHaveBeenCalledWith({ authId: mockAuthId });
    });

    test('should return 401 if request is unauthorized (no JWT)', async () => {
      const response = await request(app).get('/api/profile');
      expect(response.status).toBe(401);
    });

    test('should return 404 if profile is not found', async () => {
      Profile.findOne.mockResolvedValue(null);

      const response = await request(app)
        .get('/api/profile')
        .set('Authorization', validToken);

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: 'Profile not found' });
    });
  });

  describe('PATCH /api/profile', () => {
    test('should update profile text fields successfully', async () => {
      const mockProfile = {
        _id: 'mock_profile_id_999',
        authId: mockAuthId,
        fullName: 'Original Name',
        gender: 'female',
        address: 'Old Address',
        save: jest.fn().mockImplementation(function() {
          return Promise.resolve(this);
        })
      };

      Profile.findOne.mockResolvedValue(mockProfile);

      const response = await request(app)
        .patch('/api/profile')
        .set('Authorization', validToken)
        .send({
          fullName: 'Updated Name',
          address: 'New Address'
        });

      expect(response.status).toBe(200);
      expect(response.body.fullName).toBe('Updated Name');
      expect(response.body.address).toBe('New Address');
      expect(mockProfile.save).toHaveBeenCalled();
    });

    test('should handle single image upload and update profileUrl', async () => {
      const mockProfile = {
        _id: 'mock_profile_id_999',
        authId: mockAuthId,
        fullName: 'Jane Doe',
        gender: 'female',
        profileUrl: null,
        save: jest.fn().mockImplementation(function() {
          return Promise.resolve(this);
        })
      };

      Profile.findOne.mockResolvedValue(mockProfile);
      cloudinaryService.uploadImageBuffer.mockResolvedValue({
        secure_url: 'https://cloudinary.com/uploaded_avatar.png'
      });

      const response = await request(app)
        .patch('/api/profile')
        .set('Authorization', validToken)
        .attach('profileImage', Buffer.from('fake-image-bytes'), 'test_avatar.png');

      expect(response.status).toBe(200);
      expect(response.body.profileUrl).toBe('https://cloudinary.com/uploaded_avatar.png');
      expect(cloudinaryService.uploadImageBuffer).toHaveBeenCalled();
      expect(mockProfile.save).toHaveBeenCalled();
    });

    test('should reject profile image exceeding 2MB size limit', async () => {
      // Create a buffer larger than 2MB
      const largeBuffer = Buffer.alloc(2 * 1024 * 1024 + 100);

      const response = await request(app)
        .patch('/api/profile')
        .set('Authorization', validToken)
        .attach('profileImage', largeBuffer, 'huge_avatar.png');

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('File too large');
    });

    test('should reject unsupported file mime types', async () => {
      const response = await request(app)
        .patch('/api/profile')
        .set('Authorization', validToken)
        .attach('profileImage', Buffer.from('fake-pdf-bytes'), 'doc.pdf');

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('Only .jpg, .jpeg, and .png');
    });
  });
});
