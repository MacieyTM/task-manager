const test = require('node:test');

const assert = require('node:assert/strict');

const { createMiddlewareStack } = require('../src/middleware/middleware');

test('middleware should execute in order', async () => {
  const stack = createMiddlewareStack();

  const result = [];

  stack.use(async (request, response, context, next) => {
    result.push('first');

    await next();

    result.push('first-after');
  });

  stack.use(async (request, response, context, next) => {
    result.push('second');

    await next();

    result.push('second-after');
  });

  await stack.execute({}, {}, {});

  assert.deepEqual(result, ['first', 'second', 'second-after', 'first-after']);
});
