const Task = require('../models/task.model');

/**
 * Helper to map mongoose Task document to OpenAPI response structure
 */
const mapTaskResponse = (task) => {
  return {
    id: task._id.toString(),
    authId: task.authId.toString(),
    title: task.title,
    description: task.description,
    priority: task.priority,
    status: task.status
  };
};

/**
 * POST /api/tasks
 * Create a new task linked to current authenticated user
 */
const createTask = async (req, res, next) => {
  try {
    const { title, description, priority } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    const task = new Task({
      title,
      description,
      priority,
      authId: req.user.id
    });

    await task.save();
    return res.status(201).json(mapTaskResponse(task));
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }
    next(error);
  }
};

/**
 * GET /api/tasks
 * Fetch tasks strictly belonging to current authenticated user
 */
const getTasks = async (req, res, next) => {
  try {
    const query = { authId: req.user.id };

    if (req.query.priority) {
      query.priority = req.query.priority;
    }

    const tasks = await Task.find(query);
    return res.status(200).json(tasks.map(mapTaskResponse));
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /api/tasks/:id
 * Update task details with immutable title check
 */
const updateTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const task = await Task.findOne({ _id: id, authId: req.user.id });

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Intercept payload and strictly ignore/exclude updates to the title field
    const { title, status, ...allowedUpdates } = req.body;

    // Apply allowed textual modifications (e.g. description, priority)
    Object.keys(allowedUpdates).forEach((key) => {
      if (allowedUpdates[key] !== undefined) {
        task[key] = allowedUpdates[key];
      }
    });

    await task.save();
    return res.status(200).json(mapTaskResponse(task));
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }
    next(error);
  }
};

/**
 * PATCH /api/tasks/:id/status
 * Dedicated endpoint updating strictly the execution state (status) of a task
 */
const updateTaskStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }

    const task = await Task.findOne({ _id: id, authId: req.user.id });

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Assign status value (validation occurs in save hook)
    task.status = status;
    await task.save();

    return res.status(200).json(mapTaskResponse(task));
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }
    next(error);
  }
};
/**
 * DELETE /api/tasks/:id
 * Delete a specific task
 */
const deleteTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const task = await Task.findOneAndDelete({ _id: id, authId: req.user.id });

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    return res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createTask,
  getTasks,
  updateTask,
  updateTaskStatus,
  deleteTask
};
