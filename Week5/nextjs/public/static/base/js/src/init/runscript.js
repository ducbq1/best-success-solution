import initRegistrationForm from "../form/init-registration-form";
import initAMO from "../amo/init-advanced-minimum-order";
import initQb from "../qb/qb";
import helper from "../helper/helper";
import initCp from "../cp/init-custom-pricing";
import handleCartPrice from "../cart/handle-cart-price";
import handleAjaxCart from "../cart/handle-ajax-cart";
import handleQuickView from "../cp/quickview";
import formatMoney from "../helper/format-money";
import initMultiCurrency from "../currency/init-multi-currency";

import initCartHelper from "../cart/initCartHelper";

export default function bssB2BRunScript($, BSS_B2B, shopModules, shopData) {
  console.log("B2B script");
  /**
   * Initial shop modules
   */

  BSS_B2B.validateVatSuccess = false;

  var Shopify = Shopify || {};
  formatMoney(shopData, Shopify);
  helper($, BSS_B2B, shopData);
  initCartHelper();

  if (
    shopModules === undefined ||
    shopModules == null ||
    shopModules.length == 0
  ) {
    BSS_B2B.shopModules = [
      { code: "cp", status: 1 },
      { code: "qb", status: 1 },
      { code: "form", status: 1 },
      { code: "mc", status: 0 },
      { code: "amo", status: 0 },
      { code: "tax_exempt", status: 0 },
    ];
    shopModules = BSS_B2B.shopModules;
  }
  var isEnableCP = true;
  var isEnableQB = true;
  var isEnableRg = true;
  var isEnableMc = false;

  var isEnableAMO = false;
  var isEnabledTE = false;

  shopModules.forEach(function (sm) {
    if (sm.code == "cp") {
      isEnableCP = sm.status;
    } else if (sm.code == "qb") {
      isEnableQB = sm.status;
    } else if (sm.code == "form") {
      isEnableRg = sm.status;
    } else if (sm.code == "mc") {
      isEnableMc = sm.status;
    } else if (sm.code == "amo") {
      isEnableAMO = sm.status;
    } else if (sm.code == "tax_exempt") {
      isEnabledTE = sm.status;
    }
  });

  if (
    !BSS_B2B.isAllowFree &&
    (BSS_B2B.planCode == "null" ||
      BSS_B2B.planCode == "" ||
      BSS_B2B.planCode == "undefined")
  ) {
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

    return;
  }

  var firstLoadProduct = true;

  if (!isEnableCP || !BSS_B2B.configData || BSS_B2B.configData.length === 0) {
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
    setTimeout(function () {
      $(
        ".shopify-payment-button__button, .shopify-payment-button__more-options"
      ).addClass("bss-b2b-btn-buyitnow");
    }, 1000);
  }

  let currencyConfig = BSS_B2B.currencyConfig;

  if (currencyConfig == null || currencyConfig == undefined) {
    isEnableMc = false;
  } else {
    const deviceWitdh = $(window).width();
    const showOnMobile = currencyConfig.show_on_mobile;
    const showOnDesktop = currencyConfig.show_on_desktop;
    if (deviceWitdh > 600) {
      //check for desktop
      if (!showOnDesktop) {
        isEnableMc = false;
      }
    } else {
      //check for mobile
      if (!showOnMobile) {
        isEnableMc = false;
      }
    }
  }

  // var Shopify = Shopify || {};
  //
  // formatMoney(shopData, Shopify);
  // helper($, BSS_B2B, shopData);

  // multi currency app
  var bssB2BLoadScript = function (url, callback) {
    var script = document.createElement("script");
    script.type = "text/javascript";

    // If the browser is Internet Explorer.
    if (script.readyState) {
      script.onreadystatechange = function () {
        if (script.readyState == "loaded" || script.readyState == "complete") {
          script.onreadystatechange = null;
          callback();
        }
      };
      // For any other browser.
    } else {
      script.onload = function () {
        callback();
      };
    }

    script.src = url;
    document.getElementsByTagName("head")[0].appendChild(script);
  };

  if (isEnableMc) {
    bssB2BLoadScript(
      "https://cdn.shopify.com/s/javascripts/currencies.js",
      function () {
        console.log("Load currency form render");

        let currencyConfig = BSS_B2B.currencyConfig;
        let autoCurrencyLocation = currencyConfig.auto_location;

        if (!autoCurrencyLocation) {
          initMultiCurrency(
            $,
            BSS_B2B,
            shopData,
            isEnableMc,
            Shopify,
            isEnableCP
          );
        } else {
          $.ajax({
            url: "https://geo-ip-service.bsscommerce.com/geoip/getCountryByIP",
            data: { shopId: BSS_B2B.storeId },
            method: "POST",
            success: function (data) {
              if (data.success) {
                BSS_B2B.countryCode = data.countryCode;

                if (typeof Storage !== "undefined") {
                  sessionStorage.countryCode = data.countryCode;
                  console.log("sr:", sessionStorage.countryCode);
                } else {
                  console.log(BSS_PL.countryCode);
                }
                initMultiCurrency(
                  $,
                  BSS_B2B,
                  shopData,
                  isEnableMc,
                  Shopify,
                  isEnableCP
                );
              } else {
                console.log("Could not get country by IP");
                initMultiCurrency(
                  $,
                  BSS_B2B,
                  shopData,
                  isEnableMc,
                  Shopify,
                  isEnableCP
                );
              }
            },
            error: function (err) {
              console.log("Could not get country by IP");
              initMultiCurrency(
                $,
                BSS_B2B,
                shopData,
                isEnableMc,
                Shopify,
                isEnableCP
              );
            },
          });
        }
      }
    );
  }

  //Hide VAT - Tax Exempt form
  if (!isEnabledTE) {
    if ($(".bss-b2b-tax-ex-wrapper").length) {
      $(".bss-b2b-tax-ex-wrapper").remove();
    }
  }

  if (
    BSS_B2B.storeId == 661 &&
    BSS_B2B.page.isCartPage() &&
    ((isEnableCP && BSS_B2B.configData && BSS_B2B.configData.length > 0) ||
      (isEnableQB && BSS_B2B.qbRules && BSS_B2B.qbRules.length > 0))
  ) {
    let btnCheckout = $(
      'form[action*="/cart"] [name="checkout"],' +
        "#dropdown-cart button.btn.btn-checkout.show," +
        'a.button.checkout-button[href="/checkout"],' +
        'form[action*="/checkout"] .add_to_cart,' +
        'form[action*="/cart"]#cart_form #checkout,' +
        'form[action*="/cart"] button.Cart__Checkout,' +
        "button.trigger-checkout"
    );

    if (btnCheckout.length > 0) {
      let newBtnCheckout =
        "<input type='button' class='action_button add_to_cart' id='checkout' value='Checkout'></input>";

      btnCheckout.before(newBtnCheckout);
      btnCheckout.remove();
    }
  }

  handleCartPrice(
    $,
    BSS_B2B,
    shopData,
    Shopify,
    isEnableQB,
    isEnableCP,
    isEnableAMO,
    isEnableMc
  );

  handleAjaxCart($, BSS_B2B, shopData, isEnableQB);
  initCp(
    $,
    BSS_B2B,
    shopData,
    Shopify,
    firstLoadProduct,
    isEnableCP,
    isEnableQB,
    isEnableAMO,
    isEnableMc
  );
  initQb(
    $,
    BSS_B2B,
    shopData,
    Shopify,
    isEnableQB,
    isEnableCP,
    isEnableAMO,
    isEnableMc
  );
  initAMO($, BSS_B2B, shopData, Shopify, isEnableAMO, isEnableCP, isEnableQB);

  let firstShowPriceTimeout = 300;

  // fix for rojodistro
  if (BSS_B2B.storeId == 537) {
    firstShowPriceTimeout = 30;
  }

  if (isEnableAMO && BSS_B2B.amoRules && BSS_B2B.amoRules.length > 0) {
    if (
      (!BSS_B2B.configData || BSS_B2B.configData.length == 0 || !isEnableCP) &&
      (!BSS_B2B.qbRules || BSS_B2B.qbRules.length == 0 || !isEnableQB)
    ) {
      BSS_B2B.cart.fixer(shopData, false, true);
    }
  }

  // fix for wdw by ThaBi
  if ([77, 664, 1289].indexOf(BSS_B2B.storeId) !== -1) {
    firstShowPriceTimeout = 2000;
  }

  if ([661, 1283].indexOf(BSS_B2B.storeId) !== -1) {
    firstShowPriceTimeout = 100;
  }

  setTimeout(function () {
    if (
      (!BSS_B2B.configData || BSS_B2B.configData.length == 0 || !isEnableCP) &&
      (!BSS_B2B.qbRules || BSS_B2B.qbRules.length == 0 || !isEnableQB) &&
      !isEnabledTE
    ) {
      return;
    }
    // fix for oilmens-equipment-corp by ThaBi
    if (BSS_B2B.storeId == 300) {
      if (BSS_B2B.page.isCartPage()) {
        if (
          $("#MyShippingOptions").is(":hidden") &&
          $("#MyPaymentOptions").is(":hidden")
        ) {
          BSS_B2B.handleCartCheckoutBtn(shopData);
        }

        $('.PO-option-box .cart-attribute__field input[type="checkbox"]').on(
          "change",
          function () {
            if ($("#MyPaymentOptions").is(":visible")) {
              $('button.button-primary[name="checkout"]').off();

              $("#MyPaymentOptions input").on("change", function () {
                if (
                  $("#Company_Name").val().length != 0 &&
                  $("#Purchase_Order_Number").val().length != 0
                ) {
                  BSS_B2B.handleCartCheckoutBtn(shopData);
                } else {
                  return;
                }
              });
            } else {
              BSS_B2B.handleCartCheckoutBtn(shopData);
            }
          }
        );

        $(
          '.shipping-options-box .cart-attribute__field input[type="checkbox"]'
        ).on("change", function () {
          if ($("#MyShippingOptions").is(":visible")) {
            $('button.button-primary[name="checkout"]').off();
            $(".shipping-options-box input").on("change", function () {
              if (
                $("#carrier").val().length != 0 &&
                $("#shipping-method").val().length != 0 &&
                $("#carrier-account-number").val().length != 0
              ) {
                BSS_B2B.handleCartCheckoutBtn(shopData);
              } else {
                return;
              }
            });
          } else {
            BSS_B2B.handleCartCheckoutBtn(shopData);
          }
        });
      }
    } else if (BSS_B2B.storeId == 437) {
      // fix for dragon-fly-brand by ThaBi
      if (BSS_B2B.page.isCartPage()) {
        if ($("#CartPageAgree").is(":checked")) {
          BSS_B2B.handleCartCheckoutBtn(shopData);
        }

        $("#CartPageAgree").on("change", function () {
          if ($("#CartPageAgree").is(":checked")) {
            BSS_B2B.handleCartCheckoutBtn(shopData);
          } else {
            return;
          }
        });
      }
    } else {
      BSS_B2B.handleCartCheckoutBtn(shopData);
    }

    if (BSS_B2B.page.isCartPage()) {
      BSS_B2B.cart.fixer(shopData, false, true);

      if (isEnableCP && BSS_B2B.configData && BSS_B2B.configData.length) {
        BSS_B2B.handleAjaxCart();
        $("[data-cart-price-bubble][data-cart-price]").hide();

        var timeDelayToReCalculate = 1500;
        var customTimeDelayToReCalculate = BSS_B2B.getCssSelector(
          "cart_time_delay_re_calculate"
        );
        if (
          customTimeDelayToReCalculate != "" &&
          !isNaN(customTimeDelayToReCalculate)
        ) {
          timeDelayToReCalculate = parseInt(customTimeDelayToReCalculate);
        }
        var timeDelayToChangeQuantity = 2000;
        var customTimeDelayToChangeQuantity = BSS_B2B.getCssSelector(
          "cart_time_delay_changing_qty"
        );
        if (
          customTimeDelayToChangeQuantity != "" &&
          !isNaN(customTimeDelayToChangeQuantity)
        ) {
          timeDelayToChangeQuantity = parseInt(customTimeDelayToChangeQuantity);
        }
        var isExistedUpdateCartBtn = BSS_B2B.cart.isExistedUpdateCartBtn;
        if (!isExistedUpdateCartBtn) {
          $(BSS_B2B.cart.inputQuantityElement).on("change", function () {
            BSS_B2B.handleChangeQuantityEventFirstTime(
              timeDelayToReCalculate,
              timeDelayToChangeQuantity
            );
          });

          var buttonChangeQuantity = $(BSS_B2B.cart.buttonChangeQuantity);
          if (buttonChangeQuantity.length) {
            buttonChangeQuantity.on("click", function () {
              BSS_B2B.handleChangeQuantityEventFirstTime(
                timeDelayToReCalculate,
                timeDelayToChangeQuantity
              );
            });
          }
        }
        if ($(".recently-viewed-products-placeholder").length) {
          BSS_B2B.changeProductPrice(shopData, false, false);
        }
        if ($("#shopify-section-recently-viewed-products").length) {
          BSS_B2B.changeProductPrice(shopData, false, false);
        }
      }
    } else {
      if (isEnableCP && BSS_B2B.configData && BSS_B2B.configData.length) {
        BSS_B2B.changeProductPrice(shopData, false, false);
        // BSS_B2B.handleAjaxCart();
        $(window).scroll(function () {
          BSS_B2B.changeProductPrice(shopData, false, false);
        });
      }
      if (
        (isEnableCP && BSS_B2B.configData && BSS_B2B.configData.length) ||
        (isEnableQB && BSS_B2B.qbRules && BSS_B2B.qbRules.length)
      ) {
        BSS_B2B.handleAjaxCart();
      }
    }
  }, firstShowPriceTimeout);

  // fix for repairpartners by ThaBi
  if (BSS_B2B.storeId == 1283 && BSS_B2B.page.isProductPage()) {
    let qtyButtonChange = $(".inc.button," + ".dec.button");
    $(qtyButtonChange).on("click", function () {
      let priceElement = $(
        ".product_single_price .product_price[bss-b2b-product-id]"
      );
      var priceElementHtml = priceElement.html();
      priceElementHtml = priceElementHtml.replace(/\D/g, "");
      let price = parseFloat(priceElementHtml);
      let qty = $("#quantity").val();
      let newPrice = qty * price;
      let totalPriceElement = $(".total-price span");
      totalPriceElement.html(Shopify.formatMoney(newPrice));
    });
  }

  setTimeout(function () {
    //Need to apply for multiple featured products with cart form, buy it now buttons

    if (
      (!BSS_B2B.configData || BSS_B2B.configData.length == 0 || !isEnableCP) &&
      (!BSS_B2B.qbRules || BSS_B2B.qbRules.length == 0 || !isEnableQB) &&
      !isEnabledTE
    ) {
      return;
    }

    if (BSS_B2B.page.isProductPage()) {
      if (isEnableCP && BSS_B2B.configData && BSS_B2B.configData.length) {
        var cartForm = $('form[action*="/cart/add"]');
        var parentLevel2 = $('form[action*="/cart/add"]').parent();
        var parentClass = parentLevel2.attr("class");
        if (parentClass == undefined) {
          parentLevel2 = parentLevel2.parent();
        }
        if (parentLevel2.find("[bss-b2b-product-parent-price]").length === 0) {
          if (
            $("#shopify-section-product-template .product__content-main").length
          ) {
            parentLevel2 = $(
              "#shopify-section-product-template .product__content-main"
            );
          }

          if ($("#shopify-section-product-template").length) {
            parentLevel2 = $("#shopify-section-product-template");
          }
          if ($(".Product__Info").length) {
            parentLevel2 = $(".Product__Info");
          }
        }

        if (cartForm.length) {
          $(cartForm)
            .find(
              "select, " +
                "input.single-option-selector__radio," +
                "input.product-form__single-selector" +
                BSS_B2B.getCssSelector("product_variant_option_input")
            )
            .on("change", function () {
              BSS_B2B.changeVariantOptionProductPage(parentLevel2, cartForm);
            });

          //fix for beuce
          $(cartForm)
            .find("div.swatch-element")
            .on("click", function () {
              BSS_B2B.changeVariantOptionProductPage(parentLevel2, cartForm);
            });

          // fix for southeastedibles2020 (madu)
          $(cartForm)
            .find(".variant-input-wrap .variant-input")
            .on("click", function () {
              BSS_B2B.changeVariantOptionProductPage(parentLevel2, cartForm);
            });

          // end
          //fix ixcor by XuTho/ add event click change varian and add to cart in product page
          $(cartForm)
            .find("li.HorizontalList__Item")
            .on("click", function () {
              BSS_B2B.changeVariantOptionProductPage(
                parentLevel2,
                cartForm.parent()
              );
              setTimeout(function () {
                $("span[data-money-convertible]").hide();
              }, 50);
              setTimeout(function () {
                BSS_B2B.handleAjaxCart($, BSS_B2B, shopData);
                BSS_B2B.makeChangesAfterClickAjaxcart(2000);
              }, 2000);
            });
          // //fix for rojo-distro by XuTho/ add event click add to cart
          // $(cartForm).find('#addToCart-product-template').on("click", function () {
          //     setTimeout(function (){
          //         BSS_B2B.handleAjaxCart($, BSS_B2B, shopData)
          //         BSS_B2B.makeChangesAfterClickAjaxcart(2200)
          //     }, 2200)
          // })

          $(cartForm)
            .find("input#addToCart")
            .on("click", function () {
              setTimeout(function () {
                BSS_B2B.handleAjaxCart($, BSS_B2B, shopData);
                BSS_B2B.makeChangesAfterClickAjaxcart(2200);
              }, 2200);
            });

          //fix voyage-trade by XuTho support ThaBi
          $(cartForm)
            .find("a.btn-cart")
            .on("click", function () {
              setTimeout(function () {
                BSS_B2B.handleAjaxCart($, BSS_B2B, shopData);
                BSS_B2B.makeChangesAfterClickAjaxcart(1200);
              }, 1200);
            });
          var ajaxCartDelayTime = 1200;
          var customAjaxCartDelayTime = BSS_B2B.getCssSelector(
            "ajax_cart_time_delay_opening_cart"
          );
          if (
            customAjaxCartDelayTime != "" &&
            !isNaN(customAjaxCartDelayTime)
          ) {
            ajaxCartDelayTime = parseInt(customAjaxCartDelayTime);
          }
          $(cartForm)
            .find("[data-cart-submit]")
            .on("click", function () {
              setTimeout(function () {
                $("button.ajax-cart__toggle").on("click", function () {
                  BSS_B2B.makeChangesAfterClickAjaxcart(ajaxCartDelayTime);
                });
              }, ajaxCartDelayTime);
            });

          //Fixed for gemtheme
          var variantButtons = $(cartForm).find(".gt_swatches--select");
          if (variantButtons.length) {
            let sectionId = $(cartForm).attr("id").split("_");
            let sectionElement = $(
              'script[data-id="' + sectionId[sectionId.length - 1] + '"]'
            ).parent();
            variantButtons = $(sectionElement).find(
              ".gt_swatches--select, .item.gt_product-carousel--item, .gt_product-quantity--minus, .gt_product-quantity--plus"
            );
            $(variantButtons).on("click", function () {
              BSS_B2B.changeVariantOptionProductPage(parentLevel2, cartForm);
            });
          }

          //Fixed for pure-cosmetica

          variantButtons = $(cartForm).find("input[data-product-option]");
          if (variantButtons.length) {
            $(variantButtons).on("click", function () {
              BSS_B2B.changeVariantOptionProductPage(parentLevel2, cartForm);
            });
          }

          //Fixed for pure-cosmetica

          variantButtons = $(cartForm).find("input[data-product-option]");
          if (variantButtons.length) {
            $(variantButtons).on("click", function () {
              BSS_B2B.changeVariantOptionProductPage(parentLevel2, cartForm);
            });
          }
        }
      }

      //QTY-BREAK table
      if (isEnableQB && BSS_B2B.qbRules && BSS_B2B.qbRules.length) {
        BSS_B2B.qb.generateTableOnProductPage();
      }
      //End
    } else {
      if (isEnableCP && BSS_B2B.configData && BSS_B2B.configData.length) {
        BSS_B2B.applyChangePriceForMultiCarform();
        // Fix for benkibrewingtools change variant in collection page
        if (BSS_B2B.storeId == 181 || BSS_B2B.storeId == 13) {
          BSS_B2B.applyChangePriceForCollectionPage();
        }
        handleQuickView($, BSS_B2B, shopData);
      }
    }
  }, 100);
  let detectShopifyPaymentTimes = 0;
  var detectShopifyPaymentInterval = setInterval(function () {
    if (detectShopifyPaymentTimes <= 12) {
      if (
        (!BSS_B2B.configData ||
          BSS_B2B.configData.length == 0 ||
          !isEnableCP) &&
        (!BSS_B2B.qbRules || BSS_B2B.qbRules.length == 0 || !isEnableQB) &&
        !isEnabledTE
      ) {
        clearInterval(detectShopifyPaymentInterval);
        return;
      }
      var cartForms = $(
        'form[action*="/cart/add"]' +
          BSS_B2B.getCssSelector("product_cart_form")
      );
      var buyItNowBtn = $(
        ".shopify-payment-button__button:not([disabled]):not(.bss-b2b-cp-dynamic),.shopify-payment-button__more-options:not([disabled]):not(.bss-b2b-cp-dynamic)," +
          ".shopify-payment-button__button.shopify-payment-button__button--unbranded:not([disabled]):not(.bss-b2b-cp-dynamic)" +
          (BSS_B2B.getCssSelector("product_buy_it_now_btn") != ""
            ? BSS_B2B.getCssSelector("product_buy_it_now_btn") +
              ":not([disabled]):not(.bss-b2b-cp-dynamic)"
            : "")
      );
      if (cartForms.length && buyItNowBtn.length) {
        for (var i = 0; i < cartForms.length; i++) {
          BSS_B2B.makeCloneBuyItNow(cartForms[i]);
        }
        clearInterval(detectShopifyPaymentInterval);
      }
    } else {
      clearInterval(detectShopifyPaymentInterval);
    }

    detectShopifyPaymentTimes++;
  }, 500);
}
