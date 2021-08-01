const Tax = require("../taxexem/tax");
export default function modifyCheckout($, BSS_B2B, shopData, isEnableAMO) {
  var modalAMO =
    "<div id='modalWarningAMO'>\n" +
    "<div class='bss-modal-warning-amo-wrap' tabindex='-1'>" +
    "<div>" +
    "<div class='bss-modal-amo active'>" +
    "<div clas='bss-modal-amo-header' style='padding: 10px; background: " +
    BSS_B2B.amoSettings.headerBackgroundColor +
    ";'>" +
    "<button title='Close (Esc)' type='button' class='bss-modal-button-close'>×</button>" +
    "<b class='bss-modal-amo-title' style='margin-left: 12px; color: " +
    BSS_B2B.amoSettings.headerTextColor +
    "'>" +
    BSS_B2B.amoTranslations.warning_text +
    "</b>\n" +
    "</div>" +
    "<div clas='bss-modal-amo-body' style='padding: 18px; background: " +
    BSS_B2B.amoSettings.contentBackgroundColor +
    "; color: " +
    BSS_B2B.amoSettings.contentTextColor +
    "'>" +
    "<div class='bss-amo-list-warning'>" +
    "<span class='bss-warning-quantity-title'>" +
    BSS_B2B.amoTranslations.at_least_text;
  if (BSS_B2B.storeId == 437) {
    modalAMO += "</span>";
  } else {
    modalAMO += ": </span>";
  }
  modalAMO +=
    "<ol class='bss-amo-list-warning-quantity'>\n" +
    "</ol>\n" +
    "<span class='bss-warning-amount-title'>" +
    BSS_B2B.amoTranslations.warning_minimum_order_text;
  if (BSS_B2B.storeId == 437) {
    modalAMO += "</span>";
  } else {
    modalAMO += ": </span>";
  }
  modalAMO +=
    "<ol class='bss-amo-list-warning-amount'>\n" +
    "</ol>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class='bss-amo-modal-bg active'></div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>";

  BSS_B2B.optimizeCartData = function (cartData) {
    let newCartData = cartData;
    //delete newCartData.attributes;
    delete newCartData.cart_level_discount_applications;
    delete cartData.currency;
    let newItems = [];
    cartData.items.forEach(function (item) {
      newItems.push({
        id: item.id,
        key: item.key,
        price: item.price,
        quantity: item.quantity,
        variant_id: item.variant_id,
        product_id: item.product_id,
        taxable: item.taxable,
      });
    });
    newCartData.items = newItems;
    return newCartData;
  };
  BSS_B2B.createCheckout = function (
    domain,
    cartData,
    updatedLineItems,
    qbPricingList,
    oldCheckoutBtn,
    oldHtml,
    oldInputVal,
    customFieldValue
  ) {
    let cdata = BSS_B2B.optimizeCartData(cartData);
    $.ajax({
      url: bssB2bApiServer + "/checkout/create",
      data: {
        domain: domain,
        order: cdata,
        updatedLineItems,
        qbPricingList: qbPricingList,
        shopModules: BSS_B2B.shopModules,
        customFieldValue: customFieldValue,
      },
      dataType: "json",
      type: "POST",
      success: function (data) {
        if (data.success) {
          window.location = data.orderData.invoiceUrl;
        } else {
          $(oldCheckoutBtn).removeAttr("disabled");
          if (oldHtml == null) {
            $(oldCheckoutBtn).val(oldInputVal);
          } else {
            $(oldCheckoutBtn).html(oldHtml);
          }
          console.log(data.message);
        }
      },
      error: function (err) {
        $(oldCheckoutBtn).removeAttr("disabled");
        if (oldHtml == null) {
          $(oldCheckoutBtn).val(oldInputVal);
        } else {
          $(oldCheckoutBtn).html(oldHtml);
        }
        console.log("Could not create checkout:", err);
      },
    });
  };

  /**
   *
   * @param shopData
   * @param vatNumber includes country code
   * @param oldCheckoutBtn
   * @param self point to checkout button
   * @param isDone
   * @param isEnabledVatValidate  whether or not TaxExempt is enabled.
   */
  BSS_B2B.modifyCartDataAndCreateCheckout = function (
    shopData,
    vatNumber,
    oldCheckoutBtn,
    self,
    isDone,
    isEnabledVatValidate,
    customFieldValue
  ) {
    let oldInputVal = null;
    let oldHtml = null;

    if ($(self).is("input")) {
      oldInputVal = $(self).val();
    } else {
      oldHtml = $(self).html();
    }
    if (isDone) {
      return;
    }
    $.ajax({
      url: "/cart.js",
      type: "GET",
      dataType: "json",
      success: function (cartData) {
        let cartAttributes = cartData.attributes;
        if (vatNumber) {
          cartAttributes["vat-id"] = vatNumber;
          cartAttributes["taxExempt"] = true;
          cartData.attributes = cartAttributes;
        }
        if (cartData.items && cartData.items.length > 0) {
          var domain = shopData.shop.permanent_domain;

          var productMap = [];
          var handleUrls = [];
          var handles = [];
          var keyIdMap = [];
          var cartItemProductMap = new Map();
          cartData.items.forEach(function (item) {
            var proId = item.product_id;
            if (handles.indexOf(proId) === -1) {
              handles.push(proId);
              handleUrls.push('id:"' + proId + '"');
              keyIdMap[proId] = item.key;
            }

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
                  productMap.push({
                    id: pro.id,
                    tags: pro.tags,
                    collections: pro.collections,
                    key: keyIdMap[pro.id],
                  });
                }
              }
              let qbPricingList = BSS_B2B.qb.getPriceList(
                productMap,
                cartItemProductMap
              );
              var updatedLineItems = BSS_B2B.getPriceList(
                shopData,
                productMap,
                true
              );

              var items = [];
              for (var l = 0; l < updatedLineItems.length; l++) {
                var updatedLineItem = updatedLineItems[l];
                for (var k = 0; k < cartData.items.length; k++) {
                  var cartItem = cartData.items[k];
                  if (cartItem.product_id == updatedLineItem.id) {
                    if (cartItem.key != updatedLineItem.key) {
                      var cloneItem = {
                        id: updatedLineItem.id,
                        discount_type: updatedLineItem.discount_type,
                        value: updatedLineItem.value,
                        key: cartItem.key,
                      };
                      items.push(cloneItem);
                    }
                  }
                }
              }

              for (var m = 0; m < items.length; m++) {
                updatedLineItems.push(items[m]);
              }

              if (
                updatedLineItems.length > 0 ||
                qbPricingList.length > 0 ||
                isEnabledVatValidate
              ) {
                $(oldCheckoutBtn).attr("disabled", "disable");
                if ($(oldCheckoutBtn).is("input")) {
                  $(oldCheckoutBtn).val("Processing");
                } else {
                  $(oldCheckoutBtn).html(
                    '<div style="display: flex;"><span style="visibility: hidden;width: 0;">sdad</span><div class="bss-loader"></div></div>'
                  );
                }
                BSS_B2B.createCheckout(
                  domain,
                  cartData,
                  updatedLineItems,
                  qbPricingList,
                  oldCheckoutBtn,
                  oldHtml,
                  oldInputVal,
                  customFieldValue
                );
              } else {
                isDone = true;
                $(oldCheckoutBtn).removeAttr("disabled");
                if (oldHtml == null) {
                  $(oldCheckoutBtn).val(oldInputVal);
                } else {
                  $(oldCheckoutBtn).html(oldHtml);
                }
                let checkoutBtn = $('form[action*="/cart"] [name="checkout"]');
                if (checkoutBtn.length == 0) {
                  document.getElementById("checkout").click();
                } else {
                  $(checkoutBtn).trigger("click");
                }
              }
            }
          });
        } else {
          console.log("Could not get cart data");
          $(oldCheckoutBtn).removeAttr("disabled");
          if (oldHtml == null) {
            $(oldCheckoutBtn).val(oldInputVal);
          } else {
            $(oldCheckoutBtn).html(oldHtml);
          }
        }
      },
      error: function (err) {
        console.log("Could not get cart data:", err);
        $(oldCheckoutBtn).removeAttr("disabled");
        if (oldHtml == null) {
          $(oldCheckoutBtn).val(oldInputVal);
        } else {
          $(oldCheckoutBtn).html(oldHtml);
        }
      },
    });
  };
  (BSS_B2B.handleCartCheckoutBtn = function (shopData) {
    var checkoutButton = $(
      'form[action*="/cart"] [name="checkout"],' +
        "#dropdown-cart button.btn.btn-checkout.show," +
        'a.button.checkout-button[href="/checkout"],' +
        'form[action*="/checkout"] .add_to_cart,' +
        'form[action*="/cart"]#cart_form #checkout,' +
        'form[action*="/cart"] button.Cart__Checkout,' +
        'form[action*="/cart"] button.cart__checkout,' +
        'a.btn.disabled.ttmodalbtn[href="/checkout"],' +
        'form[action*="/cart"] [name="checkout"][type="submit"],' +
        // fix for wdw by ThaBi
        "button.Cart__Checkout.Button.Button--primary.Button--full," +
        // fix for epair-partners-wholesale-retail by ThaBi
        ".baskettop button.mini-cart-checkout," +
        ".tt-dropdown-menu .btn.itemCheckout," +
        // fix for shop.repairpartners by ThaBi
        ".bss-btn-checkout-mini-cart," +
        // fix for theme Boundless by XuTho
        'button[name="checkout"].btn,' +
        // fix korresshop-greece by vitu
        'form[action*="/checkout"] [name="checkout"]'
    );

    var isDone = false;

    checkoutButton.on("click", function (e) {
      $(this).off();
      let self = this;
      let parentForm = $(this).closest("form");
      e.preventDefault();
      e.stopPropagation();
      let isEnabledVatValidate = false;

      if (BSS_B2B.shopModules && BSS_B2B.shopModules.length) {
        BSS_B2B.shopModules.forEach(function (md) {
          if (md.code == "tax_exempt") {
            isEnabledVatValidate = md.status;
          }
        });
      }
      let customFieldValue = [];
      let customFields = $(
        ".bss-b2b-custom-fields textarea, .cart-note textarea"
      );
      if (customFields.length) {
        for (var i = 0; i < customFields.length; i++) {
          var element = {
            key: customFields[i].className,
            value: customFields[i].value,
          };
          customFieldValue.push(element);
        }
      }
      var cartNote = $(this)
        .closest(`form[action="/cart"]`)
        .find(".cart-footer__note-input");
      if (cartNote.length) {
        customFields.push({
          key: "cart note",
          value: cartNote.val(),
        });
      }
      let oldCheckoutBtn = self;

      let vatNumber = "";
      let inputTaxElement = $(
        '.bss-b2b-tax-ex-wrapper input[name="bss-b2b-eu-tax"]'
      );
      let taxExMessage = $(".bss-b2b-tax-ex-message");

      if (parentForm.length) {
        if (
          $(parentForm).find(
            '.bss-b2b-tax-ex-wrapper input[name="bss-b2b-eu-tax"]'
          ).length
        ) {
          inputTaxElement = $(parentForm).find(
            '.bss-b2b-tax-ex-wrapper input[name="bss-b2b-eu-tax"]'
          );
        }
        if ($(parentForm).find(".bss-b2b-tax-ex-message").length) {
          taxExMessage = $(parentForm).find(".bss-b2b-tax-ex-message");
        }
      }

      if ($(inputTaxElement).length) {
        vatNumber = $(inputTaxElement).val();
      }

      let validateVat = Tax.clientValidateVat(vatNumber);
      if (isEnableAMO && BSS_B2B.amo.warning.length > 0) {
        if (!$("#modalWarningAMO").length) {
          $("body").prepend(modalAMO);
          if ($(".bss-amo-list-warning").length) {
            BSS_B2B.amo.warning.forEach((item) => {
              if (item.includes("data-warning-quantity")) {
                $(".bss-warning-quantity-title").show();
                if (BSS_B2B.storeId == 437) {
                } else {
                  $(".bss-amo-list-warning-quantity").prepend(item);
                }
              } else if (item.includes("data-warning-amount")) {
                $(".bss-warning-amount-title").show();
                if (BSS_B2B.storeId == 437) {
                } else {
                  $(".bss-amo-list-warning-amount").prepend(item);
                }
              }
            });
          }
          $(".bss-modal-button-close").on("click", function () {
            $("#modalWarningAMO").remove();
            BSS_B2B.handleCartCheckoutBtn(shopData);
          });
        }
      } else {
        if (
          (isEnabledVatValidate &&
            bssB2BIsRequiredVat &&
            inputTaxElement.length) ||
          (isEnabledVatValidate &&
            !bssB2BIsRequiredVat &&
            vatNumber &&
            vatNumber != "")
        ) {
          let errorMessage = $(taxExMessage).attr("data-error-message");
          let successMessage = $(taxExMessage).attr("data-success-message");
          if (!validateVat) {
            $(taxExMessage).html(
              "<p class='bss-b2b-tax-invalid' style='color: orangered; margin-top: 5px'>" +
                "<span style='font-size: 20px; color: orangered; border: 1px orangered solid; border-radius: 50%; width: 40px; height: 40px; padding: 0 4px'>&#10005;</span> " +
                errorMessage +
                "</p>"
            );
            BSS_B2B.handleCartCheckoutBtn(shopData);
            return;
          } else {
            $(self).attr("disabled", "true");
            let countryCode = vatNumber.substr(0, 2);
            let correctVatNumber = vatNumber.replace(countryCode, "");
            let data = {
              domain: shopData.shop.permanent_domain,
              countryCode: countryCode,
              vatNumber: correctVatNumber,
            };
            if (!BSS_B2B.validateVatSuccess) {
              fetch(bssB2bApiServer + "/wholesaler/check-valid-vat", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
              })
                .then((response) => response.json())
                .then(function (data) {
                  if (data.success && data.message.valid[0] !== "false") {
                    $(taxExMessage).html(
                      "<p class='bss-b2b-tax-valid' style='color: green; margin-top: 5px'>" +
                        "<span style='font-size: 20px; color: green; border: 1px green solid; border-radius: 50%; width: 40px; height: 40px; padding: 0 4px'>&#10003;</span> " +
                        successMessage +
                        "</p>"
                    );
                    if (bssB2BAutoRedirectToCheckout) {
                      BSS_B2B.modifyCartDataAndCreateCheckout(
                        shopData,
                        vatNumber,
                        oldCheckoutBtn,
                        self,
                        isDone,
                        true,
                        customFieldValue
                      );
                      return;
                    } else {
                      $(self).removeAttr("disabled");
                      BSS_B2B.validateVatSuccess = true;
                      $(inputTaxElement).on("change", function () {
                        let newVatNumber = $(
                          '.bss-b2b-tax-ex-wrapper input[name="bss-b2b-eu-tax"]'
                        ).val();
                        if (newVatNumber != vatNumber) {
                          BSS_B2B.validateVatSuccess = false;
                        }
                      });
                      BSS_B2B.handleCartCheckoutBtn(shopData);
                    }
                  } else {
                    $(taxExMessage).html(
                      "<p class='bss-b2b-tax-invalid' style='color: orangered; margin-top: 5px'>" +
                        "<span style='font-size: 20px; color: orangered; border: 1px orangered solid; border-radius: 50%; width: 40px; height: 40px; padding: 0 4px'>&#10005;</span> " +
                        errorMessage +
                        "</p>"
                    );
                    $(self).removeAttr("disabled");
                    BSS_B2B.handleCartCheckoutBtn(shopData);
                    return;
                  }
                });
            } else {
              BSS_B2B.modifyCartDataAndCreateCheckout(
                shopData,
                vatNumber,
                oldCheckoutBtn,
                self,
                isDone,
                true,
                customFieldValue
              );
              return;
            }
          }
        } else {
          BSS_B2B.modifyCartDataAndCreateCheckout(
            shopData,
            false,
            oldCheckoutBtn,
            self,
            isDone,
            false,
            customFieldValue
          );
        }
      }
    });
  }),
    (BSS_B2B.redirectToCheckoutPage = function (
      element,
      productId,
      parentElement,
      oldBuyItNowBtn
    ) {
      var id = shopData.product ? shopData.product.id : 0;
      if (productId) {
        id = productId;
      }
      var query = 'id:"' + id + '"';
      var urlData = "/search.js?q=" + query + "&view=bss.b2b";
      var encodeUrlData = encodeURI(urlData);

      let isEnabledVatValidate = false;

      if (BSS_B2B.shopModules && BSS_B2B.shopModules.length) {
        BSS_B2B.shopModules.forEach(function (md) {
          if (md.code == "tax_exempt") {
            isEnabledVatValidate = md.status;
          }
        });
      }

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
              productMap.push({
                id: pro.id,
                tags: pro.tags,
                collections: pro.collections,
              });
              productPrices[pro.id] = {
                price: pro.price,
                priceMin: pro.price_min,
                priceMax: pro.price_min,
                compareAtPriceMin: pro.compare_at_price_min,
                compareAtPriceMax: pro.compare_at_price_max,
              };
            }
          }

          var priceLists = BSS_B2B.getPriceList(shopData, productMap, false);
          var targetElement = $(
            ".shopify-payment-button__button.bss-b2b-cp-dynamic,.shopify-payment-button__more-options.bss-b2b-cp-dynamic" +
              (BSS_B2B.getCssSelector("product_buy_it_now_btn") != ""
                ? BSS_B2B.getCssSelector("product_buy_it_now_btn") +
                  ".bss-b2b-cp-dynamic"
                : "")
          );
          if (element) {
            targetElement = element;
          }
          var isDone = false;
          targetElement.off();
          targetElement.on("click", function (e) {
            if (isDone) {
              return;
            }
            e.preventDefault();
            e.stopPropagation();
            var variant = false;
            var queryArray = BSS_B2B.getQueryArray();
            if (queryArray.indexOf("variant") !== -1) {
              variant = queryArray["variant"];
            }
            if (parentElement) {
              var variantSelector = $(parentElement).find(
                "select#ProductSelect--product-template :selected, " +
                  "select#ProductSelect--featured-product :selected, " +
                  'select[name="id"] :selected' +
                  BSS_B2B.getCssSelector("product_select_variant_input")
              );
              if (variantSelector.length) {
                variant = variantSelector.val();
              }
            }
            if (
              priceLists.length == 0 &&
              !BSS_B2B.qb.appliedQbRuleForOneProduct &&
              !isEnabledVatValidate
            ) {
              //Need to handle case which pricelists is empty
              isDone = true;
              var originalButton = oldBuyItNowBtn;
              $(targetElement).remove();
              originalButton.show();
              $(originalButton).trigger("click");
            } else {
              BSS_B2B.handleBuyItNowBtn(
                priceLists,
                variant,
                productId ? responProd[0] : false,
                parentElement,
                BSS_B2B.qb.appliedQbRuleForOneProduct,
                targetElement
              );
            }
          });
        }
      });
    });
}
