const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Intern Task API',
      version: '1.0.0',
      description:
        'REST API for user authentication, profile management, and task tracking. Built with Node.js, Express, MongoDB, and Cloudinary.'
    },
    servers: [
      {
        url: process.env.APP_URL,
        description: process.env.NODE_ENV === 'production' ? 'Production Server' : 'Local Development Server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Paste the accessToken returned from /api/auth/login'
        }
      },
      schemas: {
        // ── Auth ──────────────────────────────────────────────
        SignupRequest: {
          type: 'object',
          required: ['email', 'password', 'fullName', 'gender'],
          properties: {
            email: { type: 'string', format: 'email', example: 'john@example.com' },
            password: { type: 'string', minLength: 8, example: 'Secret123' },
            fullName: { type: 'string', example: 'John Doe' },
            gender: { type: 'string', enum: ['male', 'female', 'other'], example: 'male' }
          }
        },
        LoginRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', format: 'email', example: 'john@example.com' },
            password: { type: 'string', example: 'Secret123' }
          }
        },
        AuthResponse: {
          type: 'object',
          properties: {
            message: { type: 'string' },
            accessToken: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' }
          }
        },
        // ── Profile ───────────────────────────────────────────
        Profile: {
          type: 'object',
          properties: {
            id: { type: 'string', example: '6659f2b3e4b0c1d2e3f4a5b6' },
            authId: { type: 'string', example: '6659f2b3e4b0c1d2e3f4a5b7' },
            fullName: { type: 'string', example: 'John Doe' },
            gender: { type: 'string', enum: ['male', 'female', 'other'] },
            profileUrl: { type: 'string', nullable: true, example: 'https://res.cloudinary.com/...' },
            address: { type: 'string', nullable: true },
            universityName: { type: 'string', nullable: true },
            city: { type: 'string', nullable: true },
            guardianName: { type: 'string', nullable: true },
            guardianPhoneNumber: { type: 'string', nullable: true },
            personalMobileNumber: { type: 'string', nullable: true }
          }
        },
        // ── Task ──────────────────────────────────────────────
        Task: {
          type: 'object',
          properties: {
            id: { type: 'string', example: '6659f2b3e4b0c1d2e3f4a5b8' },
            authId: { type: 'string', example: '6659f2b3e4b0c1d2e3f4a5b7' },
            title: { type: 'string', example: 'Build API' },
            description: { type: 'string', nullable: true },
            priority: { type: 'string', enum: ['epic', 'high', 'medium', 'low'], example: 'high' },
            status: { type: 'string', enum: ['pending', 'in-progress', 'completed'], example: 'pending' }
          }
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            error: { type: 'string', example: 'Something went wrong' }
          }
        }
      }
    }
  },
  // Scan all route and controller files for @swagger JSDoc blocks
  apis: [
    './src/routes/*.js',
    './src/controllers/*.js'
  ]
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
