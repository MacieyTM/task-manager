const { badRequest } = require('../utils/errors');

function validateCreateUser(data) {
  if (!data || typeof data !== 'object') {
    throw badRequest('Request body must be an object', 'INVALID_BODY');
  }

  if (typeof data.name !== 'string' || data.name.trim() === '') {
    throw badRequest('name is required', 'INVALID_NAME');
  }

  if (data.name.length > 100) {
    throw badRequest('name must not exceed 100 characters', 'NAME_TOO_LONG');
  }

  if (typeof data.email !== 'string' || data.email.trim() === '') {
    throw badRequest('email is required', 'INVALID_EMAIL');
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    throw badRequest('email must be a valid email address', 'INVALID_EMAIL');
  }

  if (data.email.length > 255) {
    throw badRequest('email must not exceed 255 characters', 'EMAIL_TOO_LONG');
  }
}

module.exports = {
  validateCreateUser,
};
