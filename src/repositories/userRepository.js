const database = require('../database');

async function findAll() {
  const result = await database.query(`
            SELECT
                id,
                name,
                email,
                created_at,
                updated_at
            FROM users
            ORDER BY id
        `);

  return result.rows;
}

async function findById(id) {
  const result = await database.query(
    `
                SELECT
                    id,
                    name,
                    email,
                    created_at,
                    updated_at
                FROM users
                WHERE id = $1
            `,
    [id],
  );

  return result.rows[0] || null;
}

async function findByEmail(email) {
  const result = await database.query(
    `
                SELECT
                    id,
                    name,
                    email,
                    password_hash,
                    created_at,
                    updated_at
                FROM users
                WHERE email = $1
            `,
    [email],
  );

  return result.rows[0] || null;
}

async function create(data) {
  const result = await database.query(
    `
                INSERT INTO users (
                    name,
                    email,
                    password_hash
                )
                VALUES ($1, $2, $3)
                RETURNING
                    id,
                    name,
                    email,
                    created_at,
                    updated_at
            `,
    [data.name, data.email, data.passwordHash],
  );

  return result.rows[0];
}

module.exports = {
  findAll,
  findById,
  findByEmail,
  create,
};
