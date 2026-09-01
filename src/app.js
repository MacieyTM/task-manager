const http = require('node:http');

const router = require('./router');

const database = require('./database');

const { sendJson } = require('./utils/http');

const { readRequestBody, getUrl } = require('./utils/request');

const { AppError } = require('./utils/errors');

const { handleDatabaseError } = require('./utils/databaseError');

const { createMiddlewareStack } = require('./middleware/middleware');

const { loggerMiddleware } = require('./middleware/loggerMiddleware');

const { corsMiddleware } = require('./middleware/corsMiddleware');

const { requestIdMiddleware } = require('./middleware/requestIdMiddleware');

const {
  securityHeadersMiddleware,
} = require('./middleware/securityHeadersMiddleware');

const { rateLimitMiddleware } = require('./middleware/rateLimitMiddleware');

function createApp() {
  const middlewareStack = createMiddlewareStack();

  middlewareStack.use(requestIdMiddleware);

  middlewareStack.use(rateLimitMiddleware);

  middlewareStack.use(loggerMiddleware);

  middlewareStack.use(securityHeadersMiddleware);

  middlewareStack.use(corsMiddleware);

  return http.createServer(async (request, response) => {
    const context = {};

    try {
      await middlewareStack.execute(request, response, context);

      if (response.writableEnded) {
        return;
      }

      const url = getUrl(request);

      if (request.method === 'GET' && url.pathname === '/x') {
        response.writeHead(200, {
          'Content-Type': 'text/plain',
        });

        response.end('Hello World');

        return;
      }

      if (request.method === 'GET' && url.pathname === '/ready') {
        await database.query('SELECT 1');

        sendJson(response, 200, {
          data: {
            status: 'ready',
            database: 'ok',
          },
        });

        return;
      }

      if (request.method === 'GET' && url.pathname === '/health') {
        await database.query('SELECT 1');

        sendJson(response, 200, {
          data: {
            status: 'ok',
            database: 'ok',
          },
        });

        return;
      }

      let body = {};

      if (request.method === 'POST' || request.method === 'PATCH') {
        const contentType = request.headers['content-type'];

        if (!contentType || !contentType.includes('application/json')) {
          sendJson(response, 415, {
            error: {
              code: 'UNSUPPORTED_MEDIA_TYPE',

              message: 'Content-Type must be application/json',
            },
          });

          return;
        }

        body = await readRequestBody(request);
      }

      const handled = await router(request, response, body, context);

      if (handled) {
        return;
      }

      sendJson(response, 404, {
        error: {
          code: 'ROUTE_NOT_FOUND',

          message: 'Route not found',
        },
      });
    } catch (originalError) {
      const error = handleDatabaseError(originalError);

      console.error(error);

      if (error instanceof AppError) {
        sendJson(response, error.statusCode, {
          error: {
            code: error.code,

            message: error.message,
          },
        });

        return;
      }

      sendJson(response, 500, {
        error: {
          code: 'INTERNAL_SERVER_ERROR',

          message: 'Internal server error',
        },
      });
    }
  });
}

module.exports = {
  createApp,
};
