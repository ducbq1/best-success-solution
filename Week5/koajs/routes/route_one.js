const Router = require('koa-router');
const router = new Router();

router.all('/', ctx => {
    ctx.body = "Render Severside!";
});

router.post('/account/register', (ctx, next) => {
    const [user, pwd] = ctx.request.body;
})

router.post('/account/login', (ctx, next) => { });


module.exports = router;