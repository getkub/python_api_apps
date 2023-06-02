const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://localhost:8000', // Change this if your FastAPI server is running on a different port
      changeOrigin: true,
    })
  );
};
