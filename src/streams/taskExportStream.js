const { Readable } = require('node:stream');

function createTaskExportStream(tasks) {
  let index = 0;

  return new Readable({
    read() {
      if (index >= tasks.length) {
        this.push(null);

        return;
      }

      const task = tasks[index];

      index++;

      const line = JSON.stringify(task) + '\n';

      this.push(line);
    },
  });
}

module.exports = {
  createTaskExportStream,
};
