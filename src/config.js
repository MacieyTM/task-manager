require('dotenv').config();

function getRequiredEnv(name) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

function getNumberEnv(name, defaultValue) {
  const value = process.env[name];

  if (value === undefined) {
    return defaultValue;
  }

  const number = Number(value);

  if (!Number.isFinite(number)) {
    throw new Error(`${name} must be a valid number`);
  }

  return number;
}

const config = {
  env: process.env.NODE_ENV || 'development',

  port: getNumberEnv('PORT', 3000),

  database: {
    host: getRequiredEnv('DB_HOST'),

    port: getNumberEnv('DB_PORT', 5432),

    name: getRequiredEnv('DB_NAME'),

    user: getRequiredEnv('DB_USER'),

    password: getRequiredEnv('DB_PASSWORD'),
  },

  jwtSecret: getRequiredEnv('JWT_SECRET'),

  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:4200',

  rateLimit: {
    windowMs: getNumberEnv('RATE_LIMIT_WINDOW_MS', 60000),

    maxRequests: getNumberEnv('RATE_LIMIT_MAX_REQUESTS', 100),
  },
};

module.exports = config;
