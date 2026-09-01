const config = require('../config');

const clients = new Map();

function rateLimitMiddleware(request, response, context, next) {
  const ip = request.socket.remoteAddress || 'unknown';

  const now = Date.now();

  let client = clients.get(ip);

  if (!client) {
    client = {
      count: 0,
      windowStart: now,
    };

    clients.set(ip, client);
  }

  const windowExpired = now - client.windowStart >= config.rateLimit.windowMs;

  if (windowExpired) {
    client.count = 0;
    client.windowStart = now;
  }

  client.count++;

  const remaining = Math.max(0, config.rateLimit.maxRequests - client.count);

  response.setHeader('X-RateLimit-Limit', config.rateLimit.maxRequests);

  response.setHeader('X-RateLimit-Remaining', remaining);

  if (client.count > config.rateLimit.maxRequests) {
    response.writeHead(429, {
      'Content-Type': 'application/json',
      'Retry-After': Math.ceil(
        (config.rateLimit.windowMs - (now - client.windowStart)) / 1000,
      ),
    });

    response.end(
      JSON.stringify({
        error: {
          code: 'RATE_LIMIT_EXCEEDED',

          message: 'Too many requests',
        },
      }),
    );

    return false;
  }

  return next();
}

module.exports = {
  rateLimitMiddleware,
};
