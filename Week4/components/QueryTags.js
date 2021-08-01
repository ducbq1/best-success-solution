import { useQuery } from "@apollo/client";
import * as Query from "../constants/templates";
import ProductTags from "./ProductTags";

export default function QueryTags() {
  const { loading, error, data } = useQuery(Query.GET_PRODUCT_TAGS);
  if (loading) return "Loading...";
  if (error) return `Error! ${error.message}`;

  const deselectedOptions = data.shop.productTags.edges.map((item) => {
    return {
      value: item.node,
      label: item.node,
    };
  });

  return <ProductTags data={deselectedOptions} />;
}
