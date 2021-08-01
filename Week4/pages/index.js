import {
  Layout,
  Page,
  Card,
  Button,
  Collapsible,
  Stack,
  RadioButton,
  TextField,
} from "@shopify/polaris";
import React, { useState, useCallback, useContext } from "react";
import { useQuery } from "@apollo/client";
import * as Query from "../constants/templates";
import { StoreContexts } from "../contexts/store-contexts";

import GeneralInformation from "../components/GeneralInformation";
import ProductApplied from "../components/ProductApplied";
import Table from "../components/Table";
import FileUpload from "../components/FileUpload";
export default function Index() {
  const {
    valueContext,
    idsContext,
    productsCollectionsContext,
    productsTagsContext,
  } = useContext(StoreContexts);

  // const [getProducts, products] = useLazyQuery(Query.GET_PRODUCTS);
  // const [getProductsByIDS, productsIDS] = useLazyQuery(Query.GET_PRODUCTS_BY_IDS);
  // const [getProductsByCollections, productsCollections] = useLazyQuery(Query.GET_PRODUCTS_BY_COLLECTIONS);
  // const [getProductsByTags, productsTags] = useLazyQuery(Query.GET_PRODUCT_BY_TAGS);

  const getProducts = useQuery(Query.GET_PRODUCTS, { skip: true });
  const getProductsByIDS = useQuery(Query.GET_PRODUCTS_BY_IDS, { skip: true });
  const getProductsByCollections = useQuery(Query.GET_PRODUCTS_BY_COLLECTIONS, {
    skip: true,
  });
  const getProductsByTags = useQuery(Query.GET_PRODUCT_BY_TAGS, { skip: true });

  const [rows, setRows] = useState([]);
  const [option, setOption] = useState("optional-0");
  const [amount, setAmount] = useState(0);

  const processAmount = (rows, input, option) => {
    if (option === "optional-0") {
      if (input == 0) {
        setRows(rows);
      } else {
        setRows(
          rows.map(([displayName, price]) => [displayName, Number(input)])
        );
      }
    } else if (option === "optional-1") {
      setRows(
        rows.map(([displayName, price]) => [displayName, price - Number(input)])
      );
    } else if (option === "optional-2") {
      setRows(
        rows.map(([displayName, price]) => [
          displayName,
          (price * (100 - Number(input))) / 100,
        ])
      );
    }
  };

  const handleToggle = useCallback(async () => {
    if (valueContext[0] === "all-products") {
      const products = await getProducts.refetch();
      if (products.error) console.log("Error");
      if (products.loading) console.log("Loading");

      let temp = [];
      let items = products.data.products;
      for (let i = 0; i < items.edges.length; i++) {
        for (let j = 0; j < items.edges[i].node.variants.edges.length; j++) {
          temp.push([
            items.edges[i].node.variants.edges[j].node.displayName,
            items.edges[i].node.variants.edges[j].node.price,
          ]);
        }
      }
      processAmount(temp, amount, option);
    }

    if (valueContext[0] === "specific-products") {
      const productsIDS = await getProductsByIDS.refetch({
        ids: idsContext[0],
      });
      if (productsIDS.error) console.log("Error");
      if (productsIDS.loading) console.log("Loading");

      let temp = [];
      let items = productsIDS.data.nodes;
      for (let i = 0; i < items.length; i++) {
        temp.push([
          items[i].variants.edges[0].node.displayName,
          items[i].variants.edges[0].node.price,
        ]);
      }
      processAmount(temp, amount, option);
    }

    if (valueContext[0] === "product-collections") {
      const productsCollections = await getProductsByCollections.refetch({
        ids: productsCollectionsContext[0],
      });
      if (productsCollections.error) console.log("Error");
      if (productsCollections.loading) console.log("Loading");

      let temp = [];
      let collections = productsCollections.data.nodes;
      for (let i = 0; i < collections.length; i++) {
        for (let j = 0; j < collections[i].products.edges.length; j++) {
          temp.push([
            collections[i].products.edges[j].node.variants.edges[0].node
              .displayName,
            collections[i].products.edges[j].node.variants.edges[0].node.price,
          ]);
        }
      }
      processAmount(temp, amount, option);
    }

    if (valueContext[0] === "product-tags") {
      const productsTags = await getProductsByTags.refetch({
        tags: `tag:[${productsTagsContext[0]}]`,
      });
      if (productsTags.error) console.log("Error");
      if (productsTags.loading) console.log("Loading");

      let temp = [];
      let items = productsTags.data.products;
      for (let i = 0; i < items.edges.length; i++) {
        for (let j = 0; j < items.edges[i].node.variants.edges.length; j++) {
          temp.push([
            items.edges[i].node.variants.edges[j].node.displayName,
            items.edges[i].node.variants.edges[j].node.price,
          ]);
        }
      }
      processAmount(temp, amount, option);
    }
  }, [
    option,
    amount,
    valueContext[0],
    idsContext[0],
    productsCollectionsContext[0],
    productsTagsContext[0],
  ]);

  const handleChange = useCallback((_checked, newValue) => {
    setOption(newValue);
    setAmount(0);
  }, []);

  const handleAmountChange = useCallback((input) => setAmount(input), []);

  return (
    <Page title="New Pricing Rule">
      <Layout>
        <Layout.Section>
          <Card sectioned title="General Information">
            <GeneralInformation />
          </Card>
          <Card sectioned title="Apply to Products">
            <ProductApplied />
          </Card>
          <Card sectioned title="Custom Prices">
            <Stack vertical>
              <RadioButton
                label="Apply a price to selected products"
                checked={option === "optional-0"}
                id="optional-0"
                name="optional-0"
                onChange={handleChange}
              />
              <RadioButton
                label="Decrease a fixed amount of the original prices of selected products"
                id="optional-1"
                name="optional-1"
                checked={option === "optional-1"}
                onChange={handleChange}
              />
              <RadioButton
                label="Decrease the original prices of selected products by a percentage (%)"
                id="optional-2"
                name="optional-2"
                checked={option === "optional-2"}
                onChange={handleChange}
              />
              <TextField
                value={amount}
                onChange={handleAmountChange}
                label="Amount"
                type="number"
              />
            </Stack>
          </Card>
        </Layout.Section>
        <Layout.Section secondary>
          <Card sectioned>
            <FileUpload />
          </Card>
          <Card sectioned>
            <Button onClick={handleToggle}>Show product pricing details</Button>
            <Collapsible
              open={true}
              transition={{ duration: "500ms", timingFunction: "ease-in-out" }}
              expandOnPrint
            >
              <Table rows={rows} />
            </Collapsible>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
