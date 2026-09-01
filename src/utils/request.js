function readRequestBody(request) {
  return new Promise((resolve, reject) => {
    let body = '';

    request.on('data', (chunk) => {
      body += chunk;
    });

    request.on('end', () => {
      if (!body) {
        resolve({});
        return;
      }

      try {
        const parsedBody = JSON.parse(body);

        resolve(parsedBody);
      } catch (error) {
        reject(error);
      }
    });

    request.on('error', reject);
  });
}

function getUrl(request) {
  return new URL(request.url, `http://${request.headers.host}`);
}

module.exports = {
  readRequestBody,
  getUrl,
};
