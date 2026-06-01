const verifyToken = require('../../src/middleware/auth.middleware');
const jwt = require('jsonwebtoken');

jest.mock('jsonwebtoken');

describe('Auth Middleware Unit Tests', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      headers: {}
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  test('should call next() if a valid Bearer token is provided', () => {
    req.headers['authorization'] = 'Bearer valid_token_123';
    const decodedUser = { id: 'user_id_123', email: 'test@example.com' };
    
    jwt.verify.mockReturnValue(decodedUser);

    verifyToken(req, res, next);

    expect(jwt.verify).toHaveBeenCalledWith('valid_token_123', expect.any(String));
    expect(req.user).toEqual(decodedUser);
    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  test('should return 401 if Authorization header is missing', () => {
    verifyToken(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Access denied. No token provided.' });
    expect(next).not.toHaveBeenCalled();
  });

  test('should return 401 if Authorization header is not in Bearer format', () => {
    req.headers['authorization'] = 'Basic credentials_123';

    verifyToken(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Invalid token format. Expecting: Bearer <token>' });
    expect(next).not.toHaveBeenCalled();
  });

  test('should return 401 if token is empty string', () => {
    req.headers['authorization'] = 'Bearer ';

    verifyToken(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Access denied. Token is empty.' });
    expect(next).not.toHaveBeenCalled();
  });

  test('should return 401 if token signature is invalid', () => {
    req.headers['authorization'] = 'Bearer invalid_signature_token';
    jwt.verify.mockImplementation(() => {
      throw new Error('Invalid signature');
    });

    verifyToken(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Authentication failed. Invalid token.' });
    expect(next).not.toHaveBeenCalled();
  });

  test('should return 401 if token has expired', () => {
    req.headers['authorization'] = 'Bearer expired_token';
    jwt.verify.mockImplementation(() => {
      const error = new Error('jwt expired');
      error.name = 'TokenExpiredError';
      throw error;
    });

    verifyToken(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Authentication failed. Token has expired.' });
    expect(next).not.toHaveBeenCalled();
  });
});
