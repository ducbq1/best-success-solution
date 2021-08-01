module.exports = {
  clientValidateVat: function (vatNumber) {
    const rex = /^[A-Za-z]{2,4}(?=.{2,12}$)[-_\s0-9]*(?:[a-zA-Z][-_\s0-9]*){0,2}$/;
    const isValidVat = rex.test(vatNumber);
    console.log("Validate:", vatNumber, "Valid VAT:", isValidVat);
    return isValidVat;
  },
  serverValidateVat: function (bssB2bApiServer, vatNumber, shopData) {
    let countryCode = vatNumber.substr(0, 2);
    let data = {
      domain: shopData.shop.permanent_domain,
      countryCode: countryCode,
      vatNumber: vatNumber,
    };

    fetch(bssB2bApiServer + "/wholesaler/check-valid-vat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then(function (data) {
        console.log("Validate vat:", data);
      });
    return false;
  },
  showProductPriceInlcudedVat: function (BSS_B2B, shopData) {
    if (BSS_B2B && BSS_B2B.shopModules) {
      //if (shopData.taxes_included) {
      let bssB2BProductVat = document.querySelectorAll(".bss-b2b-product-vat");
      if (bssB2BProductVat && bssB2BProductVat.length) {
        bssB2BProductVat = bssB2BProductVat[0];
        let bssB2BProductVatClosestForm = bssB2BProductVat.closest(
          'form[action*="/cart/add"]'
        );
        if (bssB2BProductVatClosestForm) {
          let bssVariantSelector = bssB2BProductVatClosestForm.querySelectorAll(
            "select, input.single-option-selector__radio, input.product-form__single-selector"
          );
          if (bssVariantSelector) {
            module.exports.handleVariantChangeEvents(
              bssB2BProductVatClosestForm,
              shopData
            );
            bssVariantSelector.forEach(function (item, index) {
              item.addEventListener("change", (event) => {
                // No custom price if there is no CP rule
                module.exports.handleVariantChangeEvents(
                  bssB2BProductVatClosestForm,
                  shopData,
                  0
                );
              });
            });
          } else {
            console.log("Could not found product variant selector!");
          }
        }
      }

      //}
    }
  },
  handleVariantChangeEvents: function (
    bssB2BProductVatClosestForm,
    shopData,
    customPrice
  ) {
    setTimeout(function () {
      let bssVariantInput = bssB2BProductVatClosestForm.querySelector(
        'select[name="id"], input[name="id"]'
      );
      if (bssVariantInput) {
        let variantId = bssVariantInput.value;
        let isChanged = module.exports.bssB2BChangeVatPrice(
          variantId,
          shopData,
          customPrice
        );
      }
    }, 200);
  },
  bssB2BChangeVatPrice: function (variantId, shopData, customPrice) {
    if (typeof bssB2BProduct === "undefined") {
      return;
    }
    var variant = bssB2BProduct.variantIdArrayMap[variantId];
    let planPriceInfo = variant;
    if (planPriceInfo) {
      if (customPrice) {
        planPriceInfo.price_formatted = module.exports.formatMoney(
          customPrice,
          shopData
        );
        planPriceInfo.price = customPrice;
      }
      let priceElement = document.querySelector(
        '.bss-b2b-product-vat[data-product-id="' + variant.product_id + '"]'
      );
      if (priceElement) {
        let bssB2BPriceNoVat = priceElement.querySelector(
          ".bss-b2b-product-vat-price-no-vat"
        );
        let bssB2BPriceHasVat = priceElement.querySelector(
          ".bss-b2b-product-vat-price-has-vat"
        );
        let includedVatText = bssB2BPriceHasVat.getAttribute(
          "data-included-vat-text"
        );
        let excludedVatText = bssB2BPriceNoVat.getAttribute(
          "data-excluded-vat-text"
        );
        let customerTaxExempt = shopData.customer.tax_exempt;
        if (shopData.taxes_included) {
          if (variant.taxable) {
            if (customerTaxExempt) {
              bssB2BPriceNoVat.innerHTML =
                planPriceInfo.price_formatted + " " + excludedVatText;

              bssB2BPriceHasVat.innerHTML =
                planPriceInfo.price_formatted + " " + includedVatText;
            } else {
              bssB2BPriceNoVat.innerHTML =
                planPriceInfo.price_formatted + " " + excludedVatText;

              bssB2BPriceHasVat.innerHTML =
                module.exports.formatMoney(
                  planPriceInfo.price * (1 + parseFloat(BSS_B2B.countryTax)),
                  shopData
                ) +
                " " +
                includedVatText;
            }
          } else {
            bssB2BPriceNoVat.innerHTML =
              module.exports.formatMoney(
                planPriceInfo.price / (1 + parseFloat(BSS_B2B.countryTax)),
                shopData
              ) +
              " " +
              excludedVatText;

            bssB2BPriceHasVat.innerHTML =
              planPriceInfo.price_formatted + " " + includedVatText;
            /*if (customerTaxExempt) {
                            bssB2BPriceNoVat.innerHTML = module.exports.formatMoney(planPriceInfo.price / (1 + parseFloat(BSS_B2B.countryTax)), shopData)
                                + " "
                                + excludedVatText;

                            bssB2BPriceHasVat.innerHTML = planPriceInfo.price_formatted
                                + " "
                                + includedVatText;
                        } else {
                            bssB2BPriceNoVat.innerHTML = module.exports.formatMoney(planPriceInfo.price * (1 + parseFloat(BSS_B2B.countryTax)), shopData)
                                + " "
                                + excludedVatText;

                            bssB2BPriceHasVat.innerHTML = planPriceInfo.price_formatted
                                + " "
                                + includedVatText;
                        }*/
          }
        } else {
          if (variant.taxable) {
            if (customerTaxExempt) {
              bssB2BPriceNoVat.innerHTML =
                planPriceInfo.price_formatted + " " + excludedVatText;

              bssB2BPriceHasVat.innerHTML =
                planPriceInfo.price_formatted + " " + includedVatText;
            } else {
              bssB2BPriceNoVat.innerHTML =
                planPriceInfo.price_formatted + " " + excludedVatText;

              bssB2BPriceHasVat.innerHTML =
                module.exports.formatMoney(
                  planPriceInfo.price * (1 + parseFloat(BSS_B2B.countryTax)),
                  shopData
                ) +
                " " +
                includedVatText;
            }
          } else {
            bssB2BPriceNoVat.innerHTML =
              planPriceInfo.price_formatted + " " + excludedVatText;

            bssB2BPriceHasVat.innerHTML =
              planPriceInfo.price_formatted + " " + includedVatText;
          }
        }
      }
    } else {
      console.log("Could not found plan price info for variant");
    }
  },
  formatMoney: function (cents, shopData, format) {
    let moneyFormat = shopData.shop.money_format;
    if (typeof cents == "string") {
      cents = cents.replace(".", "");
    }
    var value = "";
    var placeholderRegex = /\{\{\s*(\w+)\s*\}\}/;
    var formatString = format || moneyFormat;

    function defaultOption(opt, def) {
      return typeof opt == "undefined" ? def : opt;
    }

    function formatWithDelimiters(number, precision, thousands, decimal) {
      precision = defaultOption(precision, 2);
      thousands = defaultOption(thousands, ",");
      decimal = defaultOption(decimal, ".");

      if (isNaN(number) || number == null) {
        return 0;
      }

      number = (number / 100.0).toFixed(precision);

      var parts = number.split("."),
        dollars = parts[0].replace(
          /(\d)(?=(\d\d\d)+(?!\d))/g,
          "$1" + thousands
        ),
        cents = parts[1] ? decimal + parts[1] : "";

      return dollars + cents;
    }

    switch (formatString.match(placeholderRegex)[1]) {
      case "amount":
        value = formatWithDelimiters(cents, 2);
        break;
      case "amount_no_decimals":
        value = formatWithDelimiters(cents, 0);
        break;
      case "amount_with_comma_separator":
        value = formatWithDelimiters(cents, 2, ".", ",");
        break;
      case "amount_no_decimals_with_comma_separator":
        value = formatWithDelimiters(cents, 0, ".", ",");
        break;
    }

    return formatString.replace(placeholderRegex, value);
  },
};
