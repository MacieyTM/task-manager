const test = require('node:test');

const assert = require('node:assert/strict');

const { createTaskExportStream } = require('../src/streams/taskExportStream');

test('task export stream should emit tasks', async () => {
  const tasks = [
    {
      id: 1,
      title: 'Task one',
    },
    {
      id: 2,
      title: 'Task two',
    },
  ];

  const stream = createTaskExportStream(tasks);

  const chunks = [];

  for await (const chunk of stream) {
    chunks.push(chunk.toString());
  }

  assert.equal(chunks.length, 2);

  assert.deepEqual(JSON.parse(chunks[0]), tasks[0]);

  assert.deepEqual(JSON.parse(chunks[1]), tasks[1]);
});
