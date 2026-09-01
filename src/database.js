const { Pool } = require('pg');

const config = require('./config');

const pool = new Pool({
  host: config.database.host,

  port: config.database.port,

  database: config.database.name,

  user: config.database.user,

  password: config.database.password,
});

pool.on('error', (error) => {
  console.error('Unexpected PostgreSQL pool error:', error);
});

async function query(text, parameters = []) {
  return pool.query(text, parameters);
}

async function close() {
  await pool.end();
}

module.exports = {
  query,
  close,
};
