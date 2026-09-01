const taskRepository = require('../repositories/taskRepository');

const userRepository = require('../repositories/userRepository');

const delay = require('../utils/delay');

const { notFound } = require('../utils/errors');

const eventBus = require('../events');

async function getAllTasks(filters) {
  return taskRepository.findAll(filters);
}

async function getTaskById(id, userId) {
  return taskRepository.findById(id, userId);
}

async function createTask(data) {
  await delay(50);

  const user = await userRepository.findById(data.userId);

  if (!user) {
    throw notFound('User not found', 'USER_NOT_FOUND');
  }

  const task = await taskRepository.create({
    userId: data.userId,
    title: data.title.trim(),
    description: data.description || '',
  });

  eventBus.emit('task.created', task);

  return task;
}

async function updateTask(id, userId, data) {
  const existingTask = await taskRepository.findById(id, userId);

  if (!existingTask) {
    return null;
  }

  const updatedTask = {
    title: data.title !== undefined ? data.title.trim() : existingTask.title,

    description:
      data.description !== undefined
        ? data.description
        : existingTask.description,

    completed:
      data.completed !== undefined ? data.completed : existingTask.completed,
  };

  const task = await taskRepository.update(id, userId, updatedTask);

  eventBus.emit('task.updated', task);

  return task;
}

async function deleteTask(id, userId) {
  const task = await taskRepository.findById(id, userId);

  if (!task) {
    return null;
  }

  const deleted = await taskRepository.remove(id, userId);

  if (deleted) {
    eventBus.emit('task.deleted', task);
  }

  return deleted;
}

async function getTaskStatistics(userId) {
  const [tasks, completedTasks] = await Promise.all([
    taskRepository.findAll({
      userId,
    }),
    taskRepository.findAll({
      userId,
      completed: true,
    }),
  ]);

  return {
    total: tasks.length,
    completed: completedTasks.length,
    pending: tasks.length - completedTasks.length,
  };
}

module.exports = {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  getTaskStatistics,
};
