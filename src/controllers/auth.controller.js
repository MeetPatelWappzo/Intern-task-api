const User = require('../models/user.model');
const RefreshToken = require('../models/token.model');
const jwt = require('jsonwebtoken');

/**
 * Generate a short-lived JWT Access Token
 * @param {object} user - Mongoose User Instance
 * @returns {string} - Signed JWT Token
 */
const generateAccessToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email },
    process.env.JWT_ACCESS_SECRET || 'fallback_access_secret_123',
    { expiresIn: '15m' }
  );
};

/**
 * Generate a long-lived JWT Refresh Token
 * @param {object} user - Mongoose User Instance
 * @returns {string} - Signed JWT Token
 */
const generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user._id },
    process.env.JWT_REFRESH_SECRET || 'fallback_refresh_secret_321',
    { expiresIn: '7d' }
  );
};

/**
 * @swagger
 * /api/auth/signup:
 *   post:
 *     summary: Register a new user
 *     description: Validates user input, hashes the password, and creates a user record in the database.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - name
 *               - gender
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 minLength: 8
 *               name:
 *                 type: string
 *               gender:
 *                 type: string
 *                 enum: [male, female, other]
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Input validation failed or field missing
 *       409:
 *         description: Email already in use
 *       500:
 *         description: Server error
 */
const signup = async (req, res, next) => {
  try {
    const { name, email, password, gender } = req.body;

    // 1. Validate mandatory fields
    if (!name || !email || !password || !gender) {
      return res.status(400).json({ error: 'All fields (name, email, password, gender) are required' });
    }

    // 2. Check password length
    if (password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters long' });
    }

    // 3. Validate gender value
    if (!['male', 'female', 'other'].includes(gender)) {
      return res.status(400).json({ error: 'Gender must be male, female, or other' });
    }

    // 4. Validate email format
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Please enter a valid email address' });
    }

    // 5. Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: 'Email is already registered' });
    }

    // 6. Create and save new user (password is automatically hashed via pre-save hook)
    const user = new User({ name, email, password, gender });
    await user.save();

    return res.status(201).json({
      message: 'Registration successful',
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        gender: user.gender
      }
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Log in user and generate credentials
 *     description: Verifies matching email and password, generates tokens, and registers active refresh token.
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
 *         description: Login successful, tokens returned
 *       400:
 *         description: Missing credentials
 *       401:
 *         description: Invalid email or password
 *       500:
 *         description: Server error
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // 1. Validate mandatory fields
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // 2. Locate user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // 3. Verify password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // 4. Generate tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // 5. Store refresh token in database with expiry (7 days)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    // Remove any previously stored refresh tokens for this user if desired (optional session consolidation)
    // For single-session, we can clear all. For multi-session, we keep. We keep multi-session here.
    const tokenRecord = new RefreshToken({
      token: refreshToken,
      user: user._id,
      expiresAt: expiresAt
    });
    await tokenRecord.save();

    return res.status(200).json({
      message: 'Login successful',
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        email: user.email,
        name: user.name
      }
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Log out user and invalidate session
 *     description: Revokes the provided long-lived refresh token in the database.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: Logout completed successfully
 *       400:
 *         description: Refresh token missing
 *       401:
 *         description: Refresh token not found
 *       500:
 *         description: Server error
 */
const logout = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ error: 'Refresh token is required' });
    }

    // Find and delete the matching token record
    const deletedToken = await RefreshToken.findOneAndDelete({ token: refreshToken });
    
    if (!deletedToken) {
      return res.status(401).json({ error: 'Session not found or already logged out' });
    }

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
