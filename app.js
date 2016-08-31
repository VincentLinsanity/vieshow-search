'use strict';
const compress = require('koa-compress');
const logger = require('koa-logger');
const serve = require('koa-static');
const route = require('koa-route');
const koa = require('koa');
const cors = require('kcors')
const path = require('path');
const app = module.exports = koa();
let routerRegister = require('./server/router/index');

/**
 * CORS middleware
 *
 * @param {Object} [options]
 *  - {String|Function(ctx)|GeneratorFunction(ctx)} origin `Access-Control-Allow-Origin`, default is '*'
 *  - {String|Array} allowMethods `Access-Control-Allow-Methods`, default is 'GET,HEAD,PUT,POST,DELETE'
 *  - {String|Array} exposeHeaders `Access-Control-Expose-Headers`
 *  - {String|Array} allowHeaders `Access-Control-Allow-Headers`
 *  - {String|Number} maxAge `Access-Control-Max-Age` in seconds
 *  - {Boolean} credentials `Access-Control-Allow-Credentials`
 *  - {Boolean} keepHeadersOnError Add set headers to `err.header` if an error is thrown
 * @return {Function}
 * @api public
 */
app.use(cors({
      'Access-Control-Allow-Origin': '*'
    }));

// Logger
app.use(logger());

routerRegister.register(app);

// Serve static files
app.use(serve(path.join(__dirname, 'views')));

// Compress
app.use(compress());

if (!module.parent) {
  app.listen(3000);
  console.log('listening on port 3000');
}
