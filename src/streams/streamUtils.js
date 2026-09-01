const { pipeline } = require('node:stream/promises');

async function streamToResponse(stream, response) {
  response.statusCode = 200;

  response.setHeader('Content-Type', 'application/x-ndjson');

  await pipeline(stream, response);
}

module.exports = {
  streamToResponse,
};
