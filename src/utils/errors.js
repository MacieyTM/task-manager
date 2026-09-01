class AppError extends Error {
  constructor(message, statusCode, code) {
    super(message);

    this.name = 'AppError';
    this.statusCode = statusCode;
    this.code = code;
  }
}

function badRequest(message, code = 'BAD_REQUEST') {
  return new AppError(message, 400, code);
}

function notFound(message, code = 'NOT_FOUND') {
  return new AppError(message, 404, code);
}

module.exports = {
  AppError,
  badRequest,
  notFound,
};
