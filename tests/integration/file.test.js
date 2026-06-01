const request = require('supertest');
const app = require('../../src/app');
const jwt = require('jsonwebtoken');
const cloudinaryService = require('../../src/services/cloudinary.service');
const cloudinary = require('../../src/config/cloudinary');

jest.mock('../../src/services/cloudinary.service');
jest.mock('../../src/config/cloudinary', () => ({
  uploader: {
    destroy: jest.fn()
  }
}));

describe('File Management API Integration Tests', () => {
  let validToken;
  const mockAuthId = 'mock_auth_id_123';

  beforeAll(() => {
    const jwtSecret = process.env.JWT_SECRET || 'fallback_signature_secret_key_123';
    validToken = 'Bearer ' + jwt.sign({ id: mockAuthId, email: 'filemgmt@example.com' }, jwtSecret);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/files/upload', () => {
    test('should successfully upload a single image and return secure_url and public_id', async () => {
      cloudinaryService.uploadImageBuffer.mockResolvedValue({
        secure_url: 'https://res.cloudinary.com/de8gnyqey/image/upload/v1726000000/profile_pictures/abc.png',
        public_id: 'profile_pictures/abc'
      });

      const response = await request(app)
        .post('/api/files/upload')
        .set('Authorization', validToken)
        .attach('image', Buffer.from('mock-image-bytes'), 'test_image.png');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        message: 'File uploaded successfully',
        secure_url: 'https://res.cloudinary.com/de8gnyqey/image/upload/v1726000000/profile_pictures/abc.png',
        public_id: 'profile_pictures/abc'
      });
      expect(cloudinaryService.uploadImageBuffer).toHaveBeenCalled();
    });

    test('should return 401 if request is unauthorized (no JWT token)', async () => {
      const response = await request(app)
        .post('/api/files/upload')
        .attach('image', Buffer.from('mock-image-bytes'), 'test_image.png');

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error');
    });

    test('should return 400 if no file is attached in the request', async () => {
      const response = await request(app)
        .post('/api/files/upload')
        .set('Authorization', validToken);

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('Please attach an image');
    });

    test('should reject files exceeding the 2MB size limit', async () => {
      const largeBuffer = Buffer.alloc(2 * 1024 * 1024 + 100);

      const response = await request(app)
        .post('/api/files/upload')
        .set('Authorization', validToken)
        .attach('image', largeBuffer, 'large_image.png');

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('File too large');
    });

    test('should reject unsupported file types (non-images)', async () => {
      const response = await request(app)
        .post('/api/files/upload')
        .set('Authorization', validToken)
        .attach('image', Buffer.from('mock-text-bytes'), 'doc.txt');

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('Only .jpg, .jpeg, and .png');
    });
  });

  describe('DELETE /api/files/delete', () => {
    test('should successfully delete an asset from Cloudinary using public_id', async () => {
      cloudinaryService.deleteImage.mockResolvedValue({ result: 'ok' });

      const response = await request(app)
        .delete('/api/files/delete')
        .set('Authorization', validToken)
        .send({ public_id: 'profile_pictures/abc' });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        message: 'File deleted successfully from Cloudinary'
      });
      expect(cloudinaryService.deleteImage).toHaveBeenCalledWith('profile_pictures/abc');
    });

    test('should return 401 if request is unauthorized (no JWT token)', async () => {
      const response = await request(app)
        .delete('/api/files/delete')
        .send({ public_id: 'profile_pictures/abc' });

      expect(response.status).toBe(401);
    });

    test('should return 400 if public_id is missing in request body', async () => {
      const response = await request(app)
        .delete('/api/files/delete')
        .set('Authorization', validToken)
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('public_id is required');
    });
  });
});
