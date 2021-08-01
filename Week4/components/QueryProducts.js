import { useQuery } from "@apollo/client";
import * as Query from "../constants/templates";
import Products from "./Products";

export default function QueryProducts() {
  const { loading, error, data } = useQuery(Query.GET_PRODUCTS);
  if (loading) return "Loading...";
  if (error) return `Error! ${error.message}`;

  const deselectedOptions = data.products.edges.map((item) => {
    return {
      value: [
        item.node.variants.edges[0].node.price,
        item.node.images.edges[0].node.originalSrc,
        item.node.id,
      ],
      label: item.node.variants.edges[0].node.displayName,
    };
  });

  return <Products data={deselectedOptions} />;
}
