const Auth = require('../models/auth.model');
const Profile = require('../models/profile.model');
const jwt = require('jsonwebtoken');

/**
 * Generate a stateless JWT Access Token
 * @param {object} auth - Mongoose Auth Instance
 * @returns {string} - Signed JWT Token
 */
const generateAccessToken = (auth) => {
  return jwt.sign(
    { id: auth._id, email: auth.email },
    process.env.JWT_SECRET || 'fallback_signature_secret_key_123',
    { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
  );
};

/**
 * @swagger
 * /api/auth/signup:
 *   post:
 *     summary: Register a new account (split models)
 *     description: Creates an Auth document and immediately saves a linked default Profile document.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - fullName
 *               - gender
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 minLength: 8
 *               fullName:
 *                 type: string
 *               gender:
 *                 type: string
 *                 enum: [male, female, other]
 *     responses:
 *       201:
 *         description: Account created successfully
 *       400:
 *         description: Validation failed
 *       409:
 *         description: Email already registered
 *       500:
 *         description: Server error
 */
const signup = async (req, res, next) => {
  let createdAuth = null;
  try {
    const { email, password, fullName, gender } = req.body;

    // 1. Validate mandatory fields
    if (!email || !password || !fullName || !gender) {
      return res.status(400).json({ error: 'All fields (email, password, fullName, gender) are required' });
    }

    // 2. Validate password complexity
    if (password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters long' });
    }

    // 3. Validate gender enum
    if (!['male', 'female', 'other'].includes(gender)) {
      return res.status(400).json({ error: 'Gender must be male, female, or other' });
    }

    // 4. Validate email format
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Please enter a valid email address' });
    }

    // 5. Check if email is already registered
    const existingAuth = await Auth.findOne({ email });
    if (existingAuth) {
      return res.status(409).json({ error: 'Email is already registered' });
    }

    // 6. Create and save Auth record (password auto-hashed pre-save)
    createdAuth = new Auth({ email, password });
    await createdAuth.save();

    // 7. Immediately create and link default Profile record
    try {
      const profile = new Profile({
        authId: createdAuth._id,
        fullName,
        gender
      });
      await profile.save();

      return res.status(201).json({
        message: 'Registration successful',
        auth: {
          id: createdAuth._id,
          email: createdAuth.email
        },
        profile: {
          fullName: profile.fullName,
          gender: profile.gender,
          universityName: profile.universityName
        }
      });
    } catch (profileError) {
      // Rollback Auth document if Profile creation fails to prevent orphaned auth documents
      if (createdAuth && createdAuth._id) {
        await Auth.findByIdAndDelete(createdAuth._id);
      }
      throw profileError;
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Log in and get single access token
 *     description: Validates credentials, returning ONLY the stateless accessToken in the response payload.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successfully authenticated
 *       400:
 *         description: Missing credentials
 *       401:
 *         description: Invalid credentials
 *       500:
 *         description: Server error
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // 1. Resolve Auth record
    const auth = await Auth.findOne({ email });
    if (!auth) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // 2. Verify password
    const isMatch = await auth.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // 3. Generate stateless access token
    const accessToken = generateAccessToken(auth);

    return res.status(200).json({
      message: 'Login successful',
      accessToken
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Log out user statelessly
 *     description: Statelessly invalidates session by returning success.
 *     responses:
 *       200:
 *         description: Logout successful
 *       500:
 *         description: Server error
 */
const logout = async (req, res, next) => {
  try {
    return res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = {
  signup,
  login,
  logout
};
