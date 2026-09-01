const crypto = require('node:crypto');

function requestIdMiddleware(request, response, context, next) {
  const requestId = crypto.randomUUID();

  context.requestId = requestId;

  response.setHeader('X-Request-Id', requestId);

  return next();
}

module.exports = {
  requestIdMiddleware,
};
