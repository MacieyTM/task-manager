const config = require('./config');

const { createApp } = require('./app');

const { setupGracefulShutdown } = require('./shutdown');

const server = createApp();

server.listen(config.port, () => {
  console.log(`Server running on http://localhost:${config.port}`);

  console.log(`Environment: ${config.env}`);
});

setupGracefulShutdown(server);
