'use strict';
const compress = require('koa-compress');
const logger = require('koa-logger');
const serve = require('koa-static');
const route = require('koa-route');
const koa = require('koa');
const path = require('path');
const app = module.exports = koa();
let routerRegister = require('./server/router/index');

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
