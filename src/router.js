const taskController = require('./controllers/taskController');

const userController = require('./controllers/userController');

const authController = require('./controllers/authController');

const { authenticate } = require('./middleware/authMiddleware');

const { getUrl } = require('./utils/request');

const { sendJson } = require('./utils/http');

const database = require('./database');

async function router(request, response, body, context) {
  const url = getUrl(request);

  const pathname = url.pathname;

  const query = Object.fromEntries(url.searchParams.entries());

  /*
   * AUTH
   */

  if (request.method === 'POST' && pathname === '/auth/register') {
    await authController.register(request, response, body);

    return true;
  }

  if (request.method === 'POST' && pathname === '/auth/login') {
    await authController.login(request, response, body);

    return true;
  }

  /*
   * PROTECTED USER ENDPOINT
   */

  if (request.method === 'GET' && pathname === '/me') {
    const authenticated = authenticate(request, response, context);

    if (!authenticated) {
      return true;
    }

    const result = await database.query(
      `
                    SELECT
                        id,
                        name,
                        email,
                        created_at,
                        updated_at
                    FROM users
                    WHERE id = $1
                `,
      [context.user.userId],
    );

    const currentUser = result.rows[0];

    if (!currentUser) {
      sendJson(response, 404, {
        error: {
          code: 'USER_NOT_FOUND',
          message: 'User not found',
        },
      });

      return true;
    }

    sendJson(response, 200, {
      data: currentUser,
    });

    return true;
  }

  /*
   * TASKS
   */

  if (request.method === 'GET' && pathname === '/tasks/export') {
    const authenticated = authenticate(request, response, context);

    if (!authenticated) {
      return true;
    }

    await taskController.exportTasks(request, response, context.user.userId);

    return true;
  }

  if (request.method === 'GET' && pathname === '/tasks') {
    const authenticated = authenticate(request, response, context);

    if (!authenticated) {
      return true;
    }

    await taskController.getAllTasks(
      request,
      response,
      query,
      context.user.userId,
    );

    return true;
  }

  if (request.method === 'GET' && pathname === '/tasks/statistics') {
    const authenticated = authenticate(request, response, context);

    if (!authenticated) {
      return true;
    }

    await taskController.getTaskStatistics(
      request,
      response,
      context.user.userId,
    );

    return true;
  }

  if (request.method === 'GET' && pathname.startsWith('/tasks/')) {
    const id = Number(pathname.split('/')[2]);

    if (!Number.isInteger(id)) {
      return false;
    }

    const authenticated = authenticate(request, response, context);

    if (!authenticated) {
      return true;
    }

    await taskController.getTaskById(
      request,
      response,
      id,
      context.user.userId,
    );

    return true;
  }

  if (request.method === 'POST' && pathname === '/tasks') {
    const authenticated = authenticate(request, response, context);

    if (!authenticated) {
      return true;
    }

    await taskController.createTask(
      request,
      response,
      body,
      context.user.userId,
    );

    return true;
  }

  if (request.method === 'PATCH' && pathname.startsWith('/tasks/')) {
    const id = Number(pathname.split('/')[2]);

    if (!Number.isInteger(id)) {
      return false;
    }

    const authenticated = authenticate(request, response, context);

    if (!authenticated) {
      return true;
    }

    await taskController.updateTask(
      request,
      response,
      id,
      body,
      context.user.userId,
    );

    return true;
  }

  if (request.method === 'DELETE' && pathname.startsWith('/tasks/')) {
    const id = Number(pathname.split('/')[2]);

    if (!Number.isInteger(id)) {
      return false;
    }

    const authenticated = authenticate(request, response, context);

    if (!authenticated) {
      return true;
    }

    await taskController.deleteTask(request, response, id, context.user.userId);

    return true;
  }

  /*
   * USERS
   */

  if (request.method === 'GET' && pathname === '/users') {
    const authenticated = authenticate(request, response, context);

    if (!authenticated) {
      return true;
    }

    await userController.getAllUsers(request, response);

    return true;
  }

  if (request.method === 'GET' && pathname.startsWith('/users/')) {
    const id = Number(pathname.split('/')[2]);

    if (!Number.isInteger(id)) {
      return false;
    }

    const authenticated = authenticate(request, response, context);

    if (!authenticated) {
      return true;
    }

    await userController.getUserById(
      request,
      response,
      id,
      context.user.userId,
    );

    return true;
  }

  return false;
}

module.exports = router;
