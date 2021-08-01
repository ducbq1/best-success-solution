import React from "react";
import "@shopify/polaris/dist/styles.css";
import translations from "@shopify/polaris/locales/en.json";
import { AppProvider } from "@shopify/polaris";
import MyStore from "../contexts/store-contexts";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";

function MyApp(props) {
  const { Component, pageProps, cookie } = props;
  const accessToken = cookie.split("; ")[4].substring(12);

  const client = new ApolloClient({
    cache: new InMemoryCache(),
    uri: `https://${SHOP}/admin/api/${API_VERSION}/graphql.json`,
    request: (operation) => {
      operation.setContext({
        headers: {
          "X-Shopify-Access-Token": accessToken,
          "User-Agent": `shopify-app-node ${process.env.npm_package_version} | Shopify App CLI`,
        },
      });
    },
  });

  return (
    <React.Fragment>
      <MyStore>
        <AppProvider i18n={translations}>
          <ApolloProvider client={client}>
            <Component {...pageProps} />
          </ApolloProvider>
        </AppProvider>
      </MyStore>
    </React.Fragment>
  );
}

MyApp.getInitialProps = async ({ ctx }) => {
  return {
    host: ctx.query.host,
    shop: ctx.query.shop,
    cookie: ctx.req.headers.cookie,
  };
};

export default MyApp;
