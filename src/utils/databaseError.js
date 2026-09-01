const { AppError } = require('./errors');

function handleDatabaseError(error) {
  if (error.code === '23505') {
    return new AppError(
      'Resource already exists',
      409,
      'RESOURCE_ALREADY_EXISTS',
    );
  }

  if (error.code === '23503') {
    return new AppError(
      'Referenced resource does not exist',
      400,
      'INVALID_REFERENCE',
    );
  }

  return error;
}

module.exports = {
  handleDatabaseError,
};
