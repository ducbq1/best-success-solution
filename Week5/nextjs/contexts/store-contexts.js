import React, { useState } from "react";

export const StoreContexts = React.createContext();

export default function MyStore({ children }) {
  const [value, setValue] = useState("all-products");
  const [ids, setIds] = useState([]);
  const [productsCollections, setProductsCollections] = useState([]);
  const [productsTags, setProductsTags] = useState([]);

  const store = {
    valueContext: [value, setValue],
    idsContext: [ids, setIds],
    productsCollectionsContext: [productsCollections, setProductsCollections],
    productsTagsContext: [productsTags, setProductsTags],
  };

  return (
    <StoreContexts.Provider value={store}>{children}</StoreContexts.Provider>
  );
}
