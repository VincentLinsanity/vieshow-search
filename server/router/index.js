'use strict';

let router = require('koa-router')();

require('./vieshow/index').register(router);

module.exports.register = (app) => {
    app.use(router.middleware());
};