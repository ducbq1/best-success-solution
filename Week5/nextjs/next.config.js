const { parsed: localEnv } = require("dotenv").config();

const webpack = require("webpack");
const apiKey = JSON.stringify(process.env.SHOPIFY_API_KEY);
const apiVersion = JSON.stringify(process.env.API_VERSION);
const host = JSON.stringify(process.env.HOST);
const shop = JSON.stringify(process.env.SHOP);

module.exports = {
  reactStrictMode: true,
  webpack: (config) => {
    const env = {
      API_VERSION: apiVersion,
      API_KEY: apiKey,
      HOST: host,
      SHOP: shop,
    };
    config.plugins.push(new webpack.DefinePlugin(env));

    // Add ESM support for .mjs files in webpack 4
    config.module.rules.push({
      test: /\.mjs$/,
      include: /node_modules/,
      type: "javascript/auto",
    });

    return config;
  },
  images: {
    loader: "imgix",
    path: "https://example.com/myaccount/",
  },
};
