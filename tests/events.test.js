const test = require('node:test');

const assert = require('node:assert/strict');

const EventEmitter = require('node:events');

test('EventEmitter should emit events', () => {
  const eventBus = new EventEmitter();

  let receivedTask = null;

  eventBus.on('task.created', (task) => {
    receivedTask = task;
  });

  const task = {
    id: 10,
    title: 'Test task',
  };

  eventBus.emit('task.created', task);

  assert.deepEqual(receivedTask, task);
});
