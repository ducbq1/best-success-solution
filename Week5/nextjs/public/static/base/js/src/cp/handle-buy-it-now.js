const Tax = require("../taxexem/tax");
export default function handleBuyItNow(
  $,
  BSS_B2B,
  shopData,
  isEnableCP,
  isEnableQB,
  isEnableAMO
) {
  BSS_B2B.redirectWithInvoiceUrl = function (
    domain,
    product,
    variant,
    priceLists,
    quantity,
    appliedQbRule,
    oldBuyItNowBtn,
    oldHtml,
    oldInputVal,
    vatNumber
  ) {
    let vatAttributes = {};
    if (vatNumber) {
      vatAttributes["vat-id"] = vatNumber;
      vatAttributes["taxExempt"] = true;
    }
    $.ajax({
      url: bssB2bApiServer + "/checkout/redirect",
      data: {
        domain: domain,
        product: product ? product : shopData.product,
        variant: variant,
        priceLists: priceLists,
        quantity: quantity,
        appliedQbRule: appliedQbRule,
        shopModules: BSS_B2B.shopModules,
        vatAttributes: vatAttributes,
      },
      dataType: "json",
      type: "POST",
      success: function (data) {
        if (data.success) {
          window.location = data.orderData.invoiceUrl;
        } else {
          $(oldBuyItNowBtn).removeAttr("disabled");
          if (oldHtml == null) {
            $(oldBuyItNowBtn).val(oldInputVal);
          } else {
            $(oldBuyItNowBtn).html(oldHtml);
          }
          console.log(data.message);
        }
      },
      error: function (err) {
        $(oldBuyItNowBtn).removeAttr("disabled");
        if (oldHtml == null) {
          $(oldBuyItNowBtn).val(oldInputVal);
        } else {
          $(oldBuyItNowBtn).html(oldHtml);
        }
        console.log("Could not create checkout and redirect:", err);
      },
    });
  };
  BSS_B2B.handleBuyItNowBtn = function (
    priceLists,
    variant,
    product,
    parentElement,
    appliedQbRule,
    targetElement
  ) {
    //$(targetElement).off();
    $(targetElement).attr("disabled", "disable");
    let self = targetElement;
    let parentForm = $(targetElement).closest("form");
    let oldBuyItNowBtn = targetElement;
    let oldInputVal = null;
    let oldHtml = null;

    if ($(targetElement).is("input")) {
      oldInputVal = $(targetElement).val();
      $(targetElement).val("Processing");
    } else {
      oldHtml = $(targetElement).html();
      $(targetElement).html(
        '<div style="display: flex;"><span style="visibility: hidden;width: 0;">sdad</span><div class="bss-loader"></div></div>'
      );
    }
    var domain = shopData.shop.permanent_domain;
    var quantity = 1;
    var quantitySelector = $(parentElement).find(
      'input[type="number"][name="quantity"],' +
        'input[type="number"][data-quantity-input],' +
        'input[type="number"][class$="quantity"],' +
        'input[id^="Quantity"],' +
        'input[name="quantity"],' +
        'select[name="quantity"]' +
        BSS_B2B.getCartPriceClass("cart_quantity_input")
    );

    if (quantitySelector.length) {
      quantity = parseInt(quantitySelector.val());
    }

    /**
     *
     * VAT VALIDATE
     *
     */
    let isEnabledVatValidate = false;

    if (BSS_B2B.shopModules && BSS_B2B.shopModules.length) {
      BSS_B2B.shopModules.forEach(function (md) {
        if (md.code == "tax_exempt") {
          isEnabledVatValidate = md.status;
        }
      });
    }
    let vatNumber = "";
    let inputTaxElement = $(
      '.bss-b2b-tax-ex-wrapper input[name="bss-b2b-eu-tax"]'
    );
    let taxExMessage = $(".bss-b2b-tax-ex-message");
    if (parentForm.length) {
      inputTaxElement = $(parentForm).find(
        '.bss-b2b-tax-ex-wrapper input[name="bss-b2b-eu-tax"]'
      );
      taxExMessage = $(parentForm).find(".bss-b2b-tax-ex-message");
    }

    if ($(inputTaxElement).length) {
      vatNumber = $(inputTaxElement).val();
    }
    let validateVat = Tax.clientValidateVat(vatNumber);

    if (
      (isEnabledVatValidate && bssB2BIsRequiredVat && inputTaxElement.length) ||
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
        $(self).removeAttr("disabled");
        $(targetElement).html(oldHtml);
        // BSS_B2B.handleBuyItNowBtn(priceLists, variant, product, parentElement, appliedQbRule, targetElement)
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
                  BSS_B2B.redirectWithInvoiceUrl(
                    domain,
                    product,
                    variant,
                    priceLists,
                    quantity,
                    appliedQbRule,
                    oldBuyItNowBtn,
                    oldHtml,
                    oldInputVal,
                    vatNumber
                  );
                  return;
                } else {
                  $(self).removeAttr("disabled");
                  BSS_B2B.validateVatSuccess = true;
                  $(inputTaxElement).on("change", function () {
                    let newVatNumber = $(inputTaxElement).val();
                    if (newVatNumber != vatNumber) {
                      BSS_B2B.validateVatSuccess = false;
                    }
                  });
                  $(targetElement).html(oldHtml);
                  // BSS_B2B.handleBuyItNowBtn(priceLists, variant, product, parentElement, appliedQbRule, targetElement);
                }
              } else {
                $(taxExMessage).html(
                  "<p class='bss-b2b-tax-invalid' style='color: orangered; margin-top: 5px'>" +
                    "<span style='font-size: 20px; color: orangered; border: 1px orangered solid; border-radius: 50%; width: 40px; height: 40px; padding: 0 4px'>&#10005;</span> " +
                    errorMessage +
                    "</p>"
                );
                $(self).removeAttr("disabled");
                $(targetElement).html(oldHtml);
                //BSS_B2B.handleBuyItNowBtn(priceLists, variant, product, parentElement, appliedQbRule, targetElement);
                return;
              }
            });
        } else {
          BSS_B2B.redirectWithInvoiceUrl(
            domain,
            product,
            variant,
            priceLists,
            quantity,
            appliedQbRule,
            oldBuyItNowBtn,
            oldHtml,
            oldInputVal,
            vatNumber
          );
          return;
        }
      }
    } else {
      BSS_B2B.redirectWithInvoiceUrl(
        domain,
        product,
        variant,
        priceLists,
        quantity,
        appliedQbRule,
        oldBuyItNowBtn,
        oldHtml,
        oldInputVal,
        false
      );
    }
  };

  BSS_B2B.makeCloneBuyItNow = function (cartForm) {
    var buyItNowBtn = $(cartForm).find(
      ".shopify-payment-button__button:not([disabled]):not(.bss-b2b-cp-dynamic),.shopify-payment-button__more-options:not([disabled]):not(.bss-b2b-cp-dynamic)," +
        ".shopify-payment-button__button.shopify-payment-button__button--unbranded:not([disabled]):not(.bss-b2b-cp-dynamic)" +
        (BSS_B2B.getCssSelector("product_buy_it_now_btn") != ""
          ? BSS_B2B.getCssSelector("product_buy_it_now_btn") +
            ":not([disabled]):not(.bss-b2b-cp-dynamic)"
          : "")
    );
    var customBuyItNowBtn = $(cartForm).find(
      ".shopify-payment-button__button.bss-b2b-cp-dynamic, .shopify-payment-button__more-options.bss-b2b-cp-dynamic"
    );
    //+  (BSS_B2B.getCssSelector('product_buy_it_now_btn') != '' ?   (BSS_B2B.getCssSelector('product_buy_it_now_btn') + ".bss-b2b-cp-dynamic") : '')
    if (buyItNowBtn.length) {
      var cloneBuyItNow = $(buyItNowBtn).clone();
      if (customBuyItNowBtn.length == 0) {
        cloneBuyItNow.addClass("bss-b2b-cp-dynamic");
        cloneBuyItNow.css("margin-left", 0);
        cloneBuyItNow.css("display", "block");
        $(cloneBuyItNow).addClass("bss-b2b-btn-buyitnow");
        var parentElement = $(cartForm).find(
          '.shopify-payment-button[data-shopify="payment-button"]'
        );
        if (parentElement.length) {
          parentElement.prepend(cloneBuyItNow);
        } else {
          buyItNowBtn.before(cloneBuyItNow);
        }
        $(buyItNowBtn).remove();
      } else {
        $(customBuyItNowBtn).addClass("bss-b2b-btn-buyitnow");
        $(buyItNowBtn).remove();
        $(customBuyItNowBtn).show();
      }

      var cartFormIdSplit = $(cartForm).attr("id").split("_");
      var productId = cartFormIdSplit[cartFormIdSplit.length - 1];
      if (BSS_B2B.page.isProductPage()) {
        productId = shopData.product ? shopData.product.id : 0;
      }
      if ($(cartForm).parent().find("#ProductPrice").length > 0) {
        productId = $(cartForm)
          .parent()
          .find("#ProductPrice")
          .attr("bss-b2b-product-id");
      }
      if (isNaN(productId)) {
        productId = $(cartForm)
          .find("[bss-b2b-product-id]")
          .attr("bss-b2b-product-id");
      }
      if (isNaN(productId)) {
        cartFormIdSplit = $(cartForm).attr("id").split("-");
        productId = cartFormIdSplit[1];
        if (isNaN(productId)) {
          if (cartFormIdSplit.length > 1) {
            var jsonSectionId = "#ProductJson-" + cartFormIdSplit[1];
            try {
              productId = JSON.parse($(jsonSectionId).html()).id;
            } catch (e) {
              console.log("Could not parse JSON of product section");
            }
          }
        }
      }
      if (isNaN(productId)) {
        var quickShopTemplateId = $(cartForm).closest(
          "#product-id-product-template-quick"
        );
        if (quickShopTemplateId.length) {
          productId = $(quickShopTemplateId).attr("data-product-id");
        }
      }
      BSS_B2B.redirectToCheckoutPage(
        $(cartForm).find(
          ".shopify-payment-button__button.bss-b2b-cp-dynamic, .shopify-payment-button__more-options.bss-b2b-cp-dynamic"
        ),
        productId,
        cartForm,
        buyItNowBtn
      );
    }
  };
}
