const { verifyToken } = require('../utils/token');

const { sendJson } = require('../utils/http');

function authenticate(request, response, context) {
  const authorization = request.headers.authorization;

  if (!authorization) {
    sendJson(response, 401, {
      error: {
        code: 'AUTHENTICATION_REQUIRED',

        message: 'Authentication required',
      },
    });

    return false;
  }

  const [scheme, token] = authorization.split(' ');

  if (scheme !== 'Bearer' || !token) {
    sendJson(response, 401, {
      error: {
        code: 'INVALID_AUTHORIZATION_HEADER',

        message: 'Invalid Authorization header',
      },
    });

    return false;
  }

  const payload = verifyToken(token);

  if (!payload) {
    sendJson(response, 401, {
      error: {
        code: 'INVALID_TOKEN',

        message: 'Invalid or expired token',
      },
    });

    return false;
  }

  context.user = payload;

  return true;
}

module.exports = {
  authenticate,
};
