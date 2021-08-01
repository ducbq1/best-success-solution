import "@babel/polyfill";
import dotenv from "dotenv";
import "isomorphic-fetch";
import createShopifyAuth, { verifyRequest } from "@shopify/koa-shopify-auth";
import Shopify, { ApiVersion } from "@shopify/shopify-api";
import Koa from "koa";
import next from "next";
import Router from "koa-router";
import bodyParser from "koa-bodyparser";

dotenv.config();
const port = parseInt(process.env.PORT, 10) || 8081;
const dev = process.env.NODE_ENV !== "production";
const app = next({
  dev,
});
const handle = app.getRequestHandler();

Shopify.Context.initialize({
  API_KEY: process.env.SHOPIFY_API_KEY,
  API_SECRET_KEY: process.env.SHOPIFY_API_SECRET,
  SCOPES: process.env.SCOPES.split(","),
  HOST_NAME: process.env.HOST.replace(/https:\/\//, ""),
  API_VERSION: ApiVersion.January21,
  IS_EMBEDDED_APP: true,
  // This should be replaced with your preferred storage strategy
  SESSION_STORAGE: new Shopify.Session.MemorySessionStorage(),
});

// Storing the currently active shops in memory will force them to re-login when your server restarts. You should
// persist this object in your app.
const ACTIVE_SHOPIFY_SHOPS = {};

app.prepare().then(async () => {
  const server = new Koa();
  const router = new Router();
  server.use(bodyParser());
  server.keys = [Shopify.Context.API_SECRET_KEY];
  server.use(
    createShopifyAuth({
      async afterAuth(ctx) {
        // Access token and shop available in ctx.state.shopify
        const { shop, accessToken, scope } = ctx.state.shopify;
        const host = ctx.query.host;
        ACTIVE_SHOPIFY_SHOPS[shop] = scope;

        const ordersCreate = await Shopify.Webhooks.Registry.register({
          shop,
          accessToken,
          path: "/webhooks/orders",
          topic: "ORDERS_CREATE",
          webhookHandler: async (topic, shop, body) => {
            console.log("Webhook Orders Create");
          },
        });

        if (!ordersCreate.success) console.log(`Error: {ordersCreate.result}`);

        const customersCreate = await Shopify.Webhooks.Registry.register({
          shop,
          accessToken,
          path: "/webhooks/customers",
          topic: "CUSTOMERS_CREATE",
          webhookHandler: async (topic, shop, body) => {
            console.log("Webhook Customers Create");
          },
        });

        if (!customersCreate.success)
          console.log(`Error: {customersCreate.result}`);

        const response = await Shopify.Webhooks.Registry.register({
          shop,
          accessToken,
          path: "/webhooks",
          topic: "APP_UNINSTALLED",
          webhookHandler: async (topic, shop, body) =>
            delete ACTIVE_SHOPIFY_SHOPS[shop],
        });

        if (!response.success) {
          console.log(
            `Failed to register APP_UNINSTALLED webhook: ${response.result}`
          );
        }

        // Redirect to app with shop parameter upon auth
        ctx.redirect(`/?shop=${shop}&host=${host}`);
      },
    })
  );

  const handleRequest = async (ctx) => {
    await handle(ctx.req, ctx.res);
    ctx.respond = false;
    ctx.res.statusCode = 200;
  };

  router.get("rest/theme/:id/assets", async (ctx) => {
    const session = await Shopify.Utils.loadCurrentSession(ctx.req, ctx.res);
    const client = new Shopify.Clients.Rest(session.shop, session.accessToken);
    const assets = await client.get({
      path: `themes/${ctx.req.params.id}/assets`,
    });
    ctx.body = assets;
  });

  router.put("rest/theme/:id/assets", async (ctx) => {
    const session = await Shopify.Utils.loadCurrentSession(ctx.req, ctx.res);
    const client = new Shopify.Clients.Rest(session.shop, session.accessToken);
    const body = ctx.request.body;
    await client.put({
      path: `themes/${ctx.req.params.id}/assets`,
      data: {
        asset: {
          key: "templates/bss_b2b_config.liquid",
          // "attachment": encode-based64
          // "value": `${body.fileName}`,
          value: "<div><p>Hello, World</p></div>",
        },
      },
      type: DataType.JSON,
    });
  });

  router.get("/rest/themes", async (ctx) => {
    // Load the current session to get the `accessToken`.
    const session = await Shopify.Utils.loadCurrentSession(ctx.req, ctx.res);
    // Create a new client for the specified shop.
    const client = new Shopify.Clients.Rest(session.shop, session.accessToken);
    // Use `client.get` to request the specified Shopify REST API endpoint, in this case `products`.
    const themes = await client.get({
      path: "themes",
    });
    ctx.body = themes;
  });

  router.post("/rest/themes", async (ctx) => {
    // Load the current session to get the `accessToken`.
    const session = await Shopify.Utils.loadCurrentSession(ctx.req, ctx.res);
    // Create a new client for the specified shop.
    const client = new Shopify.Clients.Rest(session.shop, session.accessToken);
    // Build your post request body.
    const body = ctx.request.body;
    // Use `client.post` to send your request to the specified Shopify REST API endpoint.
    await client.post({
      path: "themes",
      data: body,
      type: DataType.JSON,
    });
  });

  router.post("/webhooks", async (ctx) => {
    try {
      await Shopify.Webhooks.Registry.process(ctx.req, ctx.res);
      console.log(`Webhook processed, returned status code 200`);
    } catch (error) {
      console.log(`Failed to process webhook: ${error}`);
    }
  });

  router.post("/webhooks/orders", async (ctx) => {
    try {
      const customer = await ctx.request.body.customer;
      console.log(`
      Information of Customer:
      ID: ${customer.id || "No ID"}
      Email: ${customer.email || "No Email"}
      Name: ${customer.last_name} ${customer.first_name}
      Phone: ${customer.phone || "No Phone"}
      `);
      await Shopify.Webhooks.Registry.process(ctx.req, ctx.res);
    } catch (error) {
      console.log(`Failed to process webhook: ${error}`);
    }
  });

  router.post("/webhooks/customers", async (ctx) => {
    try {
      const body = await ctx.request.body;
      console.log(`
      All orders of ${body.email || "No Email"}
      Orders count: ${body.orders_count}
      Total spent: ${body.total_spent}
      `);
      await Shopify.Webhooks.Registry.process(ctx.req, ctx.res);
    } catch (error) {
      console.log(`Failed to process webhook: ${error}`);
    }
  });

  router.post(
    "/graphql",
    verifyRequest({ returnHeader: true }),
    async (ctx, next) => {
      await Shopify.Utils.graphqlProxy(ctx.req, ctx.res);
    }
  );

  router.get("(/_next/static/.*)", handleRequest); // Static content is clear
  router.get("/_next/webpack-hmr", handleRequest); // Webpack content is clear
  router.get("(.*)", async (ctx) => {
    const shop = ctx.query.shop;

    // This shop hasn't been seen yet, go through OAuth to create a session
    if (ACTIVE_SHOPIFY_SHOPS[shop] === undefined) {
      ctx.redirect(`/auth?shop=${shop}`);
    } else {
      await handleRequest(ctx);
    }
  });

  server.use(router.allowedMethods());
  server.use(router.routes());
  server.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`);
  });
});
