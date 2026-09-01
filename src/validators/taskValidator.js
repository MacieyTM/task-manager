const { badRequest } = require('../utils/errors');

function validateCreateTask(data) {
  if (!data || typeof data !== 'object') {
    throw badRequest('Request body must be an object', 'INVALID_BODY');
  }

  if (typeof data.title !== 'string' || data.title.trim() === '') {
    throw badRequest('title is required', 'INVALID_TITLE');
  }

  if (data.title.length > 255) {
    throw badRequest('title must not exceed 255 characters', 'TITLE_TOO_LONG');
  }

  if (data.description !== undefined && typeof data.description !== 'string') {
    throw badRequest('description must be a string', 'INVALID_DESCRIPTION');
  }
}

function validateUpdateTask(data) {
  if (!data || typeof data !== 'object') {
    throw badRequest('Request body must be an object', 'INVALID_BODY');
  }

  if (data.title !== undefined) {
    if (typeof data.title !== 'string' || data.title.trim() === '') {
      throw badRequest('title must be a non-empty string', 'INVALID_TITLE');
    }

    if (data.title.length > 255) {
      throw badRequest(
        'title must not exceed 255 characters',
        'TITLE_TOO_LONG',
      );
    }
  }

  if (data.description !== undefined && typeof data.description !== 'string') {
    throw badRequest('description must be a string', 'INVALID_DESCRIPTION');
  }

  if (data.completed !== undefined && typeof data.completed !== 'boolean') {
    throw badRequest('completed must be a boolean', 'INVALID_COMPLETED');
  }
}

module.exports = {
  validateCreateTask,
  validateUpdateTask,
};
