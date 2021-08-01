import React, { useState, useCallback, useContext } from "react";
import { useQuery, useLazyQuery } from "@apollo/client";
import * as Query from "../constants/templates";
import { StoreContexts } from "../contexts/store-contexts";

export default function QuerySample() {
  const [getProducts, products] = useLazyQuery(Query.GET_PRODUCTS);
  const getProduct = useQuery(Query.GET_PRODUCTS, { skip: true });
  if (true) {
    const instanceProduct = getProduct.refetch();
  }
}
