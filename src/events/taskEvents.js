const eventBus = require('./eventBus');

eventBus.on('task.created', (task) => {
  console.log(`[EVENT] Task created: ${task.id} - ${task.title}`);
});

eventBus.on('task.updated', (task) => {
  console.log(`[EVENT] Task updated: ${task.id}`);
});

eventBus.on('task.deleted', (task) => {
  console.log(`[EVENT] Task deleted: ${task.id}`);
});
