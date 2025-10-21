const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
    app.use(
        '/arcade-api',
        createProxyMiddleware({
            // target: 'http://localhost:8001',
            target: 'https://dev-v2-hkb2.dev-diamondteam.com',
            changeOrigin: true,
        })
    );
    app.use(
        '/player-api',
        createProxyMiddleware({
            // target: 'http://localhost:8000',
            target: 'https://dev-v2-hkb2.dev-diamondteam.com',
            changeOrigin: true,
        })
    );
};