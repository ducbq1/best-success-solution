export default function initAMO(
  $,
  BSS_B2B,
  shopData,
  Shopify,
  isEnableAMO,
  isEnableCP,
  isEnableQB
) {
  /**
   * For advanced minimum order
   */
  BSS_B2B.amo = {};
  BSS_B2B.amo.warning = [];

  BSS_B2B.amo.quantityInputSelectorOnCartPage = function (key) {
    return [
      '[data-cart-item-key="' +
        key +
        '"] input[type="number"][data-quantity-input]',
      '[data-cart-item-key="' + key + '"] input[data-quantity-input]',
      '[data-cart-item-key="' + key + '"] input[data-cart-item-input-quantity]',
      '[data-cart-item-key="' + key + '"] input.js-qty__input',
      '[data-cart-item-key="' + key + '"] input.js-qty__num',
      '[data-cart-item-key="' + key + '"] input.quantity-selector',
      '[data-cart-item-key="' + key + '"] input.cart__quantity-selector',
      '[data-cart-item-key="' + key + '"] input.js--num',
      '[data-cart-item-id="' + key + '"] input.cart-item__qty-input',
      '[data-cart-item-key="' + key + '"] input.cart__product-qty',
      '[data-cart-item-key="' + key + '"] input.form__input.cart__quantity',
      'input.js-qty__num[data-id="' + key + '"]',
      'input.ajaxcart__qty-num[data-id="' + key + '"]',
    ];
  };

  BSS_B2B.amo.amountItemOfPrductOnCartPage = function (key) {
    return [
      '[data-cart-item-key="' +
        key +
        '"] [data-cart-item-line-price] [data-cart-item-regular-price]',
      '[data-cart-item-key="' + key + '"] .cart__item-total',
      '[data-cart-item-key="' + key + '"] [data-label="Total"]',
    ];
  };

  /**
   * Check when AMO Setting is "Apply to Per Products"
   * Compare the quantity or amount of the product with the rule
   */
  BSS_B2B.amo.checkAMORuleForPerProductOfCartPage = function (
    lineItemsApplyAMO
  ) {
    if (BSS_B2B.amo.warning.length > 0) {
      BSS_B2B.amo.warning = [];
    }
    for (var l = 0; l < lineItemsApplyAMO.length; l++) {
      let rule = lineItemsApplyAMO[l];
      var quantityEle = BSS_B2B.amo
        .quantityInputSelectorOnCartPage(rule.key)
        .join(",");
      var quantityMinimumRule = parseFloat(rule.minimum_quantity);
      var amountMinimumRule = quantityMinimumRule * 100;
      if (rule.type) {
        let quantity = rule.quantity;
        let warningQuantity =
          "<li class='bss-amo-text-warning' data-warning-quantity data-warning-id='" +
          rule.id +
          "' style='display: block'>" +
          rule.title +
          ": " +
          parseFloat(rule.minimum_quantity) +
          " " +
          BSS_B2B.amoTranslations.product_text +
          " </li>";

        if (quantity < quantityMinimumRule) {
          if (!BSS_B2B.amo.warning.includes(warningQuantity)) {
            BSS_B2B.amo.warning.push(warningQuantity);
          }
        } else {
          if (BSS_B2B.amo.warning.includes(warningQuantity)) {
            let index = BSS_B2B.amo.warning.indexOf(warningQuantity);
            BSS_B2B.amo.warning.splice(index, 1);
          }
        }
        /* rule type is amount */
      } else {
        let originalLinePrice = rule.original_line_price;
        let minimumPrice = Shopify.formatMoney(
          parseFloat(rule.minimum_quantity) * 100
        );
        let warningAmount =
          "<li class='bss-amo-text-warning' data-warning-amount data-warning-id='" +
          rule.id +
          "' style='display: block'>" +
          rule.title +
          ": " +
          minimumPrice +
          " </li>";
        let price = rule.price;

        if (isEnableCP && BSS_B2B.configData && BSS_B2B.configData.length > 0) {
          let cpPricingList = BSS_B2B.cart.cpPricingList;
          cpPricingList.forEach(function (itemCP) {
            if (itemCP.key == rule.key) {
              price = itemCP.modifiedItemPrice;
              originalLinePrice = itemCP.modifiedLineItemPrice;
            }
          });
        }

        if (isEnableQB && BSS_B2B.qbRules && BSS_B2B.qbRules.length > 0) {
          let qbPricingList = BSS_B2B.cart.qbPricingList;
          qbPricingList.forEach(function (itemQB) {
            if (rule.key == itemQB.key) {
              originalLinePrice = price * itemQB.quantity;
              let discountValue = itemQB.discount_value * 100;
              let quantity = itemQB.quantity;

              if (itemQB.discount_type == 0) {
                if (price > discountValue) {
                  originalLinePrice = discountValue * itemQB.quantity;
                }
              } else if (itemQB.discount_type == 1) {
                if (price < discountValue) {
                  originalLinePrice = 0;
                } else {
                  originalLinePrice = (price - discountValue) * quantity;
                }
              } else {
                originalLinePrice = BSS_B2B.getModifiedPrice(
                  2,
                  originalLinePrice,
                  itemQB.discount_value
                );
              }
            }
          });
        }

        if (originalLinePrice < amountMinimumRule) {
          if (!BSS_B2B.amo.warning.includes(warningAmount)) {
            BSS_B2B.amo.warning.push(warningAmount);
          }
        } else {
          if (BSS_B2B.amo.warning.includes(warningAmount)) {
            let index = BSS_B2B.amo.warning.indexOf(warningAmount);
            BSS_B2B.amo.warning.splice(index, 1);
          }
        }
      }

      if (!isEnableCP || !isEnableQB) {
        if ($(quantityEle).length) {
          $(quantityEle).off();
          $(quantityEle).change(function () {
            setTimeout(function () {
              BSS_B2B.cart.fixer(shopData, true);
            }, 1000);
          });
        }
      }
    }

    BSS_B2B.handleCartCheckoutBtn(shopData);

    if (
      (isEnableQB && BSS_B2B.qbRules && BSS_B2B.qbRules.length > 0) ||
      (isEnableCP && BSS_B2B.configData && BSS_B2B.configData > 0)
    ) {
    } else {
      let amoRemoveButtons = $(BSS_B2B.cart.removeButtons);
      if (amoRemoveButtons.length) {
        $(amoRemoveButtons).off();
        $(BSS_B2B.cart.removeButtons).on("click", function () {
          BSS_B2B.cart.cartQtyOnChange(1200, 2000, true);
        });
      }
    }

    $(".cart-subtotal__price").css("display", "");
  };

  /**
   * Check when AMO Setting is "Apply to All Products"
   * @param lineItemsApplyAMO
   */
  BSS_B2B.amo.checkAMORuleForAllProductsOfCartPage = function (
    lineItemsApplyAMO
  ) {
    if (BSS_B2B.amo.warning.length > 0) {
      BSS_B2B.amo.warning = [];
    }
    var quantitiesRule = 0;
    let listRulesAMO = BSS_B2B.amoRules;

    for (var i = 0; i < listRulesAMO.length; i++) {
      let rule = listRulesAMO[i];
      rule.amountItemApplyRule = 0;
      rule.quantityItemApplyRule = 0;
      rule.titleProductApplyRule = [];
      for (var j = 0; j < lineItemsApplyAMO.length; j++) {
        let item = lineItemsApplyAMO[j];
        var quantityEle = BSS_B2B.amo
          .quantityInputSelectorOnCartPage(item.key)
          .join(",");
        if (rule.id == item.ruleId) {
          rule.titleProductApplyRule.push(item.product_title);
          if (item.type) {
            rule.quantityItemApplyRule += item.quantity;
          } else {
            let originalLinePrice = item.original_line_price;
            let price = item.price;

            if (
              isEnableCP &&
              BSS_B2B.configData &&
              BSS_B2B.configData.length > 0
            ) {
              let cpPricingList = BSS_B2B.cart.cpPricingList;
              cpPricingList.forEach(function (itemCP) {
                if (itemCP.key == item.key) {
                  price = itemCP.modifiedItemPrice;
                  originalLinePrice = itemCP.modifiedLineItemPrice;
                }
              });
            }

            if (isEnableQB && BSS_B2B.qbRules && BSS_B2B.qbRules.length > 0) {
              let qbPricingList = BSS_B2B.cart.qbPricingList;
              qbPricingList.forEach(function (itemQB) {
                if (item.key == itemQB.key) {
                  originalLinePrice = price * itemQB.quantity;
                  let discountValue = itemQB.discount_value * 100;
                  let quantity = itemQB.quantity;

                  if (itemQB.discount_type == 0) {
                    if (price > discountValue) {
                      originalLinePrice = discountValue * itemQB.quantity;
                    }
                  } else if (itemQB.discount_type == 1) {
                    if (price < discountValue) {
                      originalLinePrice = 0;
                    } else {
                      originalLinePrice = (price - discountValue) * quantity;
                    }
                  } else {
                    originalLinePrice = BSS_B2B.getModifiedPrice(
                      2,
                      originalLinePrice,
                      itemQB.discount_value
                    );
                  }
                }
              });
            }
            rule.amountItemApplyRule += originalLinePrice;
          }
        }

        if (!isEnableCP || !isEnableQB) {
          if ($(quantityEle).length) {
            $(quantityEle).off();
            $(quantityEle).change(function () {
              setTimeout(function () {
                BSS_B2B.cart.fixer(shopData, true);
              }, 1000);
            });
          }
        }
      }

      if (rule.type) {
        if (
          rule.quantityItemApplyRule < parseFloat(rule.minimum_quantity) &&
          rule.titleProductApplyRule.length > 0
        ) {
          let warningQuantity =
            "<li class='bss-amo-text-warning' data-warning-quantity data-warning-id='" +
            rule.id +
            "' style='display: block'>" +
            rule.titleProductApplyRule.join(", ") +
            ": " +
            parseFloat(rule.minimum_quantity) +
            " " +
            BSS_B2B.amoTranslations.product_text +
            " </li>";
          BSS_B2B.amo.warning.push(warningQuantity);
        }
      } else {
        let ruleMinimuAmount = parseFloat(rule.minimum_quantity * 100);

        if (
          rule.amountItemApplyRule < ruleMinimuAmount &&
          rule.titleProductApplyRule.length > 0
        ) {
          let minimumPrice = Shopify.formatMoney(ruleMinimuAmount);
          let warningAmount =
            "<li class='bss-amo-text-warning' data-warning-amount data-warning-id='" +
            rule.id +
            "' style='display: block'>" +
            rule.titleProductApplyRule.join(", ") +
            ": " +
            minimumPrice +
            " </li>";
          BSS_B2B.amo.warning.push(warningAmount);
        }
      }
    }

    BSS_B2B.handleCartCheckoutBtn(shopData);

    if (
      (isEnableQB && BSS_B2B.qbRules && BSS_B2B.qbRules.length > 0) ||
      (isEnableCP && BSS_B2B.configData && BSS_B2B.configData > 0)
    ) {
    } else {
      let amoRemoveButtons = $(BSS_B2B.cart.removeButtons);
      if (amoRemoveButtons.length) {
        $(amoRemoveButtons).off();
        $(BSS_B2B.cart.removeButtons).on("click", function () {
          BSS_B2B.cart.cartQtyOnChange(1200, 2000, true);
        });
      }
    }

    $(".cart-subtotal__price").css("display", "");
  };

  /**
   * Each amo rule - each product of cart page
   */
  BSS_B2B.amo.getAppliedRulesForCartItems = function (productMap, isCartItem) {
    let ruleList = BSS_B2B.amoRules;
    let customer = shopData.customer;
    let ruleLists = [];

    ruleList.forEach(function (rule) {
      let customerTags = rule.customer_tags;
      let applyTo = rule.apply_to;
      if (applyTo == 0) {
      } else if (applyTo == 1) {
        if (customer.id !== null) {
          return;
        }
      } else if (applyTo == 2) {
        if (customerTags == "" || customerTags == null) {
          return;
        } else {
          if (customer.tags == null) {
            return;
          } else {
            customerTags = customerTags.split(",");
            var checkArray = customerTags.filter((tag) =>
              customer.tags.includes(tag + "")
            );
            if (checkArray.length == 0) {
              return;
            }
          }
        }
      }

      // set product of rule
      let conditionType = rule.product_condition_type;
      let ruleTags = rule.product_tags ? rule.product_tags.split(",") : [];
      let specificProductIds = rule.product_ids
        ? rule.product_ids.split(",")
        : [];
      let ruleCollectionIds = rule.product_collections
        ? rule.product_collections.split(",")
        : [];

      for (let i = 0; i < productMap.length; i++) {
        let productId = productMap[i].id;
        let collections = productMap[i].collections;
        let tags = productMap[i].tags;

        if (conditionType == 0) {
          // all product
          ruleLists.push({
            ruleId: rule.id,
            productId: productId,
            type: rule.type,
            minimum_quantity: rule.minimum_quantity,
            key: isCartItem ? productMap[i].key : false,
          });
        } else if (conditionType == 1) {
          if (specificProductIds.indexOf(productId + "") !== -1) {
            ruleLists.push({
              ruleId: rule.id,
              productId: productId,
              type: rule.type,
              minimum_quantity: rule.minimum_quantity,
              key: isCartItem ? productMap[i].key : false,
            });
          }
        } else if (conditionType == 2) {
          var checkArray = collections.filter((collection) =>
            ruleCollectionIds.includes(collection + "")
          );
          if (checkArray.length > 0) {
            ruleLists.push({
              ruleId: rule.id,
              productId: productId,
              type: rule.type,
              minimum_quantity: rule.minimum_quantity,
              key: isCartItem ? productMap[i].key : false,
            });
          }
        } else if (conditionType == 3) {
          var checkArray = ruleTags.filter((tag) => tags.includes(tag + ""));
          if (checkArray.length > 0) {
            ruleLists.push({
              ruleId: rule.id,
              productId: productId,
              type: rule.type,
              minimum_quantity: rule.minimum_quantity,
              key: isCartItem ? productMap[i].key : false,
            });
          }
        } else {
        }
      }
    });

    return ruleLists;
  };

  BSS_B2B.amo.getAppliedRulesForEachProduct = function (cartForm, product) {
    var ruleList = BSS_B2B.amoRules;
    var customer = shopData.customer;
    var ruleLists = [];
    var handleUrls = [];
    var handles = [];
    var productId = product.id;
    if (handles.indexOf(productId) === -1 && productId !== null) {
      handles.push(productId);
      handleUrls.push('id:"' + productId + '"');
    }
    var urlData = "/search.js?q=" + handleUrls.join(" OR ") + "&view=bss.b2b";
    var encodeUrlData = encodeURI(urlData);

    $.get(encodeUrlData, function (data) {
      var responProd = [];
      try {
        responProd = JSON.parse(data);
      } catch (e) {
        console.log("product label: JSON parse returns no item");
      }

      var variant = false;
      var queryArray = BSS_B2B.getQueryArray();

      if (cartForm) {
        var variantSelector = $(cartForm).find('select[name="id"]');
        if (variantSelector.length) {
          variant = variantSelector.val();
        }
      }

      var isProductPage = BSS_B2B.page.isProductPage();
      if (isProductPage) {
        var variantSelector = $('form[action*="/cart/add"]').find(
          'select[name="id"]'
        );

        if (variantSelector.length) {
          variant = variantSelector.val();
        }

        if (queryArray.indexOf("variant") !== -1) {
          variant = queryArray["variant"];
        }
      }

      var variants = product.variants;
      if (variants && variants.length) {
        for (var k = 0; k < variants.length; k++) {
          let currentVariant = variants[k];
          if (currentVariant.id == variant) {
            ruleList.forEach(function (rule) {
              let customerTags = rule.customer_tags;
              let applyTo = rule.apply_to;
              if (applyTo == 0) {
              } else if (applyTo == 1) {
                if (customer.id !== null) {
                  return;
                }
              } else if (applyTo == 2) {
                if (customerTags == "" || customerTags == null) {
                  if (customer.tags == null) {
                    return;
                  }
                } else {
                  if (customer.tags == null) {
                    return;
                  } else {
                    customerTags = customerTags.split(",");
                    var checkArray = customerTags.filter((tag) =>
                      customer.tags.includes(tag + "")
                    );
                    if (checkArray.length == 0) {
                      return;
                    }
                  }
                }
              }

              // set product of rule
              let conditionType = rule.product_condition_type;
              let ruleTags = rule.product_tags
                ? rule.product_tags.split(",")
                : [];
              let specificProductIds = rule.product_ids
                ? rule.product_ids.split(",")
                : [];
              let ruleCollectionIds = rule.product_collections
                ? rule.product_collections.split(",")
                : [];

              // for (let i = 0; i < productMap.length; i++) {
              let collections = responProd[0].collections;
              let tags = responProd[0].tags;
              if (conditionType == 0) {
                // all product
                ruleLists.push({
                  id: product.id,
                  title: currentVariant.name,
                  type: rule.type,
                  minimum_quantity: rule.minimum_quantity,
                  price: currentVariant.price,
                });
              } else if (conditionType == 1) {
                //specific product
                if (specificProductIds.indexOf(product.id + "") !== -1) {
                  ruleLists.push({
                    id: product.id,
                    title: currentVariant.name,
                    type: rule.type,
                    minimum_quantity: rule.minimum_quantity,
                    price: currentVariant.price,
                  });
                }
              } else if (conditionType == 2) {
                // product collections
                var checkArray = collections.filter((collection) =>
                  ruleCollectionIds.includes(collection + "")
                );
                if (checkArray.length > 0) {
                  ruleLists.push({
                    id: product.id,
                    title: currentVariant.name,
                    type: rule.type,
                    minimum_quantity: rule.minimum_quantity,
                    price: currentVariant.price,
                  });
                }
              } else if (conditionType == 3) {
                // product tag
                var checkArray = ruleTags.filter((tag) =>
                  tags.includes(tag + "")
                );
                if (checkArray.length > 0) {
                  ruleLists.push({
                    id: product.id,
                    title: currentVariant.name,
                    type: rule.type,
                    minimum_quantity: rule.minimum_quantity,
                    price: currentVariant.price,
                  });
                }
              } else {
              }
            });
          }
        }
      }
    });

    return ruleLists;
  };

  // fix for 2W theme Button Checkout after click Add to cart on quick view
  if (
    $(
      'button.product-item__action-button[data-secondary-action="open-quick-view"]'
    ).length > 0
  ) {
    $(
      'button.product-item__action-button[data-secondary-action="open-quick-view"]'
    ).on("click", function () {
      setTimeout(function () {
        $('button[data-action="add-to-cart"]').on("click", function () {
          setTimeout(function () {
            BSS_B2B.cart.fixer(shopData, true, true);
          }, 1000);
        });
      }, 1000);
    });
  }
}
