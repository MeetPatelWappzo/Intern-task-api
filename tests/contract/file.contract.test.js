const fs = require('fs');
const path = require('path');
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

describe('File Management OpenAPI Contract Verification Tests', () => {
  let openApiSpec;
  let validToken;
  const mockAuthId = 'mock_auth_id_123';

  beforeAll(() => {
    const specPath = path.join(__dirname, '../../specs/005-file-management/contracts/openapi.json');
    const specContent = fs.readFileSync(specPath, 'utf8');
    openApiSpec = JSON.parse(specContent);

    const jwtSecret = process.env.JWT_SECRET || 'fallback_signature_secret_key_123';
    validToken = 'Bearer ' + jwt.sign({ id: mockAuthId, email: 'filemgmt@example.com' }, jwtSecret);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('OpenAPI contract schema file should load successfully', () => {
    expect(openApiSpec).toBeDefined();
    expect(openApiSpec.openapi).toBe('3.0.0');
    expect(openApiSpec.paths).toHaveProperty('/api/files/upload');
    expect(openApiSpec.paths).toHaveProperty('/api/files/delete');
  });

  test('POST /api/files/upload response matches upload schema', async () => {
    cloudinaryService.uploadImageBuffer.mockResolvedValue({
      secure_url: 'https://res.cloudinary.com/de8gnyqey/image/upload/v1726000000/profile_pictures/abc.png',
      public_id: 'profile_pictures/abc'
    });

    const response = await request(app)
      .post('/api/files/upload')
      .set('Authorization', validToken)
      .attach('image', Buffer.from('mock-image-bytes'), 'test_image.png');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message');
    expect(response.body).toHaveProperty('secure_url');
    expect(response.body).toHaveProperty('public_id');
    expect(response.body.secure_url).toBe('https://res.cloudinary.com/de8gnyqey/image/upload/v1726000000/profile_pictures/abc.png');
    expect(response.body.public_id).toBe('profile_pictures/abc');
  });

  test('DELETE /api/files/delete response matches delete schema', async () => {
    cloudinary.uploader.destroy.mockResolvedValue({ result: 'ok' });

    const response = await request(app)
      .delete('/api/files/delete')
      .set('Authorization', validToken)
      .send({ public_id: 'profile_pictures/abc' });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toBe('File deleted successfully from Cloudinary');
  });
});
