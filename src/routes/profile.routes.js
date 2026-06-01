const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/auth.middleware');
const upload = require('../middleware/upload.middleware');
const { getProfile, updateProfile } = require('../controllers/profile.controller');

/**
 * @swagger
 * tags:
 *   name: Profile
 *   description: User profile retrieval and update endpoints (JWT protected)
 */

/**
 * @swagger
 * /api/profile:
 *   get:
 *     tags: [Profile]
 *     summary: Get the logged-in user's profile
 *     description: Fetches the Profile document linked to the authenticated user's authId.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Profile'
 *       401:
 *         description: Missing or invalid JWT token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Profile not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/', verifyToken, getProfile);

/**
 * @swagger
 * /api/profile:
 *   patch:
 *     tags: [Profile]
 *     summary: Update profile fields and/or avatar image
 *     description: >
 *       Accepts multipart/form-data. All text fields are optional.
 *       If `profileImage` is provided it must be a JPEG or PNG ≤ 2 MB — it will be
 *       uploaded to Cloudinary and the resulting URL stored in `profileUrl`.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: false
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               profileImage:
 *                 type: string
 *                 format: binary
 *                 description: Avatar image (jpg/jpeg/png, max 2 MB)
 *               fullName:
 *                 type: string
 *               gender:
 *                 type: string
 *                 enum: [male, female, other]
 *               address:
 *                 type: string
 *               universityName:
 *                 type: string
 *               city:
 *                 type: string
 *               guardianName:
 *                 type: string
 *               guardianPhoneNumber:
 *                 type: string
 *               personalMobileNumber:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Profile'
 *       400:
 *         description: File too large, invalid type, or validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Missing or invalid JWT token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Profile not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.patch(
  '/',
  verifyToken,
  (req, res, next) => {
    // Intercept Multer upload exceptions (e.g. limit violations, mime restrictions)
    upload.single('profileImage')(req, res, (err) => {
      if (err) {
        return res.status(400).json({ error: err.message });
      }
      next();
    });
  },
  updateProfile
);

module.exports = router;
