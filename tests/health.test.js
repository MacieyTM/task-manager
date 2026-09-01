const test = require('node:test');

const assert = require('node:assert/strict');

const { createApp } = require('../src/app');

test('GET /health should return 200', async () => {
  const server = createApp();

  await new Promise((resolve) => {
    server.listen(0, resolve);
  });

  const port = server.address().port;

  try {
    const response = await fetch(`http://localhost:${port}/health`);

    assert.equal(response.status, 200);

    const body = await response.json();

    assert.equal(body.data.status, 'ok');

    assert.equal(body.data.database, 'ok');
  } finally {
    await new Promise((resolve) => {
      server.close(resolve);
    });
  }
});
