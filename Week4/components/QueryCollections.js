import { useQuery } from "@apollo/client";
import * as Query from "../constants/templates";
import ProductCollections from "./ProductCollections";

export default function QueryCollections() {
  const { loading, error, data } = useQuery(Query.GET_COLLECTIONS);
  if (loading) return "Loading...";
  if (error) return `Error! ${error.message}`;

  const deselectedOptions = data.shop.collections.edges.map((item) => {
    return {
      value: [
        item.node.id,
        item.node.title,
        !item.node.image ? "" : item.node.image.originalSrc,
      ],
      label: item.node.title,
    };
  });

  return <ProductCollections data={deselectedOptions} />;
}
