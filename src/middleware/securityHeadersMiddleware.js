function securityHeadersMiddleware(request, response, context, next) {
  response.setHeader('X-Content-Type-Options', 'nosniff');

  response.setHeader('X-Frame-Options', 'DENY');

  response.setHeader('Referrer-Policy', 'no-referrer');

  return next();
}

module.exports = {
  securityHeadersMiddleware,
};
