const request = require('supertest');
const app = require('../../src/app');
const Task = require('../../src/models/task.model');
const jwt = require('jsonwebtoken');

jest.mock('../../src/models/task.model');

describe('Task CRUD Integration Tests', () => {
  let validToken;
  const mockAuthId = 'mock_auth_id_123';

  beforeAll(() => {
    const jwtSecret = process.env.JWT_SECRET || 'fallback_signature_secret_key_123';
    validToken = 'Bearer ' + jwt.sign({ id: mockAuthId, email: 'refactor@example.com' }, jwtSecret);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/tasks', () => {
    test('should create a new task successfully', async () => {
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
      expect(response.body).toEqual({
        id: 'mock_task_id_777',
        authId: mockAuthId,
        title: 'Draft Spec',
        description: 'Establish Task CRUD spec details',
        priority: 'high',
        status: 'pending'
      });
    });

    test('should reject creation if title is missing', async () => {
      const response = await request(app)
        .post('/api/tasks')
        .set('Authorization', validToken)
        .send({
          description: 'Establish Task CRUD spec details'
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('Title is required');
    });
  });

  describe('GET /api/tasks', () => {
    test('should retrieve tasks strictly owned by the authenticated user', async () => {
      const mockTasks = [
        {
          _id: 'mock_task_id_1',
          title: 'Task One',
          description: 'Description One',
          priority: 'medium',
          status: 'pending',
          authId: mockAuthId
        },
        {
          _id: 'mock_task_id_2',
          title: 'Task Two',
          description: 'Description Two',
          priority: 'high',
          status: 'in-progress',
          authId: mockAuthId
        }
      ];

      Task.find.mockResolvedValue(mockTasks);

      const response = await request(app)
        .get('/api/tasks')
        .set('Authorization', validToken);

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
      expect(response.body[0].title).toBe('Task One');
      expect(Task.find).toHaveBeenCalledWith({ authId: mockAuthId });
    });

    test('should filter user tasks by priority query parameter', async () => {
      Task.find.mockResolvedValue([]);

      const response = await request(app)
        .get('/api/tasks?priority=high')
        .set('Authorization', validToken);

      expect(response.status).toBe(200);
      expect(Task.find).toHaveBeenCalledWith({ authId: mockAuthId, priority: 'high' });
    });
  });

  describe('PATCH /api/tasks/:id', () => {
    test('should update general details successfully while strictly ignoring title overrides', async () => {
      const mockTask = {
        _id: 'mock_task_id_1',
        title: 'Original Title',
        description: 'Original Description',
        priority: 'medium',
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
          priority: 'high',
          title: 'Malicious Hack attempt' // Immutable Title!
        });

      expect(response.status).toBe(200);
      expect(response.body.description).toBe('Updated Description');
      expect(response.body.priority).toBe('high');
      expect(response.body.title).toBe('Original Title'); // Kept original title!
      expect(mockTask.save).toHaveBeenCalled();
    });

    test('should return 404 if task to update is not found or owned by user', async () => {
      Task.findOne.mockResolvedValue(null);

      const response = await request(app)
        .patch('/api/tasks/foreign_task_id')
        .set('Authorization', validToken)
        .send({
          description: 'Updated Description'
        });

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Task not found');
    });
  });

  describe('PATCH /api/tasks/:id/status', () => {
    test('should update status successfully', async () => {
      const mockTask = {
        _id: 'mock_task_id_1',
        title: 'Task Title',
        description: 'Task Description',
        priority: 'medium',
        status: 'pending',
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
          status: 'in-progress'
        });

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('in-progress');
      expect(mockTask.save).toHaveBeenCalled();
    });

    test('should reject invalid status updates', async () => {
      const mockTask = {
        _id: 'mock_task_id_1',
        status: 'pending',
        authId: mockAuthId,
        save: jest.fn().mockImplementation(function () {
          if (this.status !== 'pending' && this.status !== 'in-progress' && this.status !== 'completed') {
            const err = new Error('ValidationError: status invalid');
            err.name = 'ValidationError';
            return Promise.reject(err);
          }
          return Promise.resolve(this);
        })
      };
      
      Task.findOne.mockResolvedValue(mockTask);

      const response = await request(app)
        .patch('/api/tasks/mock_task_id_1/status')
        .set('Authorization', validToken)
        .send({
          status: 'invalid-status-value'
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('status');
    });
  });
});
