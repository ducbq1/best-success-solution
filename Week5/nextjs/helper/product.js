module.exports = {
  convertToProductList: function (prods) {
    let productList = prods.edges.map((item) => {
      let node = item.node;
      let gid = node.id;
      let gidSplit = gid.split("/");
      let productId = gidSplit[gidSplit.length - 1];
      return {
        id: productId,
        title: node.title,
        featuredImage: node.featuredImage,
        productType: node.productType,
        priceRange: node.priceRange,
        gid: node.id,
      };
    });
    return productList;
  },
  convertToDataSheet: function (prods) {
    let productList = prods.edges.map((item) => {
      let node = item.node;
      let gid = node.id;
      let gidSplit = gid.split("/");
      let productId = gidSplit[gidSplit.length - 1];
      return [
        { value: productId, readOnly: true },
        { value: node.title },
        { value: node.featuredImage.transformedSrc, readOnly: true },
      ];
    });
    return productList;
  },
  getUniqueTags: function (edges) {
    let tags = [];
    edges.forEach(function (item) {
      let tag = item.node;
      if (tags.indexOf(tag) === -1) {
        tags.push(tag);
      }
    });
    let productTags = [];
    tags.forEach(function (item) {
      productTags.push({ label: item, value: item });
    });
    return productTags;
  },
};
