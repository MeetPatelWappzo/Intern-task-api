const express = require('express');
const router = express.Router();
const { signup, login, logout } = require('../controllers/auth.controller');

/**
 * @swagger
 * /api/auth/signup:
 *   post:
 *     description: Register a new user
 */
router.post('/signup', signup);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     description: Authenticate and get tokens
 */
router.post('/login', login);

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     description: Invalidate active refresh token
 */
router.post('/logout', logout);

module.exports = router;
