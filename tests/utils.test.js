const test = require('node:test');

const assert = require('node:assert/strict');

const { sendJson } = require('../src/utils/http');

test('sendJson should return JSON response', () => {
  let statusCode = null;
  let headers = {};
  let body = null;

  const response = {
    writeHead(status, responseHeaders) {
      statusCode = status;
      headers = responseHeaders;
    },

    end(value) {
      body = value;
    },
  };

  sendJson(response, 200, {
    message: 'Hello',
  });

  assert.equal(statusCode, 200);

  assert.equal(headers['Content-Type'], 'application/json');

  assert.deepEqual(JSON.parse(body), {
    message: 'Hello',
  });
});
