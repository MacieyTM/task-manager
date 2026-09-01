const test = require('node:test');

const assert = require('node:assert/strict');

const {
  validateCreateTask,
  validateUpdateTask,
} = require('../src/validators/taskValidator');

test('validateCreateTask should accept valid task', () => {
  assert.doesNotThrow(() => {
    validateCreateTask({
      title: 'Learn Node.js',
      description: 'Learning Node.js',
    });
  });
});

test('validateCreateTask should reject empty title', () => {
  assert.throws(
    () => {
      validateCreateTask({
        title: '',
        description: 'Test',
      });
    },
    {
      code: 'INVALID_TITLE',
    },
  );
});

test('validateCreateTask should accept task without userId', () => {
  assert.doesNotThrow(() => {
    validateCreateTask({
      title: 'Test task',
      description: 'Task userId comes from JWT',
    });
  });
});

test('validateCreateTask should reject title longer than 255 characters', () => {
  assert.throws(
    () => {
      validateCreateTask({
        title: 'a'.repeat(256),
      });
    },
    {
      code: 'TITLE_TOO_LONG',
    },
  );
});

test('validateUpdateTask should accept valid update', () => {
  assert.doesNotThrow(() => {
    validateUpdateTask({
      title: 'Updated task',
      description: 'Updated description',
      completed: true,
    });
  });
});

test('validateUpdateTask should reject invalid completed value', () => {
  assert.throws(
    () => {
      validateUpdateTask({
        completed: 'true',
      });
    },
    {
      code: 'INVALID_COMPLETED',
    },
  );
});
