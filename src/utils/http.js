function sendJson(response, statusCode, data) {
  response.writeHead(statusCode, {
    'Content-Type': 'application/json',
  });

  response.end(JSON.stringify(data));
}

function sendNoContent(response) {
  response.writeHead(204);
  response.end();
}

module.exports = {
  sendJson,
  sendNoContent,
};
