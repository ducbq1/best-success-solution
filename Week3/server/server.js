// https://developer.mozilla.org/en-US/docs/Learn/Server-side/First_steps/Website_security

const http = require("http");
const Koa = require("koa");
const Router = require("koa-router");
const combineRoute = [
  require("./route/account"),
  require("./route/dashboard"),
  require("./route/logs"),
];
const cors = require("@koa/cors");
const bodyParser = require("koa-bodyparser");

const app = new Koa();
const router = new Router();

// bodyparser
app.use(bodyParser());

// cors
app.use(cors());

// logger
app.use(async (ctx, next) => {
  await next();
  const rt = ctx.response.get("X-Response-Time");
  console.log(`${ctx.method} ${ctx.url} - ${rt}`);
});

// x-response-time
app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  ctx.set("X-Response-Time", `${ms}ms`);
});

// route
combineRoute.forEach((item) => {
  app.use(item.routes());
  app.use(item.allowedMethods());
});

// app.listen(3001);
http.createServer(app.callback()).listen(3001);
