
const Koa = require('koa')
const app = new Koa();
const Router = require('koa-router');
const router = new Router();
const path = require('path');
const file = require('../controller/File.js');
const dateFormat = require('dateformat');

router.get('/dashboard', (ctx, next) => {
    ctx.body = file.get(path.join(process.cwd(), 'database/dashboard.json'));
})

router.post('/dashboard/insert', (ctx, next) => {
    let datum = ctx.request.body;
    datum.power = Number(datum.power);
    let dashboard = file.get(path.join(process.cwd(), 'database/dashboard.json'));
    dashboard.push(datum);
    file.write(path.join(process.cwd(), 'database/dashboard.json'), JSON.stringify(dashboard));
    ctx.status = 200;
});

module.exports = router;