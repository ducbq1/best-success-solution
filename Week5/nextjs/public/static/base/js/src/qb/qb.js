import handleAjaxCart from "../cart/handle-ajax-cart";

export default function initQb(
  $,
  BSS_B2B,
  shopData,
  Shopify,
  isEnableQB,
  isEnableCP,
  isEnableAMO,
  isEnableMC
) {
  /**
   * For quantity Break
   */
  BSS_B2B.qb = {};
  BSS_B2B.cart.qbPricingList = [];
  BSS_B2B.qb.appliedQbRuleForOneProduct = false;
  BSS_B2B.qb.appliedQbRulesForProductsInCart = false;
  BSS_B2B.qb.quantityInputSelectorOnProductPage = [
    'input[type="number"][name="quantity"]',
    'input[type="number"][data-quantity-input]',
    'input[type="number"][class$="quantity"]',
    'input[id^="Quantity"]',
    'input[name="quantity"]',
  ];
  BSS_B2B.qb.defaultLineItemCssSelector = function (key) {
    var cssSelector = '[data-cart-item-key="' + key + '"] .product-details';
    return cssSelector;
  };

  BSS_B2B.qb.lineItemCssSelector = function (key) {
    var cssSelector = '[data-cart-item-key="' + key + '"] .bss-b2b-qb-table';
    return cssSelector;
  };

  BSS_B2B.qb.quantityInputSelectorOnCartPage = function (key) {
    return [
      '[data-cart-item-key="' + key + '"] input[type="number"]',
      '[data-cart-item-key="' + key + '"] input[data-quantity-input]',
      '[data-cart-item-key="' + key + '"] input[data-cart-item-input-quantity]',
      '[data-cart-item-key="' + key + '"] input.js-qty__input',
      '[data-cart-item-key="' + key + '"] input.js-qty__num',
      '[data-cart-item-key="' + key + '"] input.ajaxifyCart--num',
    ];
  };

  /**
   * Insert each qty table applied to each line item on cart page
   */
  BSS_B2B.qb.insertQtyTableToCartItemBlock = function (newCartData = false) {
    try {
      var buttonChangeQuantity = $(BSS_B2B.cart.buttonChangeQuantity);
      var cartData = shopData.cart;
      if (newCartData) {
        cartData = newCartData;
      }
      if (cartData.items && cartData.items.length > 0) {
        var domain = shopData.shop.permanent_domain;

        var productMap = [];
        var handleUrls = [];
        var handles = [];
        var keyIdMap = new Map();
        var cartItemProductMap = new Map();
        cartData.items.forEach(function (item) {
          var proId = item.product_id;
          if (handles.indexOf(proId) === -1) {
            handles.push(proId);
            handleUrls.push('id:"' + proId + '"');
            keyIdMap.set(proId, []);
          }
          let productItemKeys = keyIdMap.get(proId);
          productItemKeys.push(item.key);
          keyIdMap.set(proId, productItemKeys);

          /* Show price  when use QB*/
          var productVariants = cartItemProductMap.get(proId);
          if (!productVariants || productVariants == undefined) {
            cartItemProductMap.set(proId, []);
            productVariants = [];
          }

          productVariants.push({
            key: item.key,
            quantity: item.quantity,
            id: item.variant_id,
            price: item.price,
          });
          cartItemProductMap.set(proId, productVariants);
        });
        var urlData =
          "/search.js?q=" + handleUrls.join(" OR ") + "&view=bss.b2b";
        var encodeUrlData = encodeURI(urlData);
        $.get(encodeUrlData, function (data) {
          var responProd = [];
          try {
            responProd = JSON.parse(data);
          } catch (e) {
            console.log("product label: JSON parse returns no item");
          }

          if (responProd.length > 0) {
            var productMap = [];
            var productPrices = [];
            var checkUnique = [];
            for (var i = 0; i < responProd.length; i++) {
              var pro = responProd[i];
              if (checkUnique.indexOf(pro.id) === -1) {
                checkUnique.push(pro.id);
                keyIdMap.get(pro.id).forEach(function (key) {
                  productMap.push({
                    id: pro.id,
                    tags: pro.tags,
                    collections: pro.collections,
                    key: key,
                  });
                });
              }
            }
            //Using item.key for key of Map instead of item.id
            var ruleMap = BSS_B2B.qb.getAppliedRulesForCartItems(
              productMap,
              false
            );
            let qbPricingList = BSS_B2B.qb.getPriceList(
              productMap,
              cartItemProductMap
            );
            BSS_B2B.cart.qbPricingList = qbPricingList;

            if (qbPricingList.length) {
              setTimeout(function () {
                var cpPricingList = BSS_B2B.cart.cpPricingList;
                BSS_B2B.qb.showPriceWhenUseQB(
                  qbPricingList,
                  cpPricingList,
                  cartData
                );
              }, 1000);
            } else {
              let cartSubtotalPriceElement = BSS_B2B.qb
                .cartSubtotalPriceElement()
                .join(",");
              if ($(cartSubtotalPriceElement).length) {
                $(cartSubtotalPriceElement).css("text-decoration", "none");
                if ($(".bss-qb-cart-subtotal").length) {
                  $(".bss-qb-cart-subtotal").remove();
                }
              }
              if (isEnableMC) {
                // init convert currency function
                BSS_B2B.MC.changeCurrencyCartPageQB();
              }
            }

            ruleMap.forEach(function (value, key) {
              var element = $(BSS_B2B.qb.lineItemCssSelector(key));
              if (element.length == 0) {
                element = $(BSS_B2B.qb.defaultLineItemCssSelector(key));
              }
              if (
                element.length &&
                element.parent().find(".bss-b2b-cart-item-qty-table").length ==
                  0
              ) {
                var qtyTableHtml = BSS_B2B.qb.getQtyTableHtml(value, false);
                element.after(qtyTableHtml);
                /**
                 * Click to row, change quantity of line item
                 */
                $(
                  '[data-cart-item-key="' + key + '"] .bss-b2b-qty-table-row'
                ).on("click", function (e) {
                  e.preventDefault();
                  e.stopPropagation();
                  var quantitySelector = BSS_B2B.qb
                    .quantityInputSelectorOnCartPage(key)
                    .join(",");
                  $(quantitySelector)
                    .val($(this).attr("data-max"))
                    .trigger("change");
                  /**
                   * Update cart quantity
                   */
                  $.post(
                    "/cart/change.js",
                    {
                      quantity: parseInt($(this).attr("data-max")),
                      id: key,
                    },
                    "json"
                  ).done(function () {
                    $("form[action*='/cart']").submit();
                  });

                  $(
                    '[data-cart-item-key="' + key + '"] .bss-b2b-qty-table-row'
                  ).removeClass("qty-row-active");
                  $(this).addClass("qty-row-active");
                });
              }
            });
            /**
             * Slide Toggle qty table
             */
            $(".bss-b2b-cart-item-qty-table-header").on("click", function (e) {
              e.stopPropagation();
              $(this)
                .closest(".bss-b2b-cart-item-qty-table")
                .find(".bss-b2b-qty-table-wrapper")
                .toggle();
            });
          }
        });

        if (
          !(isEnableCP && BSS_B2B.configData && BSS_B2B.configData.length > 0)
        ) {
          $(BSS_B2B.cart.removeButtons).on("click", function () {
            BSS_B2B.cart.cartQtyOnChange(1200, 2000, true);
          });
        }
      } else {
        console.log("Could not get cart data");
      }
    } catch (e) {
      console.log("Could not get shop data");
    }
  };
  /**
   * Get applied rule for product on product page
   * @param formProductId
   * @returns {boolean}
   */
  BSS_B2B.qb.getAppliedRuleOnProductPage = function (formProductId) {
    let ruleList = BSS_B2B.qbRules;
    let customer = shopData.customer;
    let product = shopData.product;
    let productId = product.id;
    if (formProductId) {
      productId = formProductId;
    }
    let appliedQbRule = false;
    ruleList.forEach(function (rule) {
      if (appliedQbRule) {
        return;
      }
      let applyTo = rule.apply_to;
      let customerIds = rule.customer_ids;
      let customerTags = rule.customer_tags;
      if (applyTo == 0) {
      } else if (applyTo == 1) {
        if (customer.id == null) {
          return;
        } else {
        }
      } else if (applyTo == 2) {
        if (customer.id !== null) {
          return;
        }
      } else if (applyTo == 3) {
        if (customer.id == null) {
          return;
        } else {
          customerIds = customerIds.split(",");
          if (customerIds.indexOf(customer.id + "") === -1) {
            return;
          }
        }
      } else if (applyTo == 4) {
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
      let conditionType = rule.product_condition_type;
      let ruleTags = rule.product_tags ? rule.product_tags.split(",") : [];
      let specificProductIds = rule.product_ids
        ? rule.product_ids.split(",")
        : [];
      let ruleCollectionIds = rule.product_collections
        ? rule.product_collections.split(",")
        : [];

      let collections = shopData.collections;
      let tags = product.tags;
      if (conditionType == 0) {
        appliedQbRule = rule;
      } else if (conditionType == 1) {
        if (specificProductIds.indexOf(productId + "") !== -1) {
          appliedQbRule = rule;
        }
      } else if (conditionType == 2) {
        var checkArray = collections.filter((collection) =>
          ruleCollectionIds.includes(collection + "")
        );
        if (checkArray.length > 0) {
          appliedQbRule = rule;
        }
      } else if (conditionType == 3) {
        var checkArray = ruleTags.filter((tag) => tags.includes(tag + ""));

        if (checkArray.length > 0) {
          appliedQbRule = rule;
        }
      } else {
      }
    });
    BSS_B2B.qb.appliedQbRuleForOneProduct = appliedQbRule;
    return appliedQbRule;
  };

  /**
   * Get applied rule map for products in cart
   * @param productsInCart
   * @returns {boolean}
   */
  BSS_B2B.qb.getAppliedRulesForCartItems = function (
    productMap,
    idIsKeyForMap = true
  ) {
    let ruleList = BSS_B2B.qbRules;
    let customer = shopData.customer;
    let ruleMap = new Map();
    ruleList.forEach(function (rule) {
      let applyTo = rule.apply_to;
      let customerIds = rule.customer_ids;
      let customerTags = rule.customer_tags;
      if (applyTo == 0) {
      } else if (applyTo == 1) {
        if (customer.id == null) {
          return;
        } else {
        }
      } else if (applyTo == 2) {
        if (customer.id !== null) {
          return;
        }
      } else if (applyTo == 3) {
        if (customer.id == null) {
          return;
        } else {
          customerIds = customerIds.split(",");
          if (customerIds.indexOf(customer.id + "") === -1) {
            return;
          }
        }
      } else if (applyTo == 4) {
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

      let conditionType = rule.product_condition_type;
      let ruleTags = rule.product_tags ? rule.product_tags.split(",") : [];
      let specificProductIds = rule.product_ids
        ? rule.product_ids.split(",")
        : [];
      let ruleCollectionIds = rule.product_collections
        ? rule.product_collections.split(",")
        : [];

      productMap.forEach(function (item) {
        if (idIsKeyForMap) {
          if (ruleMap.get(item.id)) {
            return;
          }
        } else {
          if (ruleMap.get(item.key)) {
            return;
          }
        }

        let collections = item.collections;
        let tags = item.tags;
        let productId = item.id;
        let appliedQbRule = false;
        if (conditionType == 0) {
          appliedQbRule = rule;
        } else if (conditionType == 1) {
          if (specificProductIds.indexOf(productId + "") !== -1) {
            appliedQbRule = rule;
          }
        } else if (conditionType == 2) {
          var checkArray = collections.filter((collection) =>
            ruleCollectionIds.includes(collection + "")
          );
          if (checkArray.length > 0) {
            appliedQbRule = rule;
          }
        } else if (conditionType == 3) {
          var checkArray = ruleTags.filter((tag) => tags.includes(tag + ""));

          if (checkArray.length > 0) {
            appliedQbRule = rule;
          }
        } else {
        }
        if (appliedQbRule) {
          if (idIsKeyForMap) {
            ruleMap.set(item.id, appliedQbRule);
          } else {
            ruleMap.set(item.key, appliedQbRule);
          }
        }
      });
    });
    BSS_B2B.qb.appliedQbRulesForProductsInCart = ruleMap;
    return ruleMap;
  };

  /**
   * Get QB Price List
   */
  BSS_B2B.qb.getPriceList = function (productMap, cartItemProductMap) {
    if (isEnableQB == 0) {
      return [];
    }
    var appliedRulesForCartItems = BSS_B2B.qb.getAppliedRulesForCartItems(
      productMap,
      true
    );
    var productRuleType2 = new Map();
    appliedRulesForCartItems.forEach(function (value, key) {
      if (value.rule_type == 1) {
        var prods = productRuleType2.get(value.id);
        if (!prods || prods == undefined) {
          prods = [];
          productRuleType2.set(value.id, []);
        }
        prods.push(key);
        productRuleType2.set(value.id, prods);
      }
    });
    var priceLists = [];
    appliedRulesForCartItems.forEach(function (value, key) {
      if (value.rule_type == 0) {
        var variants = cartItemProductMap.get(key);
        var totalQuantity = 0;
        variants.forEach(function (item) {
          totalQuantity += item.quantity;
        });
        var qtyTable = value.qty_table;
        var discountType = -1;
        var discountValue = -1;
        qtyTable.forEach(function (qtyRow) {
          let qtyFrom = parseInt(qtyRow.qty_from);

          let qtyTo = qtyRow.qty_to;
          if (qtyTo != null && qtyTo.toString().length > 0) {
            qtyTo = parseInt(qtyRow.qty_to);
            if (totalQuantity >= qtyFrom && totalQuantity <= qtyTo) {
              discountValue = parseFloat(qtyRow.discount_value);
              discountType = parseInt(qtyRow.discount_type);
            }
          } else {
            if (totalQuantity >= qtyFrom) {
              discountValue = parseFloat(qtyRow.discount_value);
              discountType = parseInt(qtyRow.discount_type);
            }
          }
        });
        if (discountValue != -1 && discountType != -1) {
          variants.forEach(function (item) {
            priceLists.push({
              id: item.id,
              discount_type: discountType,
              discount_value: discountValue,
              price: item.price,
              quantity: item.quantity,
              key: item.key,
            });
          });
        }
      } else if (value.rule_type == 1) {
        var appliedProducts = productRuleType2.get(value.id);
        if (appliedProducts && appliedProducts != undefined) {
          var totalQuantity = 0;
          var variants = cartItemProductMap.get(key);
          appliedProducts.forEach(function (pro) {
            var proVariants = cartItemProductMap.get(pro);
            proVariants.forEach(function (variant) {
              totalQuantity += variant.quantity;
            });
          });

          var qtyTable = value.qty_table;
          var discountType = -1;
          var discountValue = -1;

          qtyTable.forEach(function (qtyRow) {
            let qtyFrom = parseInt(qtyRow.qty_from);
            let qtyTo = qtyRow.qty_to;
            if (qtyTo != null && qtyTo.toString().length > 0) {
              qtyTo = parseInt(qtyRow.qty_to);
              if (totalQuantity >= qtyFrom && totalQuantity <= qtyTo) {
                discountValue = parseFloat(qtyRow.discount_value);
                discountType = parseInt(qtyRow.discount_type);
              }
            } else {
              if (totalQuantity >= qtyFrom) {
                discountValue = parseFloat(qtyRow.discount_value);
                discountType = parseInt(qtyRow.discount_type);
              }
            }
          });

          if (discountValue != -1 && discountType != -1) {
            variants.forEach(function (item) {
              priceLists.push({
                id: item.id,
                discount_type: discountType,
                discount_value: discountValue,
                price: item.price,
                quantity: item.quantity,
                key: item.key,
              });
            });
          }
        }
      } else {
        var variants = cartItemProductMap.get(key);
        var totalQuantity = 0;
        var qtyTable = value.qty_table;
        variants.forEach(function (item) {
          var variantQuantity = item.quantity;
          var discountType = -1;
          var discountValue = -1;
          qtyTable.forEach(function (qtyRow) {
            let qtyFrom = parseInt(qtyRow.qty_from);
            let qtyTo = qtyRow.qty_to;
            if (qtyTo != null && qtyTo.toString().length > 0) {
              qtyTo = parseInt(qtyRow.qty_to);
              if (variantQuantity >= qtyFrom && variantQuantity <= qtyTo) {
                discountValue = parseFloat(qtyRow.discount_value);
                discountType = parseInt(qtyRow.discount_type);
              }
            } else {
              if (variantQuantity >= qtyFrom) {
                discountValue = parseFloat(qtyRow.discount_value);
                discountType = parseInt(qtyRow.discount_type);
              }
            }
          });

          if (discountValue != -1 && discountType != -1) {
            priceLists.push({
              id: item.id,
              discount_type: discountType,
              discount_value: discountValue,
              price: item.price,
              quantity: item.quantity,
              key: item.key,
            });
          }
        });
      }
    });

    return priceLists;
  };

  /**
   * Get qty table html
   */
  BSS_B2B.qb.getQtyTableHtml = function (appliedRule, isShow = true) {
    var qtyTable = appliedRule.qty_table;
    var table = "<table>";
    table +=
      "<thead><tr><th>" +
      BSS_B2B.qbGeneralSettings.table_qty_range_text +
      "</th><th>" +
      BSS_B2B.qbGeneralSettings.table_discount_text +
      "</th></tr></thead>";
    table += "<tbody>";
    for (var i = 0; i < qtyTable.length; i++) {
      var discountValue = qtyTable[i].discount_value;
      switch (qtyTable[i].discount_type) {
        case 0:
          discountValue = Shopify.formatMoney(discountValue * 100);
          break;
        case 1:
          discountValue = Shopify.formatMoney(discountValue * 100);
          break;
        case 2:
          discountValue = discountValue + "%";
          break;
        default:
          break;
      }
      let qtyRange =
        "<td>" + qtyTable[i].qty_from + " - " + qtyTable[i].qty_to + "</td>";
      let qtyTableRow =
        "<tr class='bss-b2b-qty-table-row' data-min='" +
        qtyTable[i].qty_from +
        "' data-max='" +
        qtyTable[i].qty_to +
        "'>";
      if (
        qtyTable[i].qty_to == null ||
        qtyTable[i].qty_to.toString().length == 0
      ) {
        qtyRange = "<td> ≥ " + qtyTable[i].qty_from + "</td>";
        qtyTableRow =
          "<tr class='bss-b2b-qty-table-row' data-min='" +
          qtyTable[i].qty_from +
          "' data-max='" +
          qtyTable[i].qty_from +
          "'>";
      }

      table += qtyTableRow;
      table += qtyRange;
      table +=
        "<td>" +
        discountValue +
        (qtyTable[i].discount_type == 0
          ? " " + BSS_B2B.qbGeneralSettings.flat_price_suffix
          : "") +
        "</td>";
      table += "</tr>";
    }
    table += "</tbody>";
    table += "</table>";
    var details = '<div class="bss-b2b-cart-item-qty-table">';
    details +=
      '<p class="bss-b2b-cart-item-qty-table-header">' +
      BSS_B2B.qbGeneralSettings.table_header_text +
      "</p>";
    details +=
      '<div class="bss-b2b-qty-table-wrapper"' +
      (isShow ? 'style="display: block">' : 'style="display: none">') +
      table +
      "</div>";
    details += "</div>";
    return details;
  };

  /**
   * Create qty-table on front end
   */
  BSS_B2B.qb.generateTableOnProductPage = function () {
    var appliedRule = BSS_B2B.qb.getAppliedRuleOnProductPage(false);
    if (appliedRule) {
      var qtyTableHtml = BSS_B2B.qb.getQtyTableHtml(appliedRule);

      if ($('form[action*="/cart/add"] .bss-b2b-qb-table').length > 0) {
        $('form[action*="/cart/add"] .bss-b2b-qb-table').prepend(qtyTableHtml);
      } else if (BSS_B2B.storeId == 546) {
        $('button[data-checkout="same"][data-pf-type="ProductATC"]')
          .parent()
          .parent()
          .before(qtyTableHtml);

        let insertTable = setInterval(function () {
          let price = $('div[data-intro="Product Price"]');
          let qbQuantityTable = $(".bss-b2b-cart-item-qty-table");
          if (qbQuantityTable.length) {
            clearInterval(insertTable);
          } else {
            price.closest(".cpb-product-actions").prepend(qtyTableHtml);
          }
        }, 500);
      } else {
        //fix for screenshelf
        if (BSS_B2B.storeId == 918) {
          $(".price_top").after(qtyTableHtml);
        } else {
          $('form[action*="/cart/add"]').prepend(qtyTableHtml);
        }
      }

      $(".bss-b2b-cart-item-qty-table-header").on("click", function (e) {
        e.stopPropagation();
        $(this)
          .closest(".bss-b2b-cart-item-qty-table")
          .find(".bss-b2b-qty-table-wrapper")
          .toggle();
      });

      $(".bss-b2b-qty-table-row").on("click", function (e) {
        e.preventDefault();
        var quantitySelector = BSS_B2B.qb.quantityInputSelectorOnProductPage.join(
          ","
        );
        $(quantitySelector).val($(this).attr("data-max"));
        $(".bss-b2b-qty-table-row").removeClass("qty-row-active");
        $(this).addClass("qty-row-active");
      });
    }
  };

  /**
   *  cart total price element of each item in cart page
   */
  BSS_B2B.qb.totalPriceOfItemElement = function (key) {
    return [
      '[data-cart-item-key="' +
        key +
        '"] [data-cart-item-line-price] [data-cart-item-regular-price]:not(:has(>span))',
      '[data-cart-item-key="' +
        key +
        '"] span[bss-b2b-cart-item-key="' +
        key +
        '"][bss-b2b-original-line-price]',
      '[data-cart-item-key="' +
        key +
        '"] .cart__table-cell--line-price[data-label="Total"]:not(:has(>span))',
      '[data-cart-item-key="' +
        key +
        '"] .text-right[data-label="Total"]:not(:has(>span))',
      '[data-cart-item-key="' + key + '"] .cart__item-total:not(:has(>span))',
      '[data-cart-item-key="' +
        key +
        '"] span[bss-b2b-cart-item-key="' +
        key +
        '"][bss-b2b-ajax-original-line-price]',
      '[data-cart-item-key="' +
        key +
        '"] .cart-original-price.order-discount--cart-price:not(:has(>span))',
      '[data-cart-item-id="' +
        key +
        '"] [data-cart-item-line-price-container] .cart-item__original-price.cart-item__price:not(:has(>span))',
      '[data-cart-item-key="' +
        key +
        '"] .grid__item.two-thirds.text-right .cart__price:not(:has(>span)):not(".cart__price--bold")',
      '[data-cart-item-key="' +
        key +
        '"] .grid--full.cart__row--table-large .grid__item.text-right .h5:not(:has(>span))',
      '[data-cart-item-key="' +
        key +
        '"] span.cart__price.cart__price--bold:not(:has(>span))',
      // fix for inotex by ThaBi
      '[data-cart-item-key="' + key + '"] .product-price:not(:has(>span))',
      // fix for studyphones by ThaBi
      '[data-cart-item-key="' +
        key +
        '"] span[bss-b2b-cart-item-key="' +
        key +
        '"][bss-b2b-final-line-price]',
      // fix for bestpricepakistan by ThaBi
      '[data-cart-item-key="' +
        key +
        '"] .cart-item-price,' +
        //fix cra-wellness by vitu
        '[data-cart-item-key="' +
        key +
        '"] .price_total .money',
    ];
  };

  /**
   *  cart total price element of each item in cart page
   */
  BSS_B2B.qb.cartItemPriceOfItemElement = function (key) {
    return [
      '[data-cart-item-key="' +
        key +
        '"] [data-cart-item-price] [data-cart-item-regular-price]:not(:has(>span))',
      '[data-cart-item-key="' +
        key +
        '"] .cart__price [data-cart-item-regular-price]:not(:has(>span))',
    ];
  };

  /**
   * cart subtotal price element in cart page
   */
  BSS_B2B.qb.cartSubtotalPriceElement = function () {
    return [
      ".large--one-third .cart__subtotal:not(:has(>span))",
      ".cart-subtotal__price[data-cart-subtotal]:not(:has(>span))",
      "[bss-b2b-cart-total-price]",
      "[bss-b2b-ajax-cart-subtotal]",
      ".cart-subtotal--price small:not(:has(>span))",
      ".cart-subtotal--price:not(:has(>span))",
      ".cart__subtotal .cart__subtotal-price:not(:has(>span))",
      ".cart__totals .cart__subtotal:not(:has(>span))",
      "#ajaxifyModal [bss-b2b-product-handle][bss-b2b-variant-id][bss-b2b-product-sale-price]",
      "#your-shopping-cart [bss-b2b-product-handle][bss-b2b-variant-id][bss-b2b-product-sale-price]",
      // fix for inotex by ThaBi
      ".bdr-box .flex.cart-subtotal-row .cart__subtotal.text-right:not(:has(>span))",
      ".minicartTol .product-price",
      // fix for bestpricepakistan by ThaBi
      ".subtotal .cart-item-total-price",
      // fix cra-wellness by vitu
      ".cart_subtotal .money",
    ];
  };

  /**
   * show prices have not decreased and decreased when used qb
   */
  BSS_B2B.qb.showPriceWhenUseQB = function (
    qbPricingList,
    cpPricingList,
    cartData
  ) {
    let cartSubtotalPriceElement = BSS_B2B.qb
      .cartSubtotalPriceElement()
      .join(",");
    var cartSubtotalPrice = cartData.original_total_price;
    if (isEnableCP && BSS_B2B.configData && BSS_B2B.configData.length) {
      cartSubtotalPrice = BSS_B2B.cart.modifiedItemsSubtotalPrice;
    }

    $(cartSubtotalPriceElement).css("text-decoration", "line-through");

    qbPricingList.forEach(function (item) {
      let totalItemElement = BSS_B2B.qb
        .totalPriceOfItemElement(item.key)
        .join(",");
      $(totalItemElement).css("text-decoration", "line-through");

      if (
        $(totalItemElement).parent().find(".bss-qb-total-price-item").length > 0
      ) {
        return;
      } else {
        let totalItem = item.price * item.quantity;
        let priceItem = item.price;
        if (isEnableCP && BSS_B2B.configData && BSS_B2B.configData.length) {
          cpPricingList.forEach(function (itemCP) {
            if (itemCP.key == item.key) {
              totalItem = itemCP.modifiedLineItemPrice;
              priceItem = itemCP.modifiedItemPrice;
            }
          });
        }

        var price = false;
        let offsetPrice = false;
        let discountValue = item.discount_value * 100;
        let quantity = item.quantity;

        if (item.discount_type == 0) {
          if (priceItem < discountValue) {
            price = priceItem * quantity;
          } else {
            price = discountValue * quantity;
          }
        } else if (item.discount_type == 1) {
          let truePrice = false;

          if (priceItem < discountValue) {
            price = 0;
          } else {
            price = (priceItem - discountValue) * quantity;
          }
        } else {
          price = BSS_B2B.getModifiedPrice(2, totalItem, item.discount_value);
        }

        offsetPrice = totalItem - price;
        cartSubtotalPrice = cartSubtotalPrice - offsetPrice;
      }

      let priceHTML =
        '<span class="bss-qb-total-price-item" bss-shop-base-currency="' +
        price +
        '" style="display: block;">' +
        Shopify.formatMoney(price) +
        "</span>";
      $(totalItemElement).after(priceHTML);
    });

    let newCartSubtotalPriceHtml =
      '<span class="bss-qb-cart-subtotal" bss-shop-base-currency="' +
      cartSubtotalPrice +
      '" style="display: block;">' +
      Shopify.formatMoney(cartSubtotalPrice) +
      "</span>";

    if (
      $(cartSubtotalPriceElement).parent().find(".bss-qb-cart-subtotal").length
    ) {
      $(".bss-qb-cart-subtotal").html(Shopify.formatMoney(cartSubtotalPrice));
    } else {
      $(cartSubtotalPriceElement).after(newCartSubtotalPriceHtml);
    }

    if (isEnableMC) {
      // init convert currency function
      BSS_B2B.MC.changeCurrencyCartPageQB();
    }

    $(
      "[bss-b2b-cart-item-key]," +
        "[bss-b2b-product-id]," +
        "[bss-b2b-variant-id]," +
        "[bss-b2b-cart-item-key]," +
        "[bss-b2b-cart-total-price]," +
        "[bss-b2b-cart-total-discount]," +
        "[data-cart-item-regular-price]," +
        "[data-cart-subtotal]"
    ).css("visibility", "visible");
  };
}
