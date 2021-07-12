
const Koa = require('koa')
const app = new Koa();
const Router = require('koa-router');
const router = new Router();
const path = require('path');
const file = require('../controller/File.js');

router.get('/logs', (ctx, next) => {
    ctx.body = file.get(path.join(process.cwd(), 'database/logs.json'));
    next();
}, ctx => console.log(ctx.body))

router.get('/logs/:page', (ctx, next) => {
    ctx.body = file.get(path.join(process.cwd(), 'database/logs.json'));
})

module.exports = router;