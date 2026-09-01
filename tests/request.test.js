const test = require('node:test');

const assert = require('node:assert/strict');

const { getUrl } = require('../src/utils/request');

test('getUrl should parse request URL', () => {
  const request = {
    url: '/tasks?page=2&completed=true',

    headers: {
      host: 'localhost:3000',
    },
  };

  const url = getUrl(request);

  assert.equal(url.pathname, '/tasks');

  assert.equal(url.searchParams.get('page'), '2');

  assert.equal(url.searchParams.get('completed'), 'true');
});
