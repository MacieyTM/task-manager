const { createTaskExportStream } = require('../streams/taskExportStream');

const { streamToResponse } = require('../streams/streamUtils');

const taskService = require('../services/taskService');

const { sendJson, sendNoContent } = require('../utils/http');

const { badRequest } = require('../utils/errors');

const {
  validateCreateTask,
  validateUpdateTask,
} = require('../validators/taskValidator');

async function exportTasks(request, response, userId) {
  const tasks = await taskService.getAllTasks({
    userId,
  });

  const stream = createTaskExportStream(tasks);

  await streamToResponse(stream, response);
}

async function getAllTasks(request, response, query, userId) {
  const filters = {
    userId,
  };

  if (query.completed !== undefined) {
    if (query.completed !== 'true' && query.completed !== 'false') {
      throw badRequest(
        'completed must be true or false',
        'INVALID_COMPLETED_FILTER',
      );
    }

    filters.completed = query.completed === 'true';
  }

  if (query.search) {
    filters.search = query.search;
  }

  const tasks = await taskService.getAllTasks(filters);

  sendJson(response, 200, {
    data: tasks,
  });
}

async function getTaskById(request, response, id, userId) {
  if (!Number.isInteger(id) || id <= 0) {
    throw badRequest('Task id must be a positive integer', 'INVALID_TASK_ID');
  }

  const task = await taskService.getTaskById(id, userId);

  if (!task) {
    sendJson(response, 404, {
      error: {
        code: 'TASK_NOT_FOUND',
        message: 'Task not found',
      },
    });

    return;
  }

  sendJson(response, 200, {
    data: task,
  });
}

async function createTask(request, response, body, userId) {
  validateCreateTask(body);

  const task = await taskService.createTask({
    ...body,
    userId,
  });

  sendJson(response, 201, {
    data: task,
  });
}

async function updateTask(request, response, id, body, userId) {
  if (!Number.isInteger(id) || id <= 0) {
    throw badRequest('Task id must be a positive integer', 'INVALID_TASK_ID');
  }

  validateUpdateTask(body);

  const task = await taskService.updateTask(id, userId, body);

  if (!task) {
    sendJson(response, 404, {
      error: {
        code: 'TASK_NOT_FOUND',
        message: 'Task not found',
      },
    });

    return;
  }

  sendJson(response, 200, {
    data: task,
  });
}

async function deleteTask(request, response, id, userId) {
  if (!Number.isInteger(id) || id <= 0) {
    throw badRequest('Task id must be a positive integer', 'INVALID_TASK_ID');
  }

  const task = await taskService.deleteTask(id, userId);

  if (!task) {
    sendJson(response, 404, {
      error: {
        code: 'TASK_NOT_FOUND',
        message: 'Task not found',
      },
    });

    return;
  }

  sendNoContent(response);
}

async function getTaskStatistics(request, response, userId) {
  const statistics = await taskService.getTaskStatistics(userId);

  sendJson(response, 200, {
    data: statistics,
  });
}

module.exports = {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  getTaskStatistics,
  exportTasks,
};
