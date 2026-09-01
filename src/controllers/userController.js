const userService = require('../services/userService');

const { sendJson } = require('../utils/http');

const { badRequest } = require('../utils/errors');

const { validateCreateUser } = require('../validators/userValidator');

async function getAllUsers(request, response) {
  const users = await userService.getAllUsers();

  sendJson(response, 200, {
    data: users,
  });
}

async function getUserById(request, response, id, authenticatedUserId) {
  if (!Number.isInteger(id) || id <= 0) {
    throw badRequest('User id must be a positive integer', 'INVALID_USER_ID');
  }

  if (id !== authenticatedUserId) {
    sendJson(response, 404, {
      error: {
        code: 'USER_NOT_FOUND',
        message: 'User not found',
      },
    });

    return;
  }

  const user = await userService.getUserById(id);

  if (!user) {
    sendJson(response, 404, {
      error: {
        code: 'USER_NOT_FOUND',
        message: 'User not found',
      },
    });

    return;
  }

  sendJson(response, 200, {
    data: user,
  });
}

async function createUser(request, response, body) {
  validateCreateUser(body);

  const user = await userService.createUser(body);

  sendJson(response, 201, {
    data: user,
  });
}

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
};
