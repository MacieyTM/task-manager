function corsMiddleware(request, response, context, next) {
  response.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');

  response.setHeader(
    'Access-Control-Allow-Methods',
    'GET,POST,PATCH,DELETE,OPTIONS',
  );

  response.setHeader(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization',
  );

  if (request.method === 'OPTIONS') {
    response.statusCode = 204;
    response.end();

    return Promise.resolve();
  }

  return next();
}

module.exports = {
  corsMiddleware,
};
