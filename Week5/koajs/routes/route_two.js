
const Router = require('koa-router');
const router = new Router();

router.get('/dashboard', (ctx, next) => {
    ctx.body = "Hello";
})

router.post('/dashboard/insert', (ctx, next) => {
    ctx.status = 200;
});

module.exports = router;