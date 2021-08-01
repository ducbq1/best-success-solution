import Tax from "../taxexem/tax";
export default function changeProductPrice(
  $,
  BSS_B2B,
  shopData,
  Shopify,
  firstLoadProduct,
  isEnableMc
) {
  BSS_B2B.changeProductPrice = function (
    shopData,
    customAttr,
    cartFormElement
  ) {
    var elements = $(
      "[bss-b2b-product-id][bss-b2b-product-price]:not([bss-b2b-product-active])," +
        "[bss-b2b-product-id][bss-b2b-current-variant-price]:not([bss-b2b-product-active])," +
        "[bss-b2b-product-id][bss-b2b-product-sale-price]:not([bss-b2b-product-active])," +
        "[bss-b2b-product-id][bss-b2b-product-featured-price]:not([bss-b2b-product-active])," +
        "[bss-b2b-product-id][bss-b2b-product-lowest-price]:not([bss-b2b-product-active])," +
        "[bss-b2b-product-id][bss-b2b-product-from-price]:not([bss-b2b-product-active])," +
        "[bss-b2b-product-id][bss-b2b-product-now-price]:not([bss-b2b-product-active])," +
        "[bss-b2b-product-id][bss-b2b-product-min-price]:not([bss-b2b-product-active])," +
        "[bss-b2b-product-id][bss-b2b-product-max-price]:not([bss-b2b-product-active])," +
        "[bss-b2b-product-id][bss-b2b-variant-price]:not([bss-b2b-product-active])," +
        "[bss-b2b-product-id][bss-b2b-product-price]:not([bss-b2b-product-active])" +
        BSS_B2B.getCssSelector("product_sale_price") +
        BSS_B2B.getCssSelector("product_regular_price") +
        BSS_B2B.getCssSelector("product_featured_price") +
        BSS_B2B.getCssSelector("product_compare_price") +
        BSS_B2B.getCssSelector("product_from_price") +
        BSS_B2B.getCssSelector("product_now_price") +
        BSS_B2B.getCssSelector("product_min_price") +
        BSS_B2B.getCssSelector("product_variant_price") +
        BSS_B2B.getCssSelector("product_lowest_price") +
        BSS_B2B.getCssSelector("product_current_variant_price") +
        BSS_B2B.getCssSelector("product_unit_price")
    );
    if (customAttr) {
      elements = $(
        customAttr + "[bss-b2b-product-id]:not([bss-b2b-product-active])"
      );
    }
    if (!(elements.length > 0 || firstLoadProduct)) {
      return;
    } else {
      firstLoadProduct = false;
    }
    elements.attr("bss-b2b-product-active", true);
    var handleUrls = [];
    var handles = [];
    for (var i = 0; i < elements.length; i++) {
      let isLoginPattern = $(elements[i]).find(".bsscommerce-ltsp-message")
        .length;
      if (isLoginPattern) {
        continue;
      }
      var elementProductId = $(elements[i]).attr("bss-b2b-product-id");
      if (!customAttr) {
        if ($(elements[i]).attr("itemprop") == "price") {
        } else {
          $(elements[i]).parent().attr("bss-b2b-product-id", elementProductId);
          $(elements[i]).parent().attr("bss-b2b-product-parent-price", "true");

          if ($(elements[i]).attr("bss-b2b-product-max-price") !== undefined) {
            $(elements[i])
              .parent()
              .parent()
              .attr("bss-b2b-product-max-price", "true");
          }
          if ($(elements[i]).attr("bss-b2b-product-min-price") !== undefined) {
            $(elements[i])
              .parent()
              .parent()
              .attr("bss-b2b-product-min-price", "true");
          }
        }
        //    fix for benki-brewingtools show max min price when change variant options
      } else if (true) {
        if ($(elements[i]).attr("bss-b2b-product-max-price") !== undefined) {
          $(elements[i])
            .parent()
            .parent()
            .attr("bss-b2b-product-max-price", "true");
        }
        if ($(elements[i]).attr("bss-b2b-product-min-price") !== undefined) {
          $(elements[i])
            .parent()
            .parent()
            .attr("bss-b2b-product-min-price", "true");
        }
      }
      if (
        elementProductId &&
        elementProductId != "" &&
        handles.indexOf(elementProductId) === -1
      ) {
        handles.push(elementProductId);
        handleUrls.push('id:"' + elementProductId + '"');
      }
    }
    var urlData = "/search.js?q=" + handleUrls.join(" OR ") + "&view=bss.b2b";
    var encodeUrlData = encodeURI(urlData);
    // fix korresshop-greece by vitu
    if (BSS_B2B.storeId == 1676) {
      var splitIndex = Math.round(handleUrls.length / 2);
      var max = handleUrls.length;
      var firstHalf = encodeURI(
        "/search.js?q=" +
          handleUrls.splice(splitIndex, max - splitIndex + 1).join(" OR ") +
          "&view=bss.b2b"
      );
      var secondtHalf = encodeURI(
        "/search.js?q=" +
          handleUrls.splice(0, max - splitIndex + 1).join(" OR ") +
          "&view=bss.b2b"
      );

      BSS_B2B.changePrice(firstHalf, shopData, customAttr, cartFormElement);
      BSS_B2B.changePrice(secondtHalf, shopData, customAttr, cartFormElement);
    } else {
      BSS_B2B.changePrice(encodeUrlData, shopData, customAttr, cartFormElement);
    }
  };
  BSS_B2B.changePrice = function (
    encodeUrlData,
    shopData,
    customAttr,
    cartFormElement
  ) {
    $.get(encodeUrlData, function (data) {
      var responProd = [];
      try {
        responProd = JSON.parse(data);
      } catch (e) {
        console.log("B2B could not parse data: JSON parse returns no item");
      }

      if (responProd.length > 0) {
        var productMap = [];
        var productPrices = [];
        var checkUnique = [];
        for (var i = 0; i < responProd.length; i++) {
          var pro = responProd[i];
          if (checkUnique.indexOf(pro.id) === -1) {
            checkUnique.push(pro.id);
            productMap.push({
              id: pro.id,
              tags: pro.tags,
              collections: pro.collections,
            });
            productPrices[pro.id] = {
              price: pro.price,
              priceMin: pro.price_min,
              priceMax: pro.price_max,
              compareAtPriceMin: pro.compare_at_price_min,
              compareAtPriceMax: pro.compare_at_price_max,
              variants: pro.variants,
            };
          }
        }

        let priceLists = BSS_B2B.getPriceList(shopData, productMap, false);
        var variant = false;
        var queryArray = BSS_B2B.getQueryArray();

        if (cartFormElement) {
          var variantSelector = $(cartFormElement).find('select[name="id"]');
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

        for (var j = 0; j < priceLists.length; j++) {
          var priceJ = priceLists[j];
          var productId = priceJ.id;
          var discountType = priceJ.discount_type;
          var discountValue = parseFloat(priceJ.value);
          let realDiscountValue = discountValue * 100;
          //Hide save amount for supply theme
          $(
            '[bss-b2b-product-id="' +
              productId +
              '"][bss-b2b-product-saved-amount]'
          )
            .parent()
            .hide();
          $(
            '[bss-b2b-product-id="' +
              productId +
              '"][bss-b2b-product-parent-price]'
          )
            .parent()
            .find(".sale-tag")
            .hide();
          //end
          var priceElement = $(
            '[bss-b2b-product-id="' +
              productId +
              '"][bss-b2b-product-price],' +
              '[bss-b2b-product-id="' +
              productId +
              '"][bss-b2b-current-variant-price],' +
              '[bss-b2b-product-id="' +
              productId +
              '"][bss-b2b-product-sale-price],' +
              '[bss-b2b-product-id="' +
              productId +
              '"][bss-b2b-product-featured-price],' +
              '[bss-b2b-product-id="' +
              productId +
              '"][bss-b2b-variant-price]'
          );

          var lowestPriceElement = $(
            '[bss-b2b-product-id="' +
              productId +
              '"][bss-b2b-product-lowest-price],' +
              '[bss-b2b-product-id="' +
              productId +
              '"][bss-b2b-product-from-price],' +
              '[bss-b2b-product-id="' +
              productId +
              '"][bss-b2b-product-now-price],' +
              '[bss-b2b-product-id="' +
              productId +
              '"][bss-b2b-product-min-price]'
          );

          var highestPriceElement = $(
            '[bss-b2b-product-id="' +
              productId +
              '"][bss-b2b-product-highest-price],' +
              '[bss-b2b-product-id="' +
              productId +
              '"][bss-b2b-product-max-price]'
          );

          var lowestPriceHtmlArr = [];
          if (lowestPriceElement.length > 0) {
            lowestPriceHtmlArr = lowestPriceElement.html();
          }

          var highestPriceHtmlArr = [];
          if (highestPriceElement.length > 0) {
            highestPriceHtmlArr = highestPriceElement.html();
          }

          var price = parseFloat(productPrices[productId].price);
          var currentItemPrices = productPrices[productId];
          if (customAttr) {
            if (currentItemPrices.compareAtPriceMin !== 0) {
              priceElement = $(
                customAttr +
                  '[data-sale-price][bss-b2b-product-id="' +
                  productId +
                  '"]'
              );
            } else {
              priceElement = $(
                customAttr +
                  '[data-regular-price][bss-b2b-product-id="' +
                  productId +
                  '"]'
              );
            }

            if (priceElement.length == 0) {
              priceElement = $(
                customAttr +
                  '[data-sale-price][bss-b2b-product-id="' +
                  productId +
                  '"]'
              );
            }

            // Need to implement select option instead of url
            if (variant) {
              var variants = currentItemPrices.variants;
              if (variants && variants.length) {
                for (var k = 0; k < variants.length; k++) {
                  let currentVariant = variants[k];
                  if (currentVariant.id == variant) {
                    if (
                      currentVariant.price >= currentVariant.compare_at_price
                    ) {
                      if (
                        [181, 1283, 1138, 1289].indexOf(BSS_B2B.storeId) !== -1
                      ) {
                        // Do nothing
                      } else {
                        priceElement = $(
                          '[data-regular-price][bss-b2b-product-id="' +
                            productId +
                            '"],' +
                            '[bss-b2b-variant-price][bss-b2b-product-id="' +
                            productId +
                            '"],' +
                            '[bss-b2b-product-parent-price][bss-b2b-product-id="' +
                            productId +
                            '"]'
                        );
                      }
                    } else {
                      // fix for repairpartners by ThaBi
                      if (
                        [181, 1283, 1183, 1289].indexOf(BSS_B2B.storeId) !== -1
                      ) {
                        // Do nothing
                      } else {
                        priceElement = $(
                          '[data-sale-price][bss-b2b-product-id="' +
                            productId +
                            '"]:not(meta),' +
                            '.product__current-price[bss-b2b-product-id="' +
                            productId +
                            '"]:not(meta),' +
                            '[bss-b2b-variant-price][bss-b2b-product-id="' +
                            productId +
                            '"]:not(meta),' +
                            '[bss-b2b-product-parent-price][bss-b2b-product-id="' +
                            productId +
                            '"]:not(meta)'
                        );
                      }
                    }

                    var currentCartForm = 'form[action*="/cart/add"]';
                    if (cartFormElement) {
                      currentCartForm = $(cartFormElement);
                    }

                    var isExistVariant = BSS_B2B.checkVariantExist(
                      currentCartForm,
                      currentVariant
                    );
                    if (!isExistVariant) {
                      // fix for benki-brewingtools
                      if (
                        BSS_B2B.storeId == 181 ||
                        BSS_B2B.storeId == 13 ||
                        BSS_B2B.storeId == 1138
                      ) {
                        //do nothing
                      } else {
                        priceElement = $(
                          '[data-regular-price][bss-b2b-product-id="' +
                            productId +
                            '"]'
                        );
                      }
                    } else {
                      if (priceElement.length && BSS_B2B.storeId == 181) {
                        Object.keys(priceElement).forEach(function (key) {
                          if (
                            $(priceElement[key]).attr("class") ==
                            "product-item-content"
                          ) {
                            delete priceElement[key];
                          }
                        });
                      }
                    }

                    if (
                      $(
                        '#ProductPrice.product-single__price[data-sale-price][bss-b2b-product-id="' +
                          productId +
                          '"]'
                      ).length
                    ) {
                      priceElement = $(
                        '#ProductPrice.product-single__price[data-sale-price][bss-b2b-product-id="' +
                          productId +
                          '"]'
                      );
                    }
                    //fix ixcor by XuTho add button show price total
                    if (
                      priceElement &&
                      $(priceElement)
                        .closest(".Product__Info")
                        .find("form span[data-money-convertible]").length
                    ) {
                      let nextPriceElement = $(priceElement)
                        .closest(".Product__Info")
                        .find("form span[data-money-convertible]");
                      priceElement.push(nextPriceElement[0]);
                    }
                    price = parseFloat(variants[k].price);
                  }
                }
              }
            } else {
              if (priceElement.length) {
                if (
                  cartFormElement &&
                  $(priceElement).hasClass("gt_product-price--number")
                ) {
                  //Fixed for gemthemes
                  price = parseFloat($(priceElement).attr("data-currentprice"));
                  var currentQuantity = parseInt(
                    $(cartFormElement)
                      .find(".gt_product-quantity--number")
                      .val()
                  );
                  price = price * currentQuantity;
                } else {
                  if (
                    priceElement.find(
                      '[bss-b2b-product-id="' + productId + '"]'
                    ).length
                  ) {
                    priceElement = priceElement.find(
                      '[bss-b2b-product-id="' + productId + '"]'
                    );
                  }
                  var priceElementHtml = priceElement.html();
                  priceElementHtml = priceElementHtml.replace(/\D/g, "");

                  if (BSS_B2B.storeId == 78) {
                    price = parseFloat(priceElementHtml);
                  } else {
                    if (BSS_B2B.storeId !== 77) {
                      price = parseFloat(priceElementHtml) * 100;
                    }
                  }
                }
                // fix for benki-brewingtools
              } else if (BSS_B2B.storeId == 181 || BSS_B2B.storeId == 13) {
                priceElement = $(
                  '[data-regular-price][bss-b2b-product-id="' +
                    productId +
                    '"],' +
                    '[bss-b2b-variant-price][bss-b2b-product-id="' +
                    productId +
                    '"],' +
                    '[bss-b2b-product-parent-price][bss-b2b-product-id="' +
                    productId +
                    '"]'
                );
                if (priceElement.length) {
                  Object.keys(priceElement).forEach(function (key) {
                    if (
                      $(priceElement[key]).attr("class") ==
                      "product-item-content"
                    ) {
                      delete priceElement[key];
                    }
                  });
                }
                let dataId = "#ProductItemJson-" + productId;
                let currentProductSelector = '[data-id="' + dataId + '"]';
                if (
                  priceElement.length &&
                  $(cartFormElement).find(currentProductSelector).length
                ) {
                  priceElementHtml = priceElement.html();
                  priceElementHtml = priceElementHtml.replace(/\D/g, "");
                  price = parseFloat(priceElementHtml) * 100;
                }
              }
            }

            if (priceElement.length == 0) {
              priceElement = $(
                customAttr +
                  '[data-sale-price][bss-b2b-product-id="' +
                  productId +
                  '"]'
              );
            }
          } else {
            if (variant && isProductPage && shopData.product.id == productId) {
              var variants = currentItemPrices.variants;
              if (variants.length == 1) {
                variant = false;
              } else {
                if (variants && variants.length) {
                  for (var k = 0; k < variants.length; k++) {
                    let currentVariant = variants[k];
                    if (currentVariant.id == variant) {
                      if (
                        currentVariant.price >= currentVariant.compare_at_price
                      ) {
                        if (
                          [181, 1283, 1138, 1289].indexOf(BSS_B2B.storeId) !==
                          -1
                        ) {
                          // Do nothing
                        } else {
                          priceElement = $(
                            '[data-regular-price][bss-b2b-product-id="' +
                              productId +
                              '"],' +
                              '[bss-b2b-variant-price][bss-b2b-product-id="' +
                              productId +
                              '"],' +
                              '[bss-b2b-product-parent-price][bss-b2b-product-id="' +
                              productId +
                              '"]'
                          );
                        }
                      } else {
                        if ([181, 1138].indexOf(BSS_B2B.storeId) !== -1) {
                          // Do nothing
                        } else {
                          priceElement = $(
                            '[data-sale-price][bss-b2b-product-id="' +
                              productId +
                              '"],' +
                              '[bss-b2b-current-variant-price][bss-b2b-product-id="' +
                              productId +
                              '"],' +
                              '[bss-b2b-variant-price][bss-b2b-product-id="' +
                              productId +
                              '"]'
                          );
                        }
                      }

                      var currentCartForm = 'form[action*="/cart/add"]';
                      if (cartFormElement) {
                        currentCartForm = $(cartFormElement);
                      }

                      var isExistVariant = BSS_B2B.checkVariantExist(
                        currentCartForm,
                        currentVariant
                      );
                      if (!isExistVariant) {
                        // fix for benki-brewingtools
                        if ([181, 1138].indexOf(BSS_B2B.storeId) !== -1) {
                          // do nothing
                        } else {
                          priceElement = $(
                            '[data-regular-price][bss-b2b-product-id="' +
                              productId +
                              '"]'
                          );
                        }
                      }
                      price = parseFloat(variants[k].price);
                    }
                  }
                }
              }
            }
          }

          var lowestPrice = parseFloat(productPrices[productId].priceMin);
          if (discountType == 0) {
            price = BSS_B2B.getModifiedPrice(0, price, realDiscountValue);
            if (
              cartFormElement &&
              $(priceElement).hasClass("gt_product-price--number")
            ) {
              //Fixed for gemthemes
              var currentQuantity = parseInt(
                $(cartFormElement).find(".gt_product-quantity--number").val()
              );
              price = price * currentQuantity;
            }
            priceElement.html(Shopify.formatMoney(price));
            // multi currency app
            if (isEnableMc) {
              let priceModifiedByCurrencyApp = BSS_B2B.MC.convertPriceByMc(
                price,
                priceElement
              );
              priceElement.html(priceModifiedByCurrencyApp);
            }
            if (lowestPriceElement.length > 0 && lowestPriceHtmlArr) {
              var newlowestPrice = BSS_B2B.getModifiedPrice(
                0,
                lowestPrice,
                realDiscountValue
              );

              if (
                lowestPriceHtmlArr.includes(Shopify.formatMoney(lowestPrice)) ||
                Shopify.formatMoney(lowestPrice).includes(lowestPriceHtmlArr)
              ) {
                lowestPriceHtmlArr = lowestPriceHtmlArr.replace(
                  Shopify.formatMoney(lowestPrice),
                  Shopify.formatMoney(newlowestPrice)
                );
                if (
                  Shopify.formatMoney(lowestPrice).includes(lowestPriceHtmlArr)
                ) {
                  lowestPriceHtmlArr = Shopify.formatMoney(newlowestPrice);
                }
              } else {
                var amountNumber = lowestPriceHtmlArr.replace(/\D/g, "");
                var newlowestPriceRegex = Shopify.formatMoney(
                  newlowestPrice
                ).replace(/[^\d.,]/g, "");
                lowestPriceHtmlArr = lowestPriceHtmlArr.replace(
                  amountNumber,
                  newlowestPriceRegex
                );
              }
              // multi currency app
              if (isEnableMc) {
                $.each(lowestPriceElement, function (index, priceElement) {
                  priceElement = $(priceElement);
                  if (priceElement.children().length > 0) {
                    return true;
                  }
                  let priceModifiedByCurrencyApp = BSS_B2B.MC.convertPriceByMc(
                    newlowestPrice,
                    priceElement
                  );
                  lowestPriceHtmlArr = lowestPriceHtmlArr.replace(
                    Shopify.formatMoney(newlowestPrice),
                    priceModifiedByCurrencyApp
                  );
                  lowestPriceHtmlArr = lowestPriceHtmlArr.replace(
                    "bss-b2b-product-lowest-price",
                    'bss-shop-base-currency="' +
                      newlowestPrice +
                      '" bss-b2b-product-lowest-price'
                  );
                });
              }

              lowestPriceElement.html(lowestPriceHtmlArr);
            }
          } else if (discountType == 1) {
            price = BSS_B2B.getModifiedPrice(1, price, realDiscountValue);
            priceElement.html(Shopify.formatMoney(price));
            // multi currency app
            if (isEnableMc) {
              let priceModifiedByCurrencyApp = BSS_B2B.MC.convertPriceByMc(
                price,
                priceElement
              );
              priceElement.html(priceModifiedByCurrencyApp);
            }

            if (
              lowestPriceElement.length > 0 &&
              lowestPriceHtmlArr.length > 0
            ) {
              var newlowestPrice = BSS_B2B.getModifiedPrice(
                1,
                lowestPrice,
                realDiscountValue
              );
              if (
                lowestPriceHtmlArr.includes(Shopify.formatMoney(lowestPrice)) ||
                Shopify.formatMoney(lowestPrice).includes(lowestPriceHtmlArr)
              ) {
                lowestPriceHtmlArr = lowestPriceHtmlArr.replace(
                  Shopify.formatMoney(lowestPrice),
                  Shopify.formatMoney(newlowestPrice)
                );
                if (
                  Shopify.formatMoney(lowestPrice).includes(lowestPriceHtmlArr)
                ) {
                  lowestPriceHtmlArr = Shopify.formatMoney(newlowestPrice);
                }
              }
              // multi currency app
              if (isEnableMc) {
                $.each(lowestPriceElement, function (index, priceElement) {
                  priceElement = $(priceElement);
                  if (priceElement.children().length > 0) {
                    return true;
                  }
                  let priceModifiedByCurrencyApp = BSS_B2B.MC.convertPriceByMc(
                    newlowestPrice,
                    priceElement
                  );
                  lowestPriceHtmlArr = lowestPriceHtmlArr.replace(
                    Shopify.formatMoney(newlowestPrice),
                    priceModifiedByCurrencyApp
                  );
                  lowestPriceHtmlArr = lowestPriceHtmlArr.replace(
                    "bss-b2b-product-lowest-price",
                    'bss-shop-base-currency="' +
                      newlowestPrice +
                      '" bss-b2b-product-lowest-price'
                  );
                });
              }

              lowestPriceElement.html(lowestPriceHtmlArr);
            }
            if (
              $('.bss-b2b--on-sale[on-sale-product-id="' + productId + '"]')
                .length
            ) {
              let labelName = "Save ";
              let labelColor = "#ee0000";
              if (priceJ.name.match(/\{([^}]+)\}/)) {
                labelName = priceJ.name.match(/\{([^}]+)\}/)[1] + " ";
              }
              if (priceJ.name.match(/\[([^}]+)\]/)) {
                labelColor = priceJ.name.match(/\[([^}]+)\]/)[1];
              }
              $('.bss-b2b--on-sale[on-sale-product-id="' + productId + '"]')
                .css("background", labelColor)
                .html(labelName + Shopify.formatMoney(realDiscountValue))
                .fadeIn(300);
            }
          } else if (discountType == 2) {
            price = BSS_B2B.getModifiedPrice(2, price, discountValue);
            priceElement.html(Shopify.formatMoney(price));

            // multi currency app
            if (isEnableMc) {
              let priceModifiedByCurrencyApp = BSS_B2B.MC.convertPriceByMc(
                price,
                priceElement
              );
              priceElement.html(priceModifiedByCurrencyApp);
            }

            if (BSS_B2B.storeId == 181) {
              // Fix for benki-brewingtools by TaNghi
              // This theme doesn't use lowest price, but it contains  min_price attr
              // This affects to child elements of price wrapper, lost all event listener
            } else {
              if (
                lowestPriceElement.length > 0 &&
                lowestPriceHtmlArr.length > 0
              ) {
                var newlowestPrice = BSS_B2B.getModifiedPrice(
                  2,
                  lowestPrice,
                  discountValue
                );
                if (
                  lowestPriceHtmlArr.includes(
                    Shopify.formatMoney(lowestPrice)
                  ) ||
                  Shopify.formatMoney(lowestPrice).includes(lowestPriceHtmlArr)
                ) {
                  lowestPriceHtmlArr = lowestPriceHtmlArr.replace(
                    Shopify.formatMoney(lowestPrice),
                    Shopify.formatMoney(newlowestPrice)
                  );
                  if (
                    Shopify.formatMoney(lowestPrice).includes(
                      lowestPriceHtmlArr
                    )
                  ) {
                    lowestPriceHtmlArr = Shopify.formatMoney(newlowestPrice);
                  }
                  // multi currency app
                  if (isEnableMc) {
                    $.each(lowestPriceElement, function (index, priceElement) {
                      priceElement = $(priceElement);
                      if (priceElement.children().length > 0) {
                        return true;
                      }
                      let priceModifiedByCurrencyApp = BSS_B2B.MC.convertPriceByMc(
                        newlowestPrice,
                        priceElement
                      );
                      lowestPriceHtmlArr = lowestPriceHtmlArr.replace(
                        Shopify.formatMoney(newlowestPrice),
                        priceModifiedByCurrencyApp
                      );
                      lowestPriceHtmlArr = lowestPriceHtmlArr.replace(
                        "bss-b2b-product-lowest-price",
                        'bss-shop-base-currency="' +
                          newlowestPrice +
                          '" bss-b2b-product-lowest-price'
                      );
                    });
                  }
                }

                lowestPriceElement.html(lowestPriceHtmlArr);
              }
            }

            if (
              $('.bss-b2b--on-sale[on-sale-product-id="' + productId + '"]')
                .length
            ) {
              let labelName = "Save ";
              let labelColor = "#ee0000";
              if (priceJ.name.match(/\{([^}]+)\}/)) {
                labelName = priceJ.name.match(/\{([^}]+)\}/)[1] + " ";
              }
              if (priceJ.name.match(/\[([^}]+)\]/)) {
                labelColor = priceJ.name.match(/\[([^}]+)\]/)[1];
              }
              $('.bss-b2b--on-sale[on-sale-product-id="' + productId + '"]')
                .css("background", labelColor)
                .html(labelName + discountValue + "%")
                .fadeIn(300);
            }

            Tax.bssB2BChangeVatPrice(variant, shopData, price);
          }

          var highestPrice = parseFloat(productPrices[productId].priceMax);

          if (discountType == 0) {
            if (highestPriceElement.length > 0 && highestPriceHtmlArr) {
              var newhighestPrice = BSS_B2B.getModifiedPrice(
                0,
                highestPrice,
                realDiscountValue
              );

              if (
                highestPriceHtmlArr.includes(
                  Shopify.formatMoney(highestPrice)
                ) ||
                Shopify.formatMoney(highestPrice).includes(highestPriceHtmlArr)
              ) {
                highestPriceHtmlArr = highestPriceHtmlArr.replace(
                  Shopify.formatMoney(highestPrice),
                  Shopify.formatMoney(newhighestPrice)
                );
                if (
                  Shopify.formatMoney(highestPrice).includes(
                    highestPriceHtmlArr
                  )
                ) {
                  highestPriceHtmlArr = Shopify.formatMoney(newhighestPrice);
                }
              } else {
                var amountNumber = highestPriceHtmlArr.replace(/\D/g, "");
                highestPriceHtmlArr = highestPriceHtmlArr.replace(
                  amountNumber,
                  newhighestPrice / 100
                );
              }
              highestPriceElement.html(highestPriceHtmlArr);
            }
          } else if (discountType == 1) {
            if (
              highestPriceElement.length > 0 &&
              highestPriceHtmlArr.length > 0
            ) {
              var newhighestPrice = BSS_B2B.getModifiedPrice(
                1,
                highestPrice,
                realDiscountValue
              );
              if (
                highestPriceHtmlArr.includes(
                  Shopify.formatMoney(highestPrice)
                ) ||
                Shopify.formatMoney(highestPrice).includes(highestPriceHtmlArr)
              ) {
                highestPriceHtmlArr = highestPriceHtmlArr.replace(
                  Shopify.formatMoney(highestPrice),
                  Shopify.formatMoney(newhighestPrice)
                );
                if (
                  Shopify.formatMoney(highestPrice).includes(
                    highestPriceHtmlArr
                  )
                ) {
                  highestPriceHtmlArr = Shopify.formatMoney(newhighestPrice);
                }
              }
              highestPriceElement.html(highestPriceHtmlArr);
            }
          } else if (discountType == 2) {
            if (
              highestPriceElement.length > 0 &&
              highestPriceHtmlArr.length > 0
            ) {
              var newhighestPrice = BSS_B2B.getModifiedPrice(
                2,
                highestPrice,
                discountValue
              );
              if (
                highestPriceHtmlArr.includes(
                  Shopify.formatMoney(highestPrice)
                ) ||
                Shopify.formatMoney(highestPrice).includes(highestPriceHtmlArr)
              ) {
                highestPriceHtmlArr = highestPriceHtmlArr.replace(
                  Shopify.formatMoney(highestPrice),
                  Shopify.formatMoney(newhighestPrice)
                );
                if (
                  Shopify.formatMoney(highestPrice).includes(
                    highestPriceHtmlArr
                  )
                ) {
                  highestPriceHtmlArr = Shopify.formatMoney(newhighestPrice);
                }
              }
              highestPriceElement.html(highestPriceHtmlArr);
            }
          }
          // Customize ltdidierlab and didierlabfr by vitu
          // Customize studyphones by ThaBi
          if ([826, 1033, 1138].indexOf(BSS_B2B.storeId) !== -1) {
            if (
              $('.bss-b2b-custom[data-product-id="' + productId + '"]').length
            ) {
              $('.bss-b2b-custom[data-product-id="' + productId + '"]').html(
                Shopify.formatMoney(currentItemPrices.price)
              );
            }
          }
          // fix for wdw-vechta by ThaBi
          if (BSS_B2B.storeId == 664) {
            if (
              $(
                '.bss-b2b-wdw-vechta-origin-price[data-product-id="' +
                  productId +
                  '"]'
              ).length
            ) {
              $(
                '.bss-b2b-wdw-vechta-origin-price[data-product-id="' +
                  productId +
                  '"]'
              ).html(Shopify.formatMoney(currentItemPrices.price));
              $(
                '.bss-b2b-wdw-vechta-origin-price[data-product-id="' +
                  productId +
                  '"]'
              ).css("visibility", "visible");
              $(
                '.bss-b2b-wdw-vechta-origin-price[data-product-id="' +
                  productId +
                  '"]'
              ).css("text-decoration", "line-through");
            }
          }
        }

        // multi currency app
        // check if enable multi currency then waiting for currency change then show price
        if (!isEnableMc) {
          $("[bss-b2b-product-id]").css("visibility", "visible");
          $("[bss-b2b-product-id][bss-b2b-product-parent-price]").show();
        } else {
          let sessionCurrencyCode = sessionStorage.getItem("currentCurrency");
          let sessionCurrencyFormat = sessionStorage.getItem(
            "currentCurrencyFormat"
          );
          BSS_B2B.MC.preConvertCurrency(
            sessionCurrencyCode,
            sessionCurrencyFormat
          );
        }
        $("[bss-b2b-product-id]").css("visibility", "visible");
        $("[bss-b2b-product-id][bss-b2b-product-parent-price]").show();

        //fix ixcor b by XuTho, show price in button
        if (BSS_B2B.storeId == 324) {
          $("span[data-money-convertible]").show();
        }
        if (BSS_B2B.storeId == 778) {
          $("span[bss-b2b-product-parent-price]").show();
        }
        if (BSS_B2B.storeId == 1283) {
          $("[bss-b2b-product-price]").show();
        }
      }
    });
  };
  BSS_B2B.applyChangePriceForMultiCarform = function () {
    //Apply to multiple cart page at here
    var cartForm = $(
      'form[action*="/cart/add"],' +
        'form[action*="/checkout"]' +
        BSS_B2B.getCssSelector("product_cart_form")
    );

    if (cartForm.length) {
      var delayTime = 300;
      var productSelectVariantDelayTime = BSS_B2B.getCssSelector(
        "product_time_delay_change_variant"
      );
      if (
        productSelectVariantDelayTime != "" &&
        !isNaN(productSelectVariantDelayTime)
      ) {
        delayTime = parseInt(productSelectVariantDelayTime);
      }
      for (var i = 0; i < cartForm.length; i++) {
        var cartFormI = $(cartForm[i]);
        var id = cartFormI.attr("id");
        cartFormI = $("#" + id);
        var selectElement = cartFormI.find(
          "select, " +
            "input.single-option-selector__radio" +
            BSS_B2B.getCssSelector("product_variant_option_input")
        );
        //selectElement.off()
        if (selectElement.length) {
          for (var k = 0; k < selectElement.length; k++) {
            var element = $(selectElement[k]);
            element.attr("data-cart-form", id);

            element.on("change", function () {
              // fix for sesoignernature by ThaBi
              if (BSS_B2B.storeId == 1608) {
                $(".money[data-sale-price][bss-b2b-product-price]").css(
                  "visibility",
                  "hidden"
                );
              }
              var currentCartForm = $("#" + $(this).attr("data-cart-form"));
              var correctParent = currentCartForm.parent().parent();
              if (currentCartForm.closest(".product-main").length) {
                correctParent = $(currentCartForm.closest(".product-main"));
              }
              currentCartForm
                .parent()
                .parent()
                .find("[bss-b2b-product-id][bss-b2b-product-parent-price]")
                .hide();
              setTimeout(function () {
                correctParent
                  .find("[bss-b2b-product-id][bss-b2b-product-parent-price]")
                  .removeAttr("bss-b2b-product-active");
                correctParent
                  .find("[bss-b2b-product-id][bss-b2b-product-parent-price]")
                  .hide();
                if (BSS_B2B.storeId == 778) {
                  BSS_B2B.changeProductPrice(shopData, null, currentCartForm);
                } else {
                  BSS_B2B.changeProductPrice(
                    shopData,
                    "." +
                      correctParent.attr("class").split(" ")[0] +
                      " [bss-b2b-product-parent-price]",
                    currentCartForm
                  );
                }
              }, delayTime);

              setTimeout(function () {
                BSS_B2B.makeCloneBuyItNow(currentCartForm);
              }, delayTime * 3);
            });
          }
        }

        var ajaxCartButton = cartFormI.find(
          '[id^="AddToCart"]:not(form),' +
            'button[aria-controls="CartDrawer"],' +
            'a[aria-controls="CartDrawer"], ' +
            'button[name="add"].product-form__add-to-cart,' +
            'button[name="add"].product__add-to-cart-button,' +
            'button[name="add"].add-to-cart,' +
            "a.ajax-cart__toggle," +
            "a.cart-toggle," +
            "button.product-form--atc-button," +
            "button.productitem--action-atc," +
            "#add-to-cart-product-template-quick" +
            BSS_B2B.getCssSelector("ajax_cart_action_button")
        );
        if (ajaxCartButton.length) {
          ajaxCartButton.attr("data-cart-form", id);
          $(ajaxCartButton).on("click", function () {
            var ajaxCartDelayTime = 1500;
            var customAjaxCartDelayTime = BSS_B2B.getCssSelector(
              "ajax_cart_time_delay_opening_cart"
            );
            if (
              customAjaxCartDelayTime != "" &&
              !isNaN(customAjaxCartDelayTime)
            ) {
              ajaxCartDelayTime = parseInt(customAjaxCartDelayTime);
            }
            BSS_B2B.makeChangesAfterClickAjaxcart(ajaxCartDelayTime);
            var currentCartForm = $("#" + $(this).attr("data-cart-form"));
            setTimeout(function () {
              BSS_B2B.makeCloneBuyItNow(currentCartForm);
            }, delayTime * 3);
          });
        }
        //Fixed for gemtheme
        var variantButtons = cartFormI.find(".gt_swatches--select");
        if (variantButtons.length) {
          let sectionId = id.split("_");
          let sectionElement = $(
            'script[data-id="' + sectionId[sectionId.length - 1] + '"]'
          ).parent();
          variantButtons = $(sectionElement).find(
            ".gt_swatches--select, " +
              ".item.gt_product-carousel--item, " +
              ".gt_product-quantity--minus, " +
              ".gt_product-quantity--plus"
          );
          for (var k = 0; k < variantButtons.length; k++) {
            var element = $(variantButtons[k]);
            element.attr("data-cart-form", id);
            element.on("click", function () {
              var currentCartForm = $("#" + $(this).attr("data-cart-form"));
              currentCartForm
                .parent()
                .parent()
                .find("[bss-b2b-product-id][bss-b2b-product-parent-price]")
                .hide();
              setTimeout(function () {
                currentCartForm
                  .parent()
                  .parent()
                  .find("[bss-b2b-product-id][bss-b2b-product-parent-price]")
                  .removeAttr("bss-b2b-product-active");
                BSS_B2B.changeProductPrice(
                  shopData,
                  "." +
                    currentCartForm
                      .parent()
                      .parent()
                      .attr("class")
                      .split(" ")[0] +
                    " [bss-b2b-product-parent-price]",
                  currentCartForm
                );
              }, delayTime);

              setTimeout(function () {
                BSS_B2B.makeCloneBuyItNow(currentCartForm);
              }, delayTime * 3);
            });
          }
        }
        //    end
      }
    }
  };
  BSS_B2B.applyChangePriceForCollectionPage = function () {
    //Apply to multiple product variant
    var cartForm = $(
      'form[action*="/cart/add"]' + BSS_B2B.getCssSelector("product_cart_form")
    );
    if (cartForm.length) {
      var delayTime = 300;
      var productSelectVariantDelayTime = BSS_B2B.getCssSelector(
        "product_time_delay_change_variant"
      );
      if (
        productSelectVariantDelayTime != "" &&
        !isNaN(productSelectVariantDelayTime)
      ) {
        delayTime = parseInt(productSelectVariantDelayTime);
      }
      for (var i = 0; i < cartForm.length; i++) {
        let productItem = $(cartForm[i]).closest(".product-item-content");

        if (!productItem.length) {
          productItem = $(cartForm[i]);
        }

        let variantProduct = $(productItem).find(".product-item-option");

        if (!variantProduct.length) {
          variantProduct = $(productItem).find(".select");
        }
        // fix for southeastedibles2020 (madu)
        if (BSS_B2B.storeId == 243) {
          variantProduct = $(productItem).find(
            ".variant-input-wrap .variant-input input"
          );
        }

        if (productItem.length && variantProduct.length) {
          //shop purefemale-add event change varian in collection page
          if (BSS_B2B.storeId == 181) {
            var selectElement = $(variantProduct).find(
              "select.single-option-selector"
            );
            let hasSwatchElements = $(variantProduct).find(
              ".wrapper-swatches-product-item"
            );

            if (selectElement.length) {
              selectElement.on("change", function () {
                let $currentItem = productItem;
                var currentCartForm = $($currentItem);
                var correctParent = $($currentItem).closest(
                  ".product-single__meta"
                );
                currentCartForm
                  .find("[bss-b2b-product-id][bss-b2b-product-parent-price]")
                  .hide();
                setTimeout(function () {
                  currentCartForm
                    .find("[bss-b2b-product-id][bss-b2b-product-parent-price]")
                    .removeAttr("bss-b2b-product-active");
                  currentCartForm
                    .find("[bss-b2b-product-id][bss-b2b-product-parent-price]")
                    .hide();
                  BSS_B2B.changeProductPrice(
                    shopData,
                    "." +
                      currentCartForm.attr("class").split(" ")[0] +
                      " [bss-b2b-product-parent-price]",
                    currentCartForm
                  ); //call function show new price
                }, 1000);
              });
            }

            if (hasSwatchElements.length) {
              let swatchElements = $(hasSwatchElements).find(".swatch-element");
              if (swatchElements.length) {
                swatchElements.on("click", function () {
                  let $currentItem = productItem;
                  var currentCartForm = $($currentItem);
                  var correctParent = $($currentItem).closest(
                    ".product-single__meta"
                  );
                  currentCartForm
                    .find("[bss-b2b-product-id][bss-b2b-product-parent-price]")
                    .hide();
                  setTimeout(function () {
                    currentCartForm
                      .find(
                        "[bss-b2b-product-id][bss-b2b-product-parent-price]"
                      )
                      .removeAttr("bss-b2b-product-active");
                    currentCartForm
                      .find(
                        "[bss-b2b-product-id][bss-b2b-product-parent-price]"
                      )
                      .hide();
                    BSS_B2B.changeProductPrice(
                      shopData,
                      "." +
                        currentCartForm.attr("class").split(" ")[0] +
                        " [bss-b2b-product-parent-price]",
                      currentCartForm
                    ); //call function show new price
                  }, 1000);
                });
              }
            }
          }
          // fix for southeastedibles2020 (madu)
          else if (BSS_B2B.storeId == 243) {
            var selectElement = $(variantProduct);
            if (selectElement.length) {
              selectElement.on("change", function () {
                let $currentItem = productItem;
                var currentCartForm = $($currentItem);
                var correctParent = $($currentItem).closest(
                  ".product-single__meta"
                );
                currentCartForm
                  .closest(".product-single__meta")
                  .find("[bss-b2b-product-id][bss-b2b-product-parent-price]")
                  .hide();
                setTimeout(function () {
                  correctParent
                    .find("[bss-b2b-product-id][bss-b2b-product-parent-price]")
                    .removeAttr("bss-b2b-product-active");
                  correctParent
                    .find("[bss-b2b-product-id][bss-b2b-product-parent-price]")
                    .hide();
                  BSS_B2B.changeProductPrice(
                    shopData,
                    "." +
                      correctParent.attr("class").split(" ")[0] +
                      " [bss-b2b-product-parent-price]",
                    currentCartForm
                  ); //call function show new price
                }, delayTime);
              });
            }
          } else {
            var selectElement = $(variantProduct).find(
              "select.single-option-selector-item"
            );
            if (selectElement.length) {
              selectElement.on("change", function () {
                let $currentItem = $(this).closest(".product-item-content");
                var currentCartForm = $($currentItem);
                var correctParent = $($currentItem);
                currentCartForm
                  .find("[bss-b2b-product-id][bss-b2b-product-parent-price]")
                  .hide();
                setTimeout(function () {
                  correctParent
                    .find("[bss-b2b-product-id][bss-b2b-product-parent-price]")
                    .removeAttr("bss-b2b-product-active");
                  correctParent
                    .find("[bss-b2b-product-id][bss-b2b-product-parent-price]")
                    .hide();
                  BSS_B2B.changeProductPrice(
                    shopData,
                    "." +
                      correctParent.attr("class").split(" ")[0] +
                      " [bss-b2b-product-parent-price]",
                    currentCartForm
                  );
                }, delayTime);
              });
            }
          }
        }
        //    end
      }
    }
  };
  BSS_B2B.handleChangeQuantityEventFirstTime = function (
    timeDelayToReCalculate,
    timeDelayToChangeQuantity
  ) {
    $(
      "[bss-b2b-item-price]," +
        "[bss-b2b-cart-item-key]," +
        "[data-cart-item-regular-price], " +
        +"[data-cart-subtotal]," +
        "[bss-b2b-ajax-cart-subtotal]" +
        BSS_B2B.getCartPriceClass("cart_total") +
        BSS_B2B.getCartPriceClass("cart_subtotal") +
        BSS_B2B.getCartPriceClass("cart_item_regular_price") +
        BSS_B2B.getCartPriceClass("cart_item_original_price")
    ).hide();
    $(
      'form[action*="/cart"] input[type="number"], ' +
        'form[action*="/cart"] input[data-quantity-input],' +
        'form[action*="/cart"] input[data-cart-item-input-quantity],' +
        'form[action*="/cart"] input.js-qty__input,' +
        ".cart-wrapper input.quantity-selector__value" +
        BSS_B2B.getCartPriceClass("cart_quantity_input")
    ).prop("disabled", true);

    //Fix for dnd-dice
    var checkoutButton = $(
      '.cart-wrapper button.cart-recap__checkout[name="checkout"][type="submit"]'
    );
    if (checkoutButton.length > 0) {
      setTimeout(function () {
        BSS_B2B.cart.fixer(shopData, true);
        BSS_B2B.handleCartCheckoutBtn(shopData);
      }, 4000);
    }
    if (BSS_B2B.configData && BSS_B2B.configData.length) {
      $(
        "[bss-b2b-item-price]," +
          "[bss-b2b-cart-item-key]," +
          "[data-cart-item-regular-price], " +
          +"[data-cart-subtotal]," +
          "[bss-b2b-ajax-cart-subtotal]" +
          BSS_B2B.getCartPriceClass("cart_total") +
          BSS_B2B.getCartPriceClass("cart_subtotal") +
          BSS_B2B.getCartPriceClass("cart_item_regular_price") +
          BSS_B2B.getCartPriceClass("cart_item_original_price")
      ).hide();
      $(
        'form[action="/cart"] input[type="number"], ' +
          'form[action="/cart"] input[data-quantity-input],' +
          'form[action="/cart"] input[data-cart-item-input-quantity],' +
          'form[action="/cart"] input.js-qty__input' +
          BSS_B2B.getCartPriceClass("cart_quantity_input")
      ).prop("disabled", true);

      setTimeout(function () {
        BSS_B2B.cart.fixer(shopData, true);
      }, timeDelayToReCalculate);

      $(
        "[bss-b2b-item-price], " +
          "[bss-b2b-cart-item-key], " +
          "[bss-b2b-ajax-cart-subtotal] " +
          BSS_B2B.getCartPriceClass("cart_item_regular_price") +
          BSS_B2B.getCartPriceClass("cart_item_original_price")
      ).fadeIn(timeDelayToChangeQuantity);
    }

    setTimeout(function () {
      $(
        'form[action*="/cart"] input[type="number"], ' +
          'form[action*="/cart"] input[data-quantity-input],' +
          'form[action*="/cart"] input[data-cart-item-input-quantity],' +
          'form[action*="/cart"] input.js-qty__input,' +
          ".cart-wrapper input.quantity-selector__value" +
          BSS_B2B.getCartPriceClass("cart_quantity_input")
      ).prop("disabled", false);
    }, timeDelayToChangeQuantity);
  };
  BSS_B2B.changeVariantOptionProductPage = function (parentLevel2, cartForm) {
    var priceInCartForm = $(parentLevel2).find(
      "" + "[bss-b2b-product-id][bss-b2b-product-parent-price]"
    );
    if (BSS_B2B.storeId == 324) {
      priceInCartForm = $(parentLevel2).find(
        "" +
          "[bss-b2b-product-id][bss-b2b-product-parent-price]," +
          "[data-money-convertible]"
      );
    }
    if (BSS_B2B.storeId == 778) {
      priceInCartForm = $(parentLevel2)
        .parent()
        .find("" + "[bss-b2b-product-id][bss-b2b-product-parent-price]");
    }

    if (BSS_B2B.storeId == 1283) {
      priceInCartForm = $(parentLevel2)
        .closest(".product_single_detail_section")
        .find("[bss-b2b-product-id][bss-b2b-product-price]");
    }

    if (priceInCartForm.length == 0) {
      parentLevel2 = $(parentLevel2).parent().parent();
      priceInCartForm = parentLevel2.find(
        "" + "[bss-b2b-product-id][bss-b2b-product-parent-price]"
      );
    }

    priceInCartForm.hide();
    priceInCartForm.css("visibility", "hidden");
    var delayTime = 200;
    var productSelectVariantDelayTime = BSS_B2B.getCssSelector(
      "product_time_delay_change_variant"
    );
    if (
      productSelectVariantDelayTime != "" &&
      !isNaN(productSelectVariantDelayTime)
    ) {
      delayTime = parseInt(productSelectVariantDelayTime);
    }
    setTimeout(function () {
      priceInCartForm.removeAttr("bss-b2b-product-active");
      if (BSS_B2B.storeId == 778 || BSS_B2B.storeId == 1283) {
        BSS_B2B.changeProductPrice(shopData, null, false);
      } else if (BSS_B2B.storeId == 1138) {
        // fix for studyphones by ThaBi
        $("[bss-b2b-product-id][bss-b2b-product-parent-price]").removeAttr(
          "bss-b2b-product-active"
        );
        $("[bss-b2b-product-id][bss-b2b-product-price]").removeAttr(
          "bss-b2b-product-active"
        );
        BSS_B2B.changeProductPrice(shopData, null, false);
      } else {
        BSS_B2B.changeProductPrice(
          shopData,
          "." +
            parentLevel2.attr("class").split(" ")[0] +
            " [bss-b2b-product-parent-price]",
          false
        );
      }
    }, delayTime);
    setTimeout(function () {
      BSS_B2B.makeCloneBuyItNow(cartForm);
    }, delayTime * 2);

    // fix for https://screenshelf.ie/ by Tuli and ThaBi
    if (BSS_B2B.storeId == 918) {
      setTimeout(function () {
        if ($(".tot_price").length) {
          let newPrice = $(".tot_price").html();
          let newPriceFormat = newPrice.replace(/^\D+/g, "");
          BSS_B2B.printSaveTo(shopData, newPriceFormat);
        }
      }, delayTime * 5);
    }
  };
}
