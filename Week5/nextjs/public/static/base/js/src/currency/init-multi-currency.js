export default function initMultiCurrency(
  $,
  BSS_B2B,
  shopData,
  enableModule,
  Shopify,
  isEnableCP
) {
  BSS_B2B.MC = {};
  BSS_B2B.MC.data = {};
  const currencyConfig = BSS_B2B.currencyConfig;
  const currencyFormat = BSS_B2B.currencyFormat;
  const currencyList = JSON.parse(BSS_B2B.currencyConfig.currency_list);
  const shopCurrencyCode = shopData.shop.currency;
  const shopMoneyFormat = shopData.shop.money_format;

  let parttern = /(\{\{.*\}\})/g;
  let validFormatString = shopMoneyFormat.match(parttern);
  let formatString = shopMoneyFormat;
  if (validFormatString !== null && validFormatString.length) {
    formatString = validFormatString[0];
  }

  let shopMoneySymbol = shopMoneyFormat.replace(formatString, "");

  var Currency = window.Currency;
  let isFirstTime = false;

  let sessionCurrencyCode = sessionStorage.getItem("currentCurrency");
  let sessionCurrencyFormat = sessionStorage.getItem("currentCurrencyFormat");

  if (!sessionCurrencyCode) {
    isFirstTime = true;
    sessionCurrencyCode = shopCurrencyCode;
    sessionStorage.setItem("currentCurrency", sessionCurrencyCode);
  }
  if (!sessionCurrencyFormat) {
    sessionCurrencyFormat = shopMoneyFormat;
    sessionStorage.setItem("currentCurrencyFormat", sessionCurrencyFormat);
  }
  let isValidCurrencyCode = false;

  currencyList.map((item) => {
    if (sessionCurrencyCode == item.code) {
      isValidCurrencyCode = true;
    }
  });

  if (!isValidCurrencyCode) {
    sessionStorage.setItem("currentCurrency", shopCurrencyCode);
  }

  BSS_B2B.MC.convertCurrency = function (
    lastCurrency,
    currentCurrency,
    amountHtml
  ) {
    let mountAfterConvert = BSS_B2B.MC.getBaseCurrency(
      lastCurrency,
      amountHtml
    );
    if (lastCurrency !== currentCurrency) {
      mountAfterConvert = Currency.convert(
        mountAfterConvert,
        lastCurrency,
        currentCurrency
      );
    }
    return parseFloat(mountAfterConvert).toFixed(2);
  };

  BSS_B2B.MC.convertCurrencyFromCP = function (
    lastCurrency,
    currentCurrency,
    amount
  ) {
    let mountAfterConvert = amount;
    if (lastCurrency !== currentCurrency) {
      mountAfterConvert = Currency.convert(
        mountAfterConvert,
        lastCurrency,
        currentCurrency
      );
    }
    return parseFloat(mountAfterConvert).toFixed(2);
  };

  BSS_B2B.MC.getBaseCurrency = function (lastCurrency, amountHtml) {
    var amount = amountHtml.replace(/[^0-9.,-]+/g, "");
    let lastFormatString =
      currencyFormat[lastCurrency].money_with_currency_format;
    var placeholderRegex = /\{\{\s*(\w+)\s*\}\}/;

    function defaultOption(opt, def) {
      return typeof opt == "undefined" ? def : opt;
    }

    function formatWithDelimiters(number, precision, thousands, decimal) {
      precision = defaultOption(precision, 2);
      thousands = defaultOption(thousands, ",");
      decimal = defaultOption(decimal, ".");

      if (thousands == "." && number.includes(".")) {
        number = number.replace(/\./g, "");
      }
      if (thousands == "," && number.includes(",")) {
        number = number.replace(/\,/g, "");
      }
      if (decimal == ",") {
        number = number.replace(",", ".");
      }
      return number;
    }

    let value = "";
    switch (lastFormatString.match(placeholderRegex)[1]) {
      case "amount":
        value = formatWithDelimiters(amount, 2);
        break;
      case "amount_no_decimals":
        value = formatWithDelimiters(amount, 0);
        break;
      case "amount_with_comma_separator":
        value = formatWithDelimiters(amount, 2, ".", ",");
        break;
      case "amount_no_decimals_with_comma_separator":
        value = formatWithDelimiters(amount, 0, ".", ",");
        break;
    }
    let mountAfterConvert = parseFloat(value).toFixed(2);

    return mountAfterConvert;
  };

  BSS_B2B.MC.convertPriceByMc = function (amount, priceElement) {
    let sessionCurrencyCode = sessionStorage.getItem("currentCurrency");
    let sessionCurrencyFormat = sessionStorage.getItem("currentCurrencyFormat");
    let selectedCurrencyCode = sessionCurrencyCode;

    let $currenctCurrencyElement = $(".bss-nice-select span.current-currency");
    let $currenctCurrencyFlag = $(".bss-nice-select span.current .flags");
    $(".option.notranslate.selected").removeClass("selected");
    let selectedFlag = $(
      `.option.notranslate[data-value="${selectedCurrencyCode}"]`
    )
      .find(".flags")
      .attr("class");
    $(`.option.notranslate[data-value="${selectedCurrencyCode}"]`).addClass(
      "selected"
    );

    $currenctCurrencyElement.html(selectedCurrencyCode);
    $currenctCurrencyFlag.attr("class", selectedFlag);

    amount = amount.toFixed();
    if (priceElement) {
      priceElement.attr("bss-shop-base-currency", amount);
    }

    let moneyFormat =
      currencyFormat[selectedCurrencyCode].money_with_currency_format;

    let currencyFormatString = sessionCurrencyFormat;

    let parttern = /(\{\{.*\}\})/g;
    let validFormatString = currencyFormatString.match(parttern);
    let formatString = currencyFormatString;
    if (validFormatString !== null && validFormatString.length) {
      formatString = validFormatString[0];
    }
    let priceHtml = amount / 100;
    priceHtml = priceHtml.toString();
    let priceAfterChange = BSS_B2B.MC.convertCurrencyFromCP(
      shopCurrencyCode,
      selectedCurrencyCode,
      priceHtml
    );

    let priceAfterFormat = Shopify.formatMoney(priceAfterChange, formatString);

    let isEnableRoundPrice = currencyConfig.round_price;
    if (isEnableRoundPrice) {
      //do round price
      let roundStyle = currencyConfig.round_style;
      priceAfterChange = Math.round(parseFloat(priceAfterChange)) * 100;
      priceAfterFormat = Shopify.formatMoney(priceAfterChange, formatString);
      //check if remove decial then remove last 3 charactor (.00)
      if (roundStyle == "remove_decimal") {
        let decimaString = priceAfterFormat.substr(priceAfterFormat.length - 3);
        if (decimaString == ".00" || decimaString == ",00") {
          priceAfterFormat = priceAfterFormat.slice(0, -3);
        }
      }
    }

    let newPrice = moneyFormat.replace(formatString, priceAfterFormat);
    return newPrice;
  };

  BSS_B2B.MC.preConvertCurrency = function (
    currentCurrencyCode,
    currencyFormatString,
    customPriceEl = false,
    firstLoad = false
  ) {
    let $currenctCurrencyElement = $(".bss-nice-select span.current-currency");
    let $currenctCurrencyFlag = $(".bss-nice-select span.current .flags");
    $(".option.notranslate.selected").removeClass("selected");
    let selectedFlag = $(
      `.option.notranslate[data-value="${currentCurrencyCode}"]`
    )
      .find(".flags")
      .attr("class");
    $(`.option.notranslate[data-value="${currentCurrencyCode}"]`).addClass(
      "selected"
    );

    $currenctCurrencyElement.html(currentCurrencyCode);
    $currenctCurrencyFlag.attr("class", selectedFlag);

    let selectedCurrencyCode = currentCurrencyCode;
    let moneyFormat =
      currencyFormat[currentCurrencyCode].money_with_currency_format;

    let parttern = /(\{\{.*\}\})/g;
    let validFormatString = currencyFormatString.match(parttern);
    let formatString = currencyFormatString;
    if (validFormatString !== null && validFormatString.length) {
      formatString = validFormatString[0];
    }

    let isNoDecimal = shopMoneyFormat.includes("no_decimals");

    let priceEl = $("span[bss-b2b-product-price]");
    let allPriceElements = $(
      "[bss-b2b-product-price]," +
        "[bss-b2b-product-id]," +
        "[bss-b2b-current-variant-price]," +
        "[bss-b2b-product-compare-price]," +
        "[bss-b2b-product-parent-price], " +
        "[bss-b2b-item-original-price], " +
        "[bss-b2b-original-line-price], " +
        "[data-cart-subtotal], " +
        "[bss-b2b-cart-total-price], " +
        ".bss-qb-total-price-item, " +
        "[bss-b2b-product-lowest-price]," +
        "[bss-b2b-product-from-price]," +
        "[bss-b2b-product-now-price]," +
        "[bss-b2b-product-min-price]," +
        "[bss-b2b-variant-unit-price]," +
        "[data-regular-price]," +
        "[data-sale-price]," +
        //fix for cart price element
        "[data-cart-item-discount-amount]," +
        "[data-cart-item-final-price]," +
        "[data-cart-item-original-price]," +
        "[bss-b2b-cart-discount-total], " +
        //fix theme minimal
        ".product-single__sale-price," +
        "[data-unit-price]," +
        //fix theme supply
        "#comparePrice-product-template," +
        ".product-single__price--compare," +
        // fix for supply theme on vnđ
        ".inline-list.product-meta [bss-b2b-product-price][data-sale-price] span[aria-hidden]," +
        //fix theme Narrative
        "[data-compare-price]," +
        //fix theme Boundless
        ".js-price," +
        "[bss-b2b-item-final-price]," +
        "[bss-b2b-final-line-price]," +
        "[bss-b2b-cart-discount-amount]," +
        "[data-cart-item-regular-price]"
    );

    var lowestPriceElement = $(
      "[bss-b2b-product-lowest-price]," +
        "[bss-b2b-product-from-price]," +
        "[bss-b2b-product-now-price]," +
        "[bss-b2b-product-min-price]"
    );

    if (customPriceEl.length) {
      allPriceElements = customPriceEl;
    }

    $.each(allPriceElements, function (index, priceElement) {
      priceElement = $(priceElement);
      // fix sale price for Brooklyn theme
      let isSalePrice = false;
      let isNowPrice = false;
      let preFixDiscount = false;
      let isSupplyTheme = false;
      if (priceElement.children().length > 0 || $(priceElement).is("meta")) {
        //fix for theme supply
        if (
          priceElement.closest("ul.inline-list").length &&
          priceElement.children().length > 1
        ) {
          if (BSS_B2B.page.isProductPage()) {
            if (!$(priceElement.children()[0]).children().is("sup")) {
              return true;
            }
          }
        } else if (priceElement.children().is("br")) {
          if (priceElement.html().includes("Save<br>")) {
            isSalePrice = true;
          }
        } else if (priceElement.children().is(".txt--emphasis")) {
          //fix theme Boundless
          lowestPriceElement = priceElement;
          if (priceElement.html().includes("now")) {
            isNowPrice = true;
          }
        } else if (
          priceElement.is(".order-discount--cart") &&
          priceElement.children().is("strong")
        ) {
          preFixDiscount = true;
        } else if (
          priceElement.is("[bss-b2b-ajax-cart-subtotal]") &&
          priceElement.children().is("[bss-b2b-ajax-cart-subtotal]")
        ) {
          // fix theme Venture
          let tempHtml = priceElement.html();
          if (tempHtml.includes("{") && tempHtml.includes("}")) {
            priceElement.html(tempHtml.replace(/{|}/g, ""));
          }
          return;
        } else if (!priceElement.children().is("sup")) {
          return true;
        }
      }
      let priceHtml = priceElement.html();

      //fix for theme supply
      if (priceHtml.includes("<sup")) {
        isSupplyTheme = true;
        priceHtml = priceHtml
          .substring(0, priceHtml.indexOf("<sup"))
          .replace("-", "");
      }
      //fix theme Boundless
      if (priceHtml.includes("-")) {
        priceHtml = priceHtml.replace(/\-/g, "");
      }

      function htmlDecode(value) {
        return typeof value === "undefined"
          ? ""
          : $("<div/>").html(value).text();
      }

      function isSameCurrency(moneyString) {
        let currencyFormatFromHtml = moneyString
          .replace(/\s*([0-9|\.|\,]*)[^\S\r\n]/g, "")
          .replace(/\s/g, "");
        let currencyFormatFromFormatString = htmlDecode(
          moneyFormat.replace(formatString, "")
        ).replace(/\s/g, "");
        return currencyFormatFromHtml == currencyFormatFromFormatString;
      }

      // check if is base currency then continua, if has change currency, break
      if (!firstLoad && isSameCurrency(priceHtml)) {
        // fix for debut theme for subtotal price
        if (
          !(
            ($(priceElement).is(".cart-subtotal__price[data-cart-subtotal]") ||
              $(priceElement).is("span[bss-b2b-product-price]")) &&
            $(priceElement)
              .closest(".cart__footer")
              .find(".cart-subtotal .cart-subtotal__price[data-cart-subtotal]")
              .length
          )
        ) {
          return;
        }
      }

      let amount = BSS_B2B.MC.getBaseCurrency(shopCurrencyCode, priceHtml);
      amount = parseFloat(amount) * 100;

      priceElement.attr("bss-shop-base-currency", amount);

      let priceAfterChange = BSS_B2B.MC.convertCurrency(
        shopCurrencyCode,
        selectedCurrencyCode,
        priceHtml
      );

      let priceAfterFormat = Shopify.formatMoney(
        priceAfterChange,
        formatString
      );

      let isEnableRoundPrice = currencyConfig.round_price;
      if (isEnableRoundPrice) {
        //do round price
        let roundStyle = currencyConfig.round_style;
        priceAfterChange = Math.round(parseFloat(priceAfterChange)) * 100;
        priceAfterFormat = Shopify.formatMoney(priceAfterChange, formatString);
        //check if remove decial then remove last 3 charactor (.00)
        if (roundStyle == "remove_decimal") {
          let decimaString = priceAfterFormat.substr(
            priceAfterFormat.length - 3
          );
          if (decimaString == ".00" || decimaString == ",00") {
            priceAfterFormat = priceAfterFormat.slice(0, -3);
          }
        }
      }

      let newPrice = moneyFormat.replace(formatString, priceAfterFormat);
      let lowestPriceAttr = priceElement.attr("bss-b2b-product-lowest-price");
      let fromPriceAttr = priceElement.attr("bss-b2b-product-from-price");
      if (typeof lowestPriceAttr !== "undefined" && lowestPriceAttr !== false) {
        newPrice = "from " + newPrice;
      } else if (
        typeof fromPriceAttr !== "undefined" &&
        fromPriceAttr !== false
      ) {
        newPrice = "from " + newPrice;
      }
      if (isSalePrice) {
        newPrice = `Save<br>${newPrice}`;
      }
      if (isNowPrice) {
        newPrice = `now ${newPrice}`;
      }
      if (preFixDiscount) {
        newPrice = `- ${newPrice}`;
      }
      priceElement.html(newPrice);
    });
    //show price
    $("[bss-b2b-product-id]").css("visibility", "visible");
    $("[bss-b2b-product-id],[bss-b2b-product-parent-price]").show();
    //    show price cart
    $("[bss-b2b-final-line-price],[bss-b2b-item-final-price]").css(
      "visibility",
      "visible"
    );
    //Fix for dnd
    //Ajax cart and total price cart
    $(
      ".mini-cart__recap-price-line span[bss-b2b-cart-total-price],[bss-b2b-cart-total-price]"
    ).css("visibility", "visible");
    $(
      "[data-cart-subtotal],#cart-total,#total-cart-bottom,[bss-b2b-ajax-cart-subtotal]"
    ).fadeIn(700);
    $(
      "[data-cart-subtotal],#cart-total,#total-cart-bottom,[bss-b2b-ajax-cart-subtotal],[bss-b2b-final-line-price]"
    ).css("visibility", "visible");
    $("[bss-b2b-cart-item-key][bss-b2b-original-line-price]").css(
      "visibility",
      "visible"
    );
    $("[data-cart-item-regular-price]").css("visibility", "visible");
    if (customPriceEl) {
      customPriceEl.css("visibility", "visible");
      customPriceEl.show();
    }
    allPriceElements.css("visibility", "visible");
    allPriceElements.show();
  };

  BSS_B2B.MC.initCurrencySwitcher = function () {
    const deviceWitdh = $(window).width();
    let positionClass = "";
    const showOnMobile = currencyConfig.show_on_mobile;
    const showOnDesktop = currencyConfig.show_on_desktop;

    const desktopPosition = currencyConfig.desktop_position;
    const mobilePosition = currencyConfig.mobile_position;

    if (deviceWitdh > 600 && showOnDesktop) {
      positionClass = desktopPosition;
    } else if (deviceWitdh < 600 && showOnMobile) {
      positionClass = mobilePosition;
    } else {
      return;
    }
    $(".bss-currency-wrapper").addClass(positionClass);

    // cart message

    var path = window.location.pathname.split("/");
    let isCartPage = path[1] == "cart";
    let showMessageOnCartPage = currencyConfig.show_cart_message;
    let cartMessage = currencyConfig.cart_message;
    cartMessage = cartMessage.replace("[checkout_currency]", shopCurrencyCode);
    let cartMessTextColor = currencyConfig.cart_message_color;
    let cartMessTextBgColor = currencyConfig.cart_message_bg;

    if (showMessageOnCartPage && isCartPage) {
      const cartMessageHtml = `<div class="bss-currency-cart-message" style="text-align: center; padding: 1rem; color:${cartMessTextColor}; background-color: ${cartMessTextBgColor};">
                                    ${cartMessage}
                                    </div>`;
      $("#shopify-section-header").after(cartMessageHtml);
    }

    //apply auto convert currency base on IP
    // only check first time

    if (currencyConfig && currencyConfig.auto_location) {
      if (isFirstTime) {
        let countryCode = BSS_B2B.countryCode;
        if (countryCode !== "" && countryCode !== undefined) {
          currencyList.map((item) => {
            if (item.code.includes(countryCode)) {
              sessionCurrencyCode = item.code;
              let moneyFormat =
                currencyFormat[sessionCurrencyCode].money_with_currency_format;
              let formatString = moneyFormat.substring(
                moneyFormat.indexOf("{"),
                moneyFormat.indexOf("}}") + 2
              );
              console.log(formatString, "formatString");
              sessionCurrencyFormat = formatString;

              //set current currency data to session
              sessionStorage.setItem("currentCurrency", sessionCurrencyCode);
              sessionStorage.setItem(
                "currentCurrencyFormat",
                sessionCurrencyFormat
              );
            }
          });
        }
      }
    }

    if (!isEnableCP || !BSS_B2B.configData || BSS_B2B.configData.length == 0) {
      sessionCurrencyCode = sessionStorage.getItem("currentCurrency");
      BSS_B2B.MC.preConvertCurrency(
        sessionCurrencyCode,
        sessionCurrencyFormat,
        false,
        true
      );
    }
    $(".bss-currency-wrapper").fadeIn(100);

    $("#switcher").on("click", function (e) {
      $("#switcher").toggleClass("open");
    });

    $(".bss-nice-select li.option").on("click", function (e) {
      let $currenctCurrencyElement = $(
        ".bss-nice-select span.current-currency"
      );
      let $currenctCurrencyFlag = $(".bss-nice-select span.current .flags");

      let currentCurrencyCode = $(".current-currency").html();

      $(".option.notranslate.selected").removeClass("selected");
      const selectedElement = e.target;
      $(selectedElement).addClass("selected");

      const selectedFlag = $(selectedElement).find(".flags").attr("class");
      $currenctCurrencyElement.html($(selectedElement).attr("data-value"));
      $currenctCurrencyFlag.attr("class", selectedFlag);

      let selectedCurrencyCode = $(selectedElement).attr("data-value");

      let moneyFormat =
        currencyFormat[selectedCurrencyCode].money_with_currency_format;

      let formatString = moneyFormat.substring(
        moneyFormat.indexOf("{"),
        moneyFormat.indexOf("}}") + 2
      );

      //set current currency data to session
      sessionStorage.setItem("currentCurrency", selectedCurrencyCode);
      sessionStorage.setItem("currentCurrencyFormat", formatString);

      let priceEl = $("span[bss-b2b-product-price]");
      let allPriceElements = $(
        "[bss-b2b-product-price]," +
          "[bss-b2b-product-id]," +
          "[bss-b2b-current-variant-price]," +
          "[bss-b2b-product-compare-price]," +
          "[bss-b2b-product-parent-price], " +
          "[bss-b2b-item-original-price], " +
          "[bss-b2b-original-line-price], " +
          "[data-cart-subtotal], " +
          "[bss-b2b-cart-total-price], " +
          "[bss-shop-base-currency], " +
          "[bss-b2b-cart-discount-total], " +
          ".bss-qb-total-price-item, " +
          ".bss-b2b-variant-unit-price, " +
          //fix theme minimal
          ".product-single__sale-price," +
          //fix theme Narrative
          "[data-compare-price]," +
          //fix theme supply
          "#comparePrice-product-template," +
          ".product-single__price--compare," +
          // fix for supply theme on vnđ
          ".inline-list.product-meta [bss-b2b-product-price][data-sale-price] span[aria-hidden]," +
          //fix theme Boundless
          ".js-price," +
          "[data-cart-item-regular-price]"
      );
      $.each(allPriceElements, function (index, priceElement) {
        priceElement = $(priceElement);
        // fix sale price for Brooklyn theme
        let isSalePrice = false;
        let isNowPrice = false;
        if (priceElement.children().length > 0 || $(priceElement).is("meta")) {
          //fix for theme supply
          if (
            priceElement.closest("ul.inline-list").length &&
            priceElement.children().length > 1
          ) {
            if (BSS_B2B.page.isProductPage()) {
              if (!$(priceElement.children()[0]).children().is("sup")) {
                return true;
              }
            }
          } else if (priceElement.children().is("br")) {
            if (priceElement.html().includes("Save<br>")) {
              isSalePrice = true;
            }
          } else if (priceElement.children().is(".txt--emphasis")) {
            //fix theme Boundless
            lowestPriceElement = priceElement;
            if (priceElement.html().includes("now")) {
              isNowPrice = true;
            }
          } else if (!priceElement.children().is("sup")) {
            return true;
          }
        }
        let priceHtml = priceElement.html();

        //fix for theme supply
        if (priceHtml.includes("<sup")) {
          priceHtml = priceHtml
            .substring(0, priceHtml.indexOf("<sup"))
            .replace("-", "");
        }
        if (priceHtml.includes("now")) {
          isNowPrice = true;
        }
        //fix theme Boundless
        if (priceHtml.includes("-")) {
          priceHtml = priceHtml.replace(/\-/g, "");
        }
        const shopBaseCurrencyValue = priceElement.attr(
          "bss-shop-base-currency"
        );

        let afterChange = Currency.convert(
          shopBaseCurrencyValue,
          shopCurrencyCode,
          selectedCurrencyCode
        );
        afterChange = parseFloat(afterChange) / 100;
        afterChange = afterChange.toFixed(2);

        let priceAfterFormat = Shopify.formatMoney(afterChange, formatString);

        let isEnableRoundPrice = currencyConfig.round_price;
        if (isEnableRoundPrice) {
          //do round price
          let roundStyle = currencyConfig.round_style;
          afterChange = Math.round(parseFloat(afterChange)) * 100;
          priceAfterFormat = Shopify.formatMoney(afterChange, formatString);
          //check if remove decial then remove last 3 charactor (.00)
          if (roundStyle == "remove_decimal") {
            let decimaString = priceAfterFormat.substr(
              priceAfterFormat.length - 3
            );
            if (decimaString == ".00" || decimaString == ",00") {
              priceAfterFormat = priceAfterFormat.slice(0, -3);
            }
          }
        }

        let newPrice = moneyFormat.replace(formatString, priceAfterFormat);
        let lowestPriceAttr = priceElement.attr("bss-b2b-product-lowest-price");
        let fromPriceAttr = priceElement.attr("bss-b2b-product-from-price");
        if (
          typeof lowestPriceAttr !== "undefined" &&
          lowestPriceAttr !== false
        ) {
          newPrice = "from " + newPrice;
        } else if (
          typeof fromPriceAttr !== "undefined" &&
          fromPriceAttr !== false
        ) {
          newPrice = "from " + newPrice;
        }
        if (isSalePrice) {
          newPrice = `Save<br>${newPrice}`;
        }
        if (isNowPrice) {
          newPrice = `now ${newPrice}`;
        }
        priceElement.html(newPrice);
      });
    });
  };

  BSS_B2B.MC.changeVariantOptionProductPage = function () {
    var cartForm = $('form[action*="/cart/add"]');
    $(cartForm)
      .find(
        "select, " +
          "input.single-option-selector__radio," +
          "input.product-form__single-selector" +
          BSS_B2B.getCssSelector("product_variant_option_input")
      )
      .on("change", function () {
        var delayTime = 200;
        $(".product-price-unit").hide();
        setTimeout(function () {
          let sessionCurrencyCode = sessionStorage.getItem("currentCurrency");
          let sessionCurrencyFormat = sessionStorage.getItem(
            "currentCurrencyFormat"
          );
          BSS_B2B.MC.preConvertCurrency(
            sessionCurrencyCode,
            sessionCurrencyFormat
          );
          $("[data-regular-price]").css("visibility", "visible");
          $("[data-regular-price]").show();
          $(".product-price-unit").show();
        }, delayTime);
      });
  };

  BSS_B2B.MC.initCurrencySwitcher();

  BSS_B2B.MC.hideCartPriceElements = function () {
    $(BSS_B2B.cart.inputQuantityElement).prop("disabled", true);
    $(
      "[data-cart-item-regular-price]," +
        "[bss-b2b-item-price]," +
        "[data-cart-subtotal]," +
        "[bss-b2b-ajax-cart-subtotal]," +
        "[data-cart-item-id]  [data-cart-item-price-container] .cart-item__original-price," +
        "[data-cart-item-id]  [data-cart-item-line-price-container] .cart-item__original-price," +
        ".cartTotalSelector," +
        ".cart_subtotal" +
        BSS_B2B.getCartPriceClass("cart_total") +
        BSS_B2B.getCartPriceClass("cart_subtotal") +
        BSS_B2B.getCartPriceClass("cart_item_regular_price") +
        BSS_B2B.getCartPriceClass("cart_item_original_price")
    ).hide();
    let cartPriceElement = $(
      "[data-cart-subtotal]," +
        "[bss-b2b-product-price]," +
        "[bss-b2b-product-id]," +
        "[bss-b2b-item-final-price]," +
        "[bss-b2b-final-line-price]," +
        "[bss-b2b-cart-discount-amount]," +
        "[data-cart-item-discount-amount]," +
        "[data-cart-item-final-price]," +
        "[data-cart-item-original-price]," +
        "[data-cart-price]," +
        "[data-unit-price]," +
        "[bss-b2b-cart-item-key]," +
        "[bss-b2b-cart-discount-total]," +
        "[data-cart-discount-amount]," +
        ".cart-item__price," +
        ".cart-subtotal--price," +
        ".order-discount--cart," +
        "[data-cart-item-regular-price]"
    );
    cartPriceElement.hide();
  };
  BSS_B2B.MC.showCartPriceElements = function () {
    $(BSS_B2B.cart.inputQuantityElement).prop("disabled", false);
    $(
      "[data-cart-item-regular-price]," +
        "[bss-b2b-item-price]," +
        "[data-cart-subtotal]," +
        "[bss-b2b-ajax-cart-subtotal]," +
        "[data-cart-item-id]  [data-cart-item-price-container] .cart-item__original-price," +
        "[data-cart-item-id]  [data-cart-item-line-price-container] .cart-item__original-price," +
        ".cartTotalSelector," +
        ".cart_subtotal" +
        BSS_B2B.getCartPriceClass("cart_total") +
        BSS_B2B.getCartPriceClass("cart_subtotal") +
        BSS_B2B.getCartPriceClass("cart_item_regular_price") +
        BSS_B2B.getCartPriceClass("cart_item_original_price")
    ).show();
    let cartPriceElement = $(
      "[data-cart-subtotal]," +
        "[bss-b2b-product-price]," +
        "[bss-b2b-product-id]," +
        "[bss-b2b-item-final-price]," +
        "[bss-b2b-final-line-price]," +
        "[bss-b2b-cart-discount-amount]," +
        "[data-cart-item-discount-amount]," +
        "[data-cart-item-final-price]," +
        "[data-cart-item-original-price]," +
        "[data-cart-price]," +
        "[data-unit-price]," +
        "[bss-b2b-cart-item-key]," +
        "[bss-b2b-cart-discount-total]," +
        "[data-cart-discount-amount]," +
        ".cart-item__price," +
        ".cart-subtotal--price," +
        ".order-discount--cart," +
        "[data-cart-item-regular-price]"
    );
    cartPriceElement.show();
  };

  BSS_B2B.MC.handleCartPrice = function () {
    var isExistedUpdateCartBtn = BSS_B2B.cart.isExistedUpdateCartBtn;
    if (!isExistedUpdateCartBtn) {
      $(BSS_B2B.cart.inputQuantityElement).off();
      $(BSS_B2B.cart.inputQuantityElement).on("change", function () {
        let hideCartPriceInterval = setInterval(function () {
          BSS_B2B.MC.hideCartPriceElements();
        }, 1);
        var delayTime = 1500;
        setTimeout(function () {
          let customPriceELement = $(
            "[data-cart-subtotal]," +
              "[bss-b2b-product-price]," +
              "[bss-b2b-product-id]," +
              "[bss-b2b-item-final-price]," +
              "[bss-b2b-final-line-price]," +
              "[bss-b2b-cart-discount-amount]," +
              "[data-cart-item-discount-amount]," +
              "[data-cart-item-final-price]," +
              "[data-cart-item-original-price]," +
              "[data-cart-price]," +
              "[data-unit-price]," +
              "[bss-b2b-cart-item-key]," +
              "[bss-b2b-cart-discount-total]," +
              "[data-cart-discount-amount]," +
              ".cart-item__price," +
              ".cart-subtotal--price," +
              ".order-discount--cart," +
              "[data-cart-item-regular-price]"
          );
          customPriceELement.hide();
          customPriceELement.css("visibility", "hidden");
          let sessionCurrencyCode = sessionStorage.getItem("currentCurrency");
          let sessionCurrencyFormat = sessionStorage.getItem(
            "currentCurrencyFormat"
          );
          BSS_B2B.MC.preConvertCurrency(
            sessionCurrencyCode,
            sessionCurrencyFormat,
            customPriceELement
          );
          clearInterval(hideCartPriceInterval);
          BSS_B2B.MC.reRenderQtyChangeEvent();
        }, delayTime);
      });
    }

    let changeQtyCartBtn = $(
      ".ajaxifyCart--qty-adjuster," +
        ".ajaxcart__qty-adjust," +
        ".js-qty__adjust"
    );
    changeQtyCartBtn.on("click", function () {
      var delayTime = 3000;
      let hideCartPriceInterval = setInterval(function () {
        BSS_B2B.MC.hideCartPriceElements();
      }, 1);
      setTimeout(function () {
        let customPriceELement = $(
          "[data-cart-subtotal]," +
            "[bss-b2b-product-id]," +
            "[bss-b2b-product-price]," +
            "[bss-b2b-item-final-price]," +
            "[bss-b2b-final-line-price]," +
            "[bss-b2b-cart-discount-amount]," +
            "[data-cart-item-discount-amount]," +
            "[data-cart-item-final-price]," +
            "[data-cart-item-original-price]," +
            "[data-cart-price]," +
            "[bss-b2b-cart-item-key]," +
            "[bss-b2b-ajax-cart-subtotal]," +
            "[bss-b2b-cart-discount-total]," +
            "[data-cart-discount-amount]," +
            ".cart-item__price," +
            ".cart-subtotal--price," +
            ".order-discount--cart," +
            "[bss-b2b-product-sale-price]:not([bss-shop-base-currency])," +
            "[data-cart-item-regular-price]"
        );
        customPriceELement.hide();
        customPriceELement.css("visibility", "hidden");
        let sessionCurrencyCode = sessionStorage.getItem("currentCurrency");
        let sessionCurrencyFormat = sessionStorage.getItem(
          "currentCurrencyFormat"
        );
        BSS_B2B.MC.preConvertCurrency(
          sessionCurrencyCode,
          sessionCurrencyFormat,
          customPriceELement
        );
        clearInterval(hideCartPriceInterval);
        BSS_B2B.MC.reRenderQtyChangeEvent();
      }, delayTime);
    });
  };

  BSS_B2B.MC.reRenderQtyChangeEvent = function () {
    BSS_B2B.MC.handleCartPrice();
    BSS_B2B.MC.showCartPriceElements();
  };

  BSS_B2B.MC.handleAjaxCart = function () {
    var ajaxCartDelayTime = 3000;
    var customAjaxCartDelayTime = BSS_B2B.getCssSelector(
      "ajax_cart_time_delay_opening_cart"
    );
    if (customAjaxCartDelayTime != "" && !isNaN(customAjaxCartDelayTime)) {
      ajaxCartDelayTime = parseInt(customAjaxCartDelayTime);
    }

    var ajaxCartElement = $(
      '[id^="AddToCart"]:not(form), ' +
        '[id^="addToCart"]:not(form):not(span),' +
        'button[aria-controls="CartDrawer"],' +
        'a[aria-controls="CartDrawer"], ' +
        'button[name="add"].product-form__add-to-cart,' +
        'button[name="add"].product__add-to-cart-button,' +
        'button[name="add"].add-to-cart,' +
        "a.ajax-cart__toggle," +
        "span.icon__fallback-text," +
        "button#add-to-cart.add-to-cart," +
        "a.cart-toggle," +
        ".mini-cart-wrap[data-cart-mini-toggle]," +
        ".addtocart-button-active[data-product-submit]," +
        "button.product-form--atc-button," +
        "button.productitem--action-atc," +
        "#add-to-cart-product-template," +
        '.product-form__add-button[data-action="add-to-cart"],' +
        '.header__cart-toggle[data-action="toggle-mini-cart"],' +
        'button[type="submit"][data-action="add-to-cart"],' +
        "button.btn-addtocart," +
        'form[action*="/cart/add"] input.AddtoCart,' +
        "a[data-cart-toggle][data-dropdown-menu]," +
        "input[data-btn-addtocart]," +
        ".cart-block-click," +
        "button[data-btn-addtocart]," +
        'a.js-cart-trigger[href="/cart"],' +
        "form.js-product-form," +
        //fix for steve-labpro by ThaBi
        'form[action*="/cart/add"] button.single_add_to_cart_button.button,' +
        '.Header__Wrapper .Header__FlexItem a[data-drawer-id="sidebar-cart"],' +
        "button.product-form__cart-submit," +
        ".add-to-cart-box .add-to-cart," +
        "a.header-cart-btn.cart-toggle," +
        //fix biomatrixweb by vitu
        ".product-page--submit-action .btn," +
        //fix monpetitherbier by vitu
        ".ajax-submit.action_button.add_to_cart," +
        ".site-header__cart.cart-modal," +
        'form[action*="/cart/add"] button.ajax-submit.button--add-to-cart,' +
        'form[action*="/cart/add"] div.add-to-cart button.button[type="submit"],' +
        // fix for shop.repairpartners by ThaBi
        "a.add-cart-btn" +
        BSS_B2B.getCssSelector("ajax_cart_action_button")
    );

    if (ajaxCartElement.length) {
      ajaxCartElement.on("click", function (e) {
        var changeCurrencyInterval = setInterval(function () {
          let customPriceELement = $(
            "[data-cart-subtotal]," +
              "[bss-b2b-product-id]," +
              "[bss-b2b-product-price]," +
              "[bss-b2b-item-final-price]," +
              "[bss-b2b-final-line-price]," +
              "[bss-b2b-cart-discount-amount]," +
              "[data-cart-item-discount-amount]," +
              "[data-cart-item-final-price]," +
              "[data-cart-item-original-price]," +
              "[data-cart-price]," +
              "[bss-b2b-cart-item-key]," +
              ".cart-item__price," +
              ".cart-subtotal--price," +
              "[bss-b2b-product-sale-price]:not([bss-shop-base-currency])," +
              "[data-cart-item-regular-price]"
          );
          customPriceELement.hide();
          customPriceELement.css("visibility", "hidden");
          let sessionCurrencyCode = sessionStorage.getItem("currentCurrency");
          let sessionCurrencyFormat = sessionStorage.getItem(
            "currentCurrencyFormat"
          );
          BSS_B2B.MC.preConvertCurrency(
            sessionCurrencyCode,
            sessionCurrencyFormat,
            customPriceELement
          );
          // init cart price listener for ajax cart
          if ($(BSS_B2B.cart.inputQuantityElement).length) {
            BSS_B2B.MC.handleCartPrice();
          }
        }, 300);
        setTimeout(function () {
          clearInterval(changeCurrencyInterval);
        }, ajaxCartDelayTime);
      });
    }
  };

  BSS_B2B.MC.changeCurrencyCartPageQB = function () {
    // init convert currency function
    let priceElSelector =
      ".bss-qb-cart-subtotal," +
      "[data-cart-subtotal]," +
      "[bss-b2b-product-price]," +
      ".bss-qb-total-price-item,";
    if (!isEnableCP) {
      priceElSelector += "[data-cart-item-regular-price],";
    }
    let lastCharactor = priceElSelector.substr(priceElSelector.length - 1);
    if (lastCharactor == ",") {
      priceElSelector = priceElSelector.substr(0, priceElSelector.length - 1);
    }

    let customPriceELement = $(priceElSelector);

    customPriceELement.hide();
    customPriceELement.css("visibility", "hidden");
    let sessionCurrencyCode = sessionStorage.getItem("currentCurrency");
    let sessionCurrencyFormat = sessionStorage.getItem("currentCurrencyFormat");
    BSS_B2B.MC.preConvertCurrency(
      sessionCurrencyCode,
      sessionCurrencyFormat,
      customPriceELement
    );
  };

  function rePreConvertCurrency() {
    let sessionCurrencyCode = sessionStorage.getItem("currentCurrency");
    let sessionCurrencyFormat = sessionStorage.getItem("currentCurrencyFormat");
    BSS_B2B.MC.preConvertCurrency(sessionCurrencyCode, sessionCurrencyFormat);
  }

  //     QUICK VIEW
  function handleQuickViewForCurrency() {
    let quickViewBtn = $(
      "a.full-width-link ," +
        ".quick-product__btn[data-product-id]," +
        ".productitem--action-trigger[data-quickshop-full], .productitem--action-trigger[data-quickshop-slim]," +
        "a[data-fancybox].quick"
    );
    quickViewBtn.on("click", function () {
      setTimeout(function () {
        rePreConvertCurrency();
        // handle variant option for express theme
        BSS_B2B.MC.changeVariantOptionProductPage();
      }, 1500);
    });
  }

  handleQuickViewForCurrency();

  if (!isEnableCP || !BSS_B2B.configData || !BSS_B2B.configData.length) {
    if (BSS_B2B.page.isProductPage()) {
      BSS_B2B.MC.changeVariantOptionProductPage();
    }
    //check for feature product on homepage Minimal theme
    var hrefArr = BSS_B2B.page.getPage();
    var isHomePage = hrefArr[hrefArr.length - 2] == window.location.host;
    var cartForm = $('form[action*="/cart/add"]');
    if (isHomePage && cartForm.length) {
      BSS_B2B.MC.changeVariantOptionProductPage();
    }

    BSS_B2B.MC.handleAjaxCart();
    BSS_B2B.MC.handleCartPrice();
  }
}
