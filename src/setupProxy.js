/**
 * Dynamic Proxy
 * -------------
 *
 * Allows to define the backend port as environment variable and
 * make sure that the devServer uses it as a proxy for the api
 */

const { createProxyMiddleware } = require('http-proxy-middleware')

module.exports = function (app) {
    const proxyPort = process.env.REACT_APP_PORT || process.env.PORT || '8080'
    const proxyUrl = process.env.REACT_APP_PROXY || `http://localhost:${proxyPort}/`
    app.use(createProxyMiddleware('/api', { target: proxyUrl }))
    app.use(createProxyMiddleware('/media', { target: proxyUrl }))
}
