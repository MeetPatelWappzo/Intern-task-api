const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/auth.middleware');
const upload = require('../middleware/upload.middleware');
const { uploadFile, deleteFile } = require('../controllers/file.controller');

/**
 * @swagger
 * tags:
 *   name: Files
 *   description: File Management endpoints (JWT protected)
 */

/**
 * @swagger
 * /api/files/upload:
 *   post:
 *     tags: [Files]
 *     summary: Upload a single image file
 *     description: >
 *       Accepts a single image upload in the `image` form field.
 *       The file must be JPEG or PNG and must not exceed 2MB.
 *       Returns the secure HTTPS URL and Cloudinary public ID.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - image
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: The JPEG or PNG image file to upload (max 2MB)
 *     responses:
 *       200:
 *         description: File uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 secure_url:
 *                   type: string
 *                 public_id:
 *                   type: string
 *       400:
 *         description: Validation error or size limit violation
 *       401:
 *         description: Missing or invalid token
 *       500:
 *         description: Cloudinary upload failure or internal server error
 */
router.post(
  '/upload',
  verifyToken,
  (req, res, next) => {
    upload.single('image')(req, res, (err) => {
      if (err) {
        return res.status(400).json({ error: err.message });
      }
      next();
    });
  },
  uploadFile
);

/**
 * @swagger
 * /api/files/delete:
 *   delete:
 *     tags: [Files]
 *     summary: Delete an uploaded image asset
 *     description: Deletes an asset permanently from Cloudinary using its unique `public_id`.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - public_id
 *             properties:
 *               public_id:
 *                 type: string
 *                 example: profile_pictures/abc
 *     responses:
 *       200:
 *         description: File deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       400:
 *         description: Missing public_id
 *       401:
 *         description: Missing or invalid token
 *       500:
 *         description: Cloudinary deletion failure or internal server error
 */
router.delete('/delete', verifyToken, deleteFile);

module.exports = router;
