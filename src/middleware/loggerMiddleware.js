function loggerMiddleware(request, response, context, next) {
  const start = Date.now();

  return next().finally(() => {
    const duration = Date.now() - start;

    console.log(
      `${request.method} ${request.url} ${response.statusCode} ${duration}ms`,
    );
  });
}

module.exports = {
  loggerMiddleware,
};
