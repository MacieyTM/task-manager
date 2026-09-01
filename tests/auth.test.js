const test = require('node:test');

const assert = require('node:assert/strict');

const { authenticate } = require('../src/middleware/authMiddleware');

test('authenticate should reject missing token', () => {
  let statusCode = null;
  let body = null;

  const request = {
    headers: {},
  };

  const response = {
    writeHead(status) {
      statusCode = status;
    },

    end(value) {
      body = value;
    },
  };

  const context = {};

  const result = authenticate(request, response, context);

  assert.equal(result, false);

  assert.equal(statusCode, 401);

  assert.ok(body);

  const parsedBody = JSON.parse(body);

  assert.equal(parsedBody.error.code, 'AUTHENTICATION_REQUIRED');
});
