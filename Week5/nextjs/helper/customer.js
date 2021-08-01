module.exports = {
  getUniqueTags: function (edges) {
    let tags = [];
    edges.forEach(function (item) {
      let tag = item.node;
      if (tags.indexOf(tag) === -1) {
        tags.push(tag);
      }
    });
    let customerTags = [];
    tags.forEach(function (item) {
      customerTags.push({ label: item, value: item });
    });
    return customerTags;
  },
  getCustomerOptions: function (edges) {
    let customerOptions = [];

    edges.forEach(function (item) {
      let customer = item.node;
      let gid = customer.id;
      let gidSplit = gid.split("/");
      let customerId = gidSplit[gidSplit.length - 1];
      customerOptions.push({
        value: customerId,
        label: customer.displayName,
      });
    });

    return customerOptions;
  },
  convertToCustomerList: function (customers) {
    let customerList = customers.edges.map((item) => {
      let customer = item.node;
      let gid = customer.id;
      let gidSplit = gid.split("/");
      let customerId = gidSplit[gidSplit.length - 1];
      return {
        id: customerId,
        displayName: customer.displayName,
        email: customer.email,
      };
    });
    return customerList;
  },
};
