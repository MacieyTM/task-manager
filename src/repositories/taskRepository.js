const database = require('../database');

async function findAll(filters = {}) {
  let query = `
        SELECT
            tasks.id,
            tasks.title,
            tasks.description,
            tasks.completed,
            tasks.user_id,
            users.name AS user_name,
            users.email AS user_email,
            tasks.created_at,
            tasks.updated_at
        FROM tasks
        INNER JOIN users
            ON users.id = tasks.user_id
    `;

  const conditions = [];
  const values = [];

  if (filters.completed !== undefined) {
    values.push(filters.completed);

    conditions.push(`tasks.completed = $${values.length}`);
  }

  if (filters.userId !== undefined) {
    values.push(filters.userId);

    conditions.push(`tasks.user_id = $${values.length}`);
  }

  if (filters.search) {
    values.push(`%${filters.search}%`);

    conditions.push(`
            (
                tasks.title ILIKE $${values.length}
                OR tasks.description ILIKE $${values.length}
            )
        `);
  }

  if (conditions.length > 0) {
    query += `
            WHERE ${conditions.join(' AND ')}
        `;
  }

  query += `
        ORDER BY tasks.id ASC
    `;

  const result = await database.query(query, values);

  return result.rows;
}

async function findById(id, userId) {
  const result = await database.query(
    `
        SELECT
            tasks.id,
            tasks.title,
            tasks.description,
            tasks.completed,
            tasks.user_id,
            users.name AS user_name,
            users.email AS user_email,
            tasks.created_at,
            tasks.updated_at
        FROM tasks
        INNER JOIN users
            ON users.id = tasks.user_id
        WHERE tasks.id = $1
          AND tasks.user_id = $2
        `,
    [id, userId],
  );

  return result.rows[0] || null;
}

async function create(task) {
  const result = await database.query(
    `
        INSERT INTO tasks (
            user_id,
            title,
            description
        )
        VALUES ($1, $2, $3)
        RETURNING
            id,
            user_id,
            title,
            description,
            completed,
            created_at,
            updated_at
        `,
    [task.userId, task.title, task.description],
  );

  return result.rows[0];
}

async function update(id, userId, task) {
  const result = await database.query(
    `
        UPDATE tasks
        SET
            title = $1,
            description = $2,
            completed = $3,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $4
          AND user_id = $5
        RETURNING
            id,
            user_id,
            title,
            description,
            completed,
            created_at,
            updated_at
        `,
    [task.title, task.description, task.completed, id, userId],
  );

  return result.rows[0] || null;
}

async function remove(id, userId) {
  const result = await database.query(
    `
        DELETE FROM tasks
        WHERE id = $1
          AND user_id = $2
        RETURNING id
        `,
    [id, userId],
  );

  return result.rows[0] || null;
}

module.exports = {
  findAll,
  findById,
  create,
  update,
  remove,
};
