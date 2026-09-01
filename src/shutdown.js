const database = require('./database');

function setupGracefulShutdown(server) {
  let shuttingDown = false;

  async function shutdown(signal) {
    if (shuttingDown) {
      return;
    }

    shuttingDown = true;

    console.log(`${signal} received. Starting graceful shutdown...`);

    server.close(async () => {
      console.log('HTTP server closed.');

      try {
        await database.end();

        console.log('Database connection closed.');

        process.exit(0);
      } catch (error) {
        console.error('Error while closing database:', error);

        process.exit(1);
      }
    });
  }

  process.on('SIGINT', () => shutdown('SIGINT'));

  process.on('SIGTERM', () => shutdown('SIGTERM'));
}

module.exports = {
  setupGracefulShutdown,
};
