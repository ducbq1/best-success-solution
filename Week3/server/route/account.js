const Koa = require('koa')
const app = new Koa();
const Router = require('koa-router');
const router = new Router();
const path = require('path');
const file = require('../controller/File');


router.all('/', ctx => {
    ctx.body = "Render Severside!";
});

// router.get('/account', (ctx, next) => {
//     ctx.body = file.get(path.join(process.cwd(), 'database/account.json'));
// })

router.post('/account/register', (ctx, next) => {
    const [user, pwd] = ctx.request.body;
    // validate
    // file.add(path.join(process.cwd(), 'database/account.json'), datum);
})

router.post('/account/login', (ctx, next) => {});


module.exports = router;