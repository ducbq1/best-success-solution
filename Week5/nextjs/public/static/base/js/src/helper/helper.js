import formatMoney from "./format-money";
export default function helper($, BSS_B2B) {
  BSS_B2B.getCssSelector = function (selector) {
    if (BSS_B2B.customPricingSettings != null) {
      if (
        BSS_B2B.customPricingSettings[selector] != null &&
        selector.indexOf("_time_delay_") !== -1
      ) {
        return BSS_B2B.customPricingSettings[selector];
      } else {
        if (
          BSS_B2B.customPricingSettings[selector] != null &&
          BSS_B2B.customPricingSettings[selector].length
        ) {
          return "," + BSS_B2B.customPricingSettings[selector];
        }
      }
    }
    return "";
  };
  BSS_B2B.getQueryArray = function () {
    var vars = [],
      hash;
    var hashes = window.location.href
      .slice(window.location.href.indexOf("?") + 1)
      .split("&");
    for (var i = 0; i < hashes.length; i++) {
      hash = hashes[i].split("=");
      vars.push(hash[0]);
      vars[hash[0]] = hash[1];
    }
    return vars;
  };
  // function fix orantek by vitu
  BSS_B2B.printSaveTo = function (shopData, newPrice) {
    var Shopify = Shopify || {};
    formatMoney(shopData, Shopify);
    let ruleApplies = [];
    let price = 0;
    if (shopData.product) {
      price = parseFloat(shopData.product.price);
      if (newPrice && newPrice.length < 7) {
        price = parseFloat(newPrice) * 100;
      }
      let element = $(".bss-save-to-cp");

      for (let i = 0; i < BSS_B2B.configData.length; i++) {
        let rule = BSS_B2B.configData[i];
        if (rule.product_condition_type == 0) {
          ruleApplies.push(rule);
        } else if (rule.product_condition_type == 1) {
          if (
            rule.product_ids.split(",").includes(shopData.product.id.toString())
          ) {
            ruleApplies.push(rule);
          }
        } else if (rule.product_condition_type == 2) {
          if (
            shopData.collections.filter((item) =>
              rule.product_collections.split(",").includes(item.toString())
            ).length
          ) {
            ruleApplies.push(rule);
          }
        } else if (rule.product_condition_type == 3) {
          if (
            shopData.product.tags.filter((item) =>
              rule.product_tags.split(",").includes(item.toString())
            ).length
          ) {
            ruleApplies.push(rule);
          }
        }
      }
      let priceApplies = [];
      if (ruleApplies.length) {
        let priceApply;
        for (let i = 0; i < ruleApplies.length; i++) {
          if (ruleApplies[i].discount_type == 0) {
            priceApply = parseFloat(ruleApplies[i].discount_value);
            priceApplies.push(priceApply * 100);
          } else if (ruleApplies[i].discount_type == 1) {
            priceApply =
              price - parseFloat(ruleApplies[i].discount_value) * 100;
            priceApplies.push(priceApply);
          } else if (ruleApplies[i].discount_type == 2) {
            priceApply =
              price - (price * parseFloat(ruleApplies[i].discount_value)) / 100;
            priceApplies.push(priceApply);
          }
        }

        let bestPrice = Math.min.apply(Math, priceApplies);
        element.html(Shopify.formatMoney(bestPrice));
        $(".bss-custom").css({ visibility: "visible" });
      }
    }
  };
  BSS_B2B.getPriceList = function (shopData, productMap, isCartItem) {
    let priceLists = [];
    let checkUniquePriceLists = [];
    let ruleList = BSS_B2B.configData;
    let customer = shopData.customer;
    ruleList.forEach(function (rule) {
      let applyTo = rule.apply_to;
      let customerIds = rule.customer_ids;
      let customerTags = rule.customer_tags;
      if (applyTo == 0) {
      } else if (applyTo == 1) {
        if (customer.id == null) {
          if (BSS_B2B.storeId == 918) {
            //fix orantek by vitu
            BSS_B2B.printSaveTo(shopData);
          }
          return;
        } else {
        }
      } else if (applyTo == 2) {
        if (customer.id !== null) {
          return;
        } else {
          if (BSS_B2B.storeId == 918) {
            BSS_B2B.printSaveTo(shopData);
          }
        }
      } else if (applyTo == 3) {
        if (customer.id == null) {
          if (BSS_B2B.storeId == 918) {
            BSS_B2B.printSaveTo(shopData);
          }
          return;
        } else {
          customerIds = customerIds.split(",");
          if (customerIds.indexOf(customer.id + "") === -1) {
            return;
          }
        }
      } else if (applyTo == 4) {
        if (customer.tags == null) {
          if (BSS_B2B.storeId == 918) {
            BSS_B2B.printSaveTo(shopData);
          }
          return;
        } else {
          customerTags = customerTags.split(",");
          var checkArray = customerTags.filter((tag) =>
            customer.tags.includes(tag + "")
          );
          if (checkArray.length == 0) {
            if (BSS_B2B.storeId == 918) {
              BSS_B2B.printSaveTo(shopData);
            }
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
      for (let i = 0; i < productMap.length; i++) {
        let productId = productMap[i].id;
        let collections = productMap[i].collections;
        let tags = productMap[i].tags;

        if (conditionType == 0) {
          // all product

          if (checkUniquePriceLists.indexOf(productId) === -1) {
            checkUniquePriceLists.push(productId);
            priceLists.push({
              id: productId,
              discount_type: rule.discount_type,
              value: rule.discount_value,
              key: isCartItem ? productMap[i].key : false,
              name: rule.name,
            });
          }
        } else if (conditionType == 1) {
          if (
            specificProductIds.indexOf(productId + "") !== -1 &&
            checkUniquePriceLists.indexOf(productId) === -1
          ) {
            checkUniquePriceLists.push(productId);
            priceLists.push({
              id: productId,
              discount_type: rule.discount_type,
              value: rule.discount_value,
              key: isCartItem ? productMap[i].key : false,
              name: rule.name,
            });
          }
        } else if (conditionType == 2) {
          var checkArray = collections.filter((collection) =>
            ruleCollectionIds.includes(collection + "")
          );
          if (
            checkArray.length > 0 &&
            checkUniquePriceLists.indexOf(productId) === -1
          ) {
            checkUniquePriceLists.push(productId);
            priceLists.push({
              id: productId,
              discount_type: rule.discount_type,
              value: rule.discount_value,
              key: isCartItem ? productMap[i].key : false,
              name: rule.name,
            });
          }
        } else if (conditionType == 3) {
          var checkArray = ruleTags.filter((tag) => tags.includes(tag + ""));

          if (
            checkArray.length > 0 &&
            checkUniquePriceLists.indexOf(productId) === -1
          ) {
            checkUniquePriceLists.push(productId);
            priceLists.push({
              id: productId,
              discount_type: rule.discount_type,
              value: rule.discount_value,
              key: isCartItem ? productMap[i].key : false,
              name: rule.name,
            });
          }
        } else {
        }
      }
    });

    return priceLists;
  };

  BSS_B2B.getModifiedPrice = function (type, price, realDiscountValue) {
    let modifiedPrice = false;
    if (type == 0) {
      modifiedPrice = realDiscountValue > price ? price : realDiscountValue;
    } else if (type == 1) {
      modifiedPrice = realDiscountValue > price ? 0 : price - realDiscountValue;
    } else if (type == 2) {
      modifiedPrice = price * (1.0 - realDiscountValue / 100);
    }

    return modifiedPrice;
  };

  BSS_B2B.checkVariantExist = function (cartFormElement, variant) {
    var optionStrings = "";
    var selectElements = $(cartFormElement).find(
      "select[data-index], " +
        'select[id^="SingleOption"], ' +
        "select.single-option-selector, " +
        "select[data-option]" +
        BSS_B2B.getCssSelector("product_variant_option_input")
    );
    if (selectElements.length) {
      for (var i = 0; i < selectElements.length; i++) {
        optionStrings += $(selectElements[i]).val();
      }
    } else {
      selectElements = $(cartFormElement).find(
        'input[type="radio"]:checked, input.single-option-selector__radio:checked'
      );
      for (var i = 0; i < selectElements.length; i++) {
        optionStrings += $(selectElements[i]).val();
      }
    }

    var title = variant.title;
    title = title.replace(/\s/g, "");
    title = title.replace(/\//g, "");
    var cartFormId = $(cartFormElement).attr("id");
    var cartFormIdNumber = "";
    if (cartFormId !== undefined) {
      cartFormIdNumber = cartFormId.replace(/\W/g, "");
    }
    var selectedVariant = $(cartFormElement).find(
      "select#ProductSelect--product-template :selected, " +
        "select#ProductSelect--featured-product :selected, " +
        'select[name="id"] :selected, ' +
        'select[id$="' +
        cartFormIdNumber +
        '"] :selected' +
        BSS_B2B.getCssSelector("product_select_variant_input")
    );
    if (selectedVariant.length) {
      var selectedVariantId = selectedVariant.val();
      if (selectedVariantId == variant.id) {
        return true;
      } else {
        return false;
      }
    }
    // else {
    //     if (optionStrings != "" && title.includes(optionStrings)) {
    //         return true;
    //     }
    // }

    return true;
  };
  BSS_B2B.getCartPriceClass = function (cssClass) {
    var cssSelector = BSS_B2B.getCssSelector(cssClass);

    if (cssSelector.indexOf("=itemKey") !== -1) {
      cssSelector = cssSelector.replace(/=itemkey/g, "");
    }

    return cssSelector;
  };
  BSS_B2B.page = {};
  BSS_B2B.page.getPage = function () {
    var hrefArr = window.location.href.split("/");
    return hrefArr;
  };
  BSS_B2B.page.isCartPage = function () {
    var hrefArr = BSS_B2B.page.getPage();
    var isCart =
      hrefArr[hrefArr.length - 1] == "cart" ||
      hrefArr[hrefArr.length - 1].includes("cart");
    return isCart;
  };
  BSS_B2B.page.isCollectionPage = function () {
    var hrefArr = BSS_B2B.page.getPage();
    var isCollectionPage = hrefArr[hrefArr.length - 2] == "collections";
    return isCollectionPage;
  };
  BSS_B2B.page.isProductPage = function () {
    var hrefArr = BSS_B2B.page.getPage();
    var isProductPage = hrefArr[hrefArr.length - 2] == "products";
    return isProductPage;
  };
}
