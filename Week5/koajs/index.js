
const http = require("http");
const Koa = require("koa");
const combineRoute = [
  require("./routes/route_one"),
  require("./routes/route_two"),
];
const cors = require("@koa/cors");
const bodyParser = require("koa-bodyparser");
const app = new Koa();
const PORT = 3001;

app.use(bodyParser());
app.use(cors());

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
http.createServer(app.callback()).listen(PORT, () => {
  console.log(`Running server in port ${PORT}`)
});
