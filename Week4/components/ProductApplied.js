import { Stack, RadioButton } from "@shopify/polaris";
import React, { useState, useCallback, useContext } from "react";
import { StoreContexts } from "../contexts/store-contexts";
import QueryTags from "./QueryTags";
import QueryCollections from "./QueryCollections";
import QueryProducts from "./QueryProducts";

export default function ProductApplied() {
  const { valueContext, ...rest } = useContext(StoreContexts);
  const [value, setValue] = valueContext;

  const handleChange = useCallback((_checked, newValue) => {
    setValue(newValue);
  });

  // const handleSelection = (resources) => {
  //   let idsFromResources = resources.selection.map((product) => product.id);
  //   store.set("ids", idsFromResources);
  //   store.remove("product-tags");
  //   store.remove("product-collections");
  // };

  return (
    <Stack vertical>
      {/* <ResourcePicker
        resourceType="Product"
        showVariants={false}
        open={value == "specific-products"}
        initialSelectionIds={
          [] ||
          store.get("ids").map((item) => {
            id: item;
          })
        }
        onSelection={handleSelection}
      /> */}

      <RadioButton
        label="All products"
        checked={value === "all-products"}
        id="all-products"
        name="all-products"
        onChange={handleChange}
      />
      <RadioButton
        label="Specific products"
        id="specific-products"
        name="specific-products"
        checked={value === "specific-products"}
        onChange={handleChange}
      />
      {value === "specific-products" && <QueryProducts />}
      <RadioButton
        label="Product collections"
        id="product-collections"
        name="product-collections"
        checked={value === "product-collections"}
        onChange={handleChange}
      />
      {value === "product-collections" && <QueryCollections />}
      <RadioButton
        label="Product tags"
        id="product-tags"
        name="product-tags"
        checked={value === "product-tags"}
        onChange={handleChange}
      />
      {value === "product-tags" && <QueryTags />}
    </Stack>
  );
}
