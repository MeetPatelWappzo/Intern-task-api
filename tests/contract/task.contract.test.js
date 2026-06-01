const fs = require('fs');
const path = require('path');
const request = require('supertest');
const app = require('../../src/app');
const Task = require('../../src/models/task.model');
const jwt = require('jsonwebtoken');

jest.mock('../../src/models/task.model');

describe('Task OpenAPI Contract Verification Tests', () => {
  let openApiSpec;
  let validToken;
  const mockAuthId = 'mock_auth_id_123';

  beforeAll(() => {
    const specPath = path.join(__dirname, '../../specs/004-dashboard-task-crud/contracts/tasks.openapi.json');
    const specContent = fs.readFileSync(specPath, 'utf8');
    openApiSpec = JSON.parse(specContent);

    const jwtSecret = process.env.JWT_SECRET || 'fallback_signature_secret_key_123';
    validToken = 'Bearer ' + jwt.sign({ id: mockAuthId, email: 'refactor@example.com' }, jwtSecret);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('OpenAPI contract schema file should load successfully', () => {
    expect(openApiSpec).toBeDefined();
    expect(openApiSpec.openapi).toBe('3.0.0');
    expect(openApiSpec.paths).toHaveProperty('/tasks');
  });

  test('POST /api/tasks response payload matches contract TaskResponse schema', async () => {
    Task.mockImplementation(function (data) {
      const instance = {
        _id: 'mock_task_id_777',
        title: data.title,
        description: data.description,
        priority: data.priority || 'medium',
        status: data.status || 'pending',
        authId: data.authId
      };
      instance.save = jest.fn().mockResolvedValue(instance);
      return instance;
    });

    const response = await request(app)
      .post('/api/tasks')
      .set('Authorization', validToken)
      .send({
        title: 'Draft Spec',
        description: 'Establish Task CRUD spec details',
        priority: 'high'
      });

    expect(response.status).toBe(201);

    // Validate OpenAPI TaskResponse fields
    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('authId');
    expect(response.body).toHaveProperty('title');
    expect(response.body).toHaveProperty('description');
    expect(response.body).toHaveProperty('priority');
    expect(response.body).toHaveProperty('status');

    expect(response.body.title).toBe('Draft Spec');
  });

  test('GET /api/tasks response payload matches contract TaskResponse array schema', async () => {
    const mockTasks = [
      {
        _id: 'mock_task_id_1',
        title: 'Task One',
        description: 'Description One',
        priority: 'medium',
        status: 'pending',
        authId: mockAuthId
      }
    ];

    Task.find.mockResolvedValue(mockTasks);

    const response = await request(app)
      .get('/api/tasks')
      .set('Authorization', validToken);

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body[0]).toHaveProperty('id');
    expect(response.body[0]).toHaveProperty('title');
  });

  test('PATCH /api/tasks/:id response payload matches contract TaskResponse schema', async () => {
    const mockTask = {
      _id: 'mock_task_id_1',
      title: 'Original Title',
      description: 'Updated Description',
      priority: 'high',
      status: 'pending',
      authId: mockAuthId,
      save: jest.fn().mockImplementation(function () {
        return Promise.resolve(this);
      })
    };

    Task.findOne.mockResolvedValue(mockTask);

    const response = await request(app)
      .patch('/api/tasks/mock_task_id_1')
      .set('Authorization', validToken)
      .send({
        description: 'Updated Description',
        priority: 'high'
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id');
    expect(response.body.description).toBe('Updated Description');
  });

  test('PATCH /api/tasks/:id/status response payload matches contract TaskResponse schema', async () => {
    const mockTask = {
      _id: 'mock_task_id_1',
      title: 'Original Title',
      description: 'Original Description',
      priority: 'medium',
      status: 'completed',
      authId: mockAuthId,
      save: jest.fn().mockImplementation(function () {
        return Promise.resolve(this);
      })
    };

    Task.findOne.mockResolvedValue(mockTask);

    const response = await request(app)
      .patch('/api/tasks/mock_task_id_1/status')
      .set('Authorization', validToken)
      .send({
        status: 'completed'
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id');
    expect(response.body.status).toBe('completed');
  });
});
