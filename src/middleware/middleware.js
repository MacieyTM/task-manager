function createMiddlewareStack() {
  const middlewares = [];

  function use(middleware) {
    middlewares.push(middleware);
  }

  async function execute(request, response, context = {}) {
    let index = -1;

    async function next() {
      index++;

      if (index >= middlewares.length) {
        return;
      }

      const middleware = middlewares[index];

      await middleware(request, response, context, next);
    }

    await next();
  }

  return {
    use,
    execute,
  };
}

module.exports = {
  createMiddlewareStack,
};
