import { gql } from "@apollo/client";

export const GET_PRODUCT_TAGS = gql`
  query GetProductTags {
    shop {
      id
      productTags(first: 20) {
        edges {
          node
        }
      }
    }
  }
`;

export const GET_COLLECTIONS = gql`
  query GetCollections {
    shop {
      id
      collections(first: 20) {
        edges {
          node {
            id
            title
            image {
              originalSrc
            }
          }
        }
      }
    }
  }
`;

export const GET_PRODUCTS = gql`
  query GetProducts {
    products(first: 20) {
      edges {
        node {
          id
          images(first: 1) {
            edges {
              node {
                originalSrc
              }
            }
          }
          variants(first: 1) {
            edges {
              node {
                id
                price
                displayName
              }
            }
          }
        }
      }
    }
  }
`;

export const GET_PRODUCT_BY_ID = gql`
  query GetProduct($id: ID!) {
    product(id: $id) {
      id
      title
      variants(first: 1) {
        edges {
          node {
            price
            id
            displayName
          }
        }
      }
    }
  }
`;

export const GET_PRODUCTS_BY_IDS = gql`
  query getProducts($ids: [ID!]!) {
    nodes(ids: $ids) {
      ... on Product {
        #   title
        #   handle
        #   descriptionHtml
        #   id
        #   images(first: 1) {
        #     edges {
        #       node {
        #         originalSrc
        #         altText
        #       }
        #     }
        #   }
        variants(first: 1) {
          edges {
            node {
              displayName
              price
              id
            }
          }
        }
      }
    }
  }
`;

export const GET_PRODUCT_BY_TAGS = gql`
  query GetProductByTags($tags: String) {
    products(first: 10, query: $tags) {
      edges {
        node {
          id
          tags
          variants(first: 1) {
            edges {
              node {
                id
                price
                displayName
              }
            }
          }
        }
      }
    }
  }
`;

export const GET_PRODUCTS_BY_COLLECTIONS = gql`
  query($ids: [ID!]!) {
    nodes(ids: $ids) {
      ... on Collection {
        title
        products(first: 10) {
          edges {
            node {
              id
              variants(first: 1) {
                edges {
                  node {
                    id
                    price
                    displayName
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;
