const userRepository = require('../repositories/userRepository');

const { hashPassword, verifyPassword } = require('../utils/password');

const { createToken } = require('../utils/token');

const { sendJson } = require('../utils/http');

const { badRequest } = require('../utils/errors');

async function register(request, response, body) {
  if (!body || typeof body !== 'object') {
    throw badRequest('Request body must be an object', 'INVALID_BODY');
  }

  if (typeof body.name !== 'string' || body.name.trim() === '') {
    throw badRequest('name is required', 'INVALID_NAME');
  }

  if (typeof body.email !== 'string' || body.email.trim() === '') {
    throw badRequest('email is required', 'INVALID_EMAIL');
  }

  if (typeof body.password !== 'string' || body.password.length < 8) {
    throw badRequest(
      'password must contain at least 8 characters',
      'INVALID_PASSWORD',
    );
  }

  const email = body.email.trim().toLowerCase();

  const existingUser = await userRepository.findByEmail(email);

  if (existingUser) {
    sendJson(response, 409, {
      error: {
        code: 'EMAIL_ALREADY_EXISTS',

        message: 'Email already exists',
      },
    });

    return;
  }

  const passwordHash = await hashPassword(body.password);

  const user = await userRepository.create({
    name: body.name.trim(),

    email,

    passwordHash,
  });

  sendJson(response, 201, {
    data: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
  });
}

async function login(request, response, body) {
  if (!body || typeof body !== 'object') {
    throw badRequest('Request body must be an object', 'INVALID_BODY');
  }

  if (typeof body.email !== 'string' || typeof body.password !== 'string') {
    throw badRequest('email and password are required', 'INVALID_CREDENTIALS');
  }

  const email = body.email.trim().toLowerCase();

  const user = await userRepository.findByEmail(email);

  if (!user) {
    sendJson(response, 401, {
      error: {
        code: 'INVALID_CREDENTIALS',

        message: 'Invalid email or password',
      },
    });

    return;
  }

  const passwordValid = await verifyPassword(body.password, user.password_hash);

  if (!passwordValid) {
    sendJson(response, 401, {
      error: {
        code: 'INVALID_CREDENTIALS',

        message: 'Invalid email or password',
      },
    });

    return;
  }

  const token = createToken(user.id);

  sendJson(response, 200, {
    data: {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    },
  });
}

module.exports = {
  register,
  login,
};
