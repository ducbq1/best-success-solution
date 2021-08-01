export default function handleCartPrice(
  $,
  BSS_B2B,
  shopData,
  Shopify,
  isEnableQB,
  isEnableCP,
  isEnableAMO,
  isEnableMc
) {
  BSS_B2B.cart.isExistedUpdateCartBtn =
    $(
      'form[action*="/cart"] button[type="submit"][name="update"]:visible, ' +
        'form[action*="/cart"] input[type="submit"][name="update"]:visible,form[action*="/cart"] .update.btn.item' +
        BSS_B2B.getCartPriceClass("cart_update_cart_btn")
    ).length > 0;

  BSS_B2B.cart.cartQtyOnChange = function (
    timeDelayToReCalculate,
    timeDelayToChangeQuantity,
    isFirstLoad
  ) {
    if (BSS_B2B.amo.warning && BSS_B2B.amo.warning.length > 0) {
      BSS_B2B.amo.warning = [];
    }
    $(BSS_B2B.cart.inputQuantityElement).prop("disabled", true);
    if (!isEnableQB || !BSS_B2B.qbRules || BSS_B2B.qbRules.length == 0) {
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
    }
    //Fix for dnd-dice
    var checkoutButton = $(
      '.cart-wrapper button.cart-recap__checkout[name="checkout"][type="submit"], input.ajax-cart__button-submit'
    );
    if (checkoutButton.length > 0) {
      setTimeout(function () {
        BSS_B2B.cart.fixer(shopData, true, false);
        BSS_B2B.handleCartCheckoutBtn(shopData);
      }, 4000);
    } else {
      setTimeout(function () {
        BSS_B2B.cart.fixer(shopData, true, false);
      }, timeDelayToReCalculate);
    }

    setTimeout(
      function () {
        $(BSS_B2B.cart.inputQuantityElement).prop("disabled", false);
      },
      isFirstLoad ? 2500 : timeDelayToChangeQuantity
    );
  };

  BSS_B2B.cart.updateWhenItemQuantityChange = function (
    shopData,
    cartData,
    isChangeQuantity,
    isAjaxCart,
    productMap,
    updatedLineItems,
    isFirstLoad
  ) {
    var originalTotalPrice = cartData.original_total_price;
    var itemsSubtotalPrice = cartData.items_subtotal_price;
    var totalDiscount = 0;

    var timeDelayToReCalculate = 1200;
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
    var inputQuantityElement = $(BSS_B2B.cart.inputQuantityElement);

    var buttonChangeQuantity = $(BSS_B2B.cart.buttonChangeQuantity);
    var cpPricingList = [];

    for (var i = 0; i < updatedLineItems.length; i++) {
      var items = [];
      for (let k = 0; k < cartData.items.length; k++) {
        if (cartData.items[k].product_id == updatedLineItems[i].id) {
          items.push(cartData.items[k]);
        }
      }

      for (var l = 0; l < items.length; l++) {
        var item = items[l];
        var originalPrice = item.original_price;
        var originalLinePrice = item.original_line_price;
        var discount = parseFloat(updatedLineItems[i].value);

        var type = updatedLineItems[i].discount_type;

        var modifiedItemPrice = originalPrice;
        var modifiedLineItemPrice = originalLinePrice;

        if (type == 1) {
          modifiedItemPrice =
            discount * 100 > originalPrice ? 0 : originalPrice - discount * 100;
          modifiedLineItemPrice = modifiedItemPrice * item.quantity;

          totalDiscount +=
            (discount * 100 > originalPrice ? originalPrice : discount * 100) *
            item.quantity;
        } else if (type == 2) {
          //fix for discount is odd orr price is odd

          modifiedLineItemPrice = modifiedItemPrice * item.quantity;
          modifiedItemPrice = modifiedItemPrice * (1.0 - discount / 100);
          modifiedLineItemPrice =
            originalLinePrice -
            ((originalPrice * (discount / 100)).toFixed(2) / 100).toFixed(2) *
              100 *
              item.quantity;

          totalDiscount +=
            ((originalPrice * (discount / 100)).toFixed(2) / 100).toFixed(2) *
            100 *
            item.quantity;
        } else if (type == 0) {
          var flatPrice = parseFloat(updatedLineItems[i].value) * 100;
          modifiedItemPrice =
            flatPrice > originalPrice ? originalPrice : flatPrice;
          modifiedLineItemPrice = modifiedItemPrice * item.quantity;
          totalDiscount +=
            (flatPrice > originalPrice ? 0 : originalPrice - flatPrice) *
            item.quantity;
        }
        var cartItemProductMap = new Map();
        if (cartData.items && cartData.items.length > 0) {
          var domain = shopData.shop.permanent_domain;
          var handleUrls = [];
          var handles = [];
          var keyIdMap = [];

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
        }

        if (isEnableQB || isEnableAMO) {
          cpPricingList.push({
            modifiedLineItemPrice: modifiedLineItemPrice,
            modifiedItemPrice: modifiedItemPrice,
            key: item.key,
            quantity: item.quantity,
          });
        }

        //fix for nobby-mexico by XuTho
        if (BSS_B2B.storeId == 918) {
          setTimeout(() => {
            $("[data-id=" + item.variant_id + "]")
              .parent()
              .parent()
              .find(".product-price")
              .html(Shopify.formatMoney(modifiedItemPrice));
            $("[data-id=" + item.variant_id + "]")
              .parent()
              .parent()
              .find(".product-total-price")
              .html(Shopify.formatMoney(modifiedLineItemPrice));
          }, 1000);
        }
        $('.product-price[id="' + item.variant_id + '"]').html(
          Shopify.formatMoney(modifiedItemPrice)
        );
        //end
        // fix for shop.repairpartners by ThaBi
        if (BSS_B2B.storeId == 1283) {
          setTimeout(() => {
            $(
              '[bss-b2b-cart-item-key="' +
                item.key +
                '"][bss-b2b-item-original-price]'
            ).html(Shopify.formatMoney(modifiedItemPrice));
          }, 1000);
        }
        // end fix for shop.repairpartners

        $(
          '[bss-b2b-cart-item-key="' +
            item.key +
            '"][bss-b2b-item-original-price]'
        ).html(Shopify.formatMoney(modifiedItemPrice));
        $(
          '[bss-b2b-cart-item-key="' + item.key + '"][bss-b2b-item-final-price]'
        ).html(Shopify.formatMoney(modifiedItemPrice));
        $(
          '[bss-b2b-original-line-price][bss-b2b-cart-item-key="' +
            item.key +
            '"]'
        ).html(Shopify.formatMoney(modifiedLineItemPrice));
        $(
          '[bss-b2b-final-line-price][bss-b2b-cart-item-key="' + item.key + '"]'
        ).html(Shopify.formatMoney(modifiedLineItemPrice));
        $(
          '[bss-b2b-ajax-cart-line-price][bss-b2b-cart-item-key="' +
            item.key +
            '"]'
        ).html(Shopify.formatMoney(modifiedLineItemPrice));
        $(
          '[bss-b2b-ajax-original-line-price][bss-b2b-cart-item-key="' +
            item.key +
            '"]'
        ).html(Shopify.formatMoney(modifiedLineItemPrice));
        $(
          '[bss-b2b-cart-item-key="' +
            item.key +
            '"][bss-b2b-ajax-original-line-price]'
        ).html(Shopify.formatMoney(modifiedLineItemPrice));
        $(
          '[data-cart-item-id="' +
            item.key +
            '"]  [data-cart-item-price-container] .cart-item__original-price'
        ).html(Shopify.formatMoney(modifiedItemPrice));
        $(
          '[bss-b2b-cart-item-key="' +
            item.product_id +
            '"][bss-b2b-ajax-cart-line-price]'
        ).html(Shopify.formatMoney(modifiedLineItemPrice));
        $(
          '[data-cart-item-id="' +
            item.key +
            '"]  [data-cart-item-line-price-container] .cart-item__original-price'
        ).html(Shopify.formatMoney(modifiedLineItemPrice));
        $(
          '[bss-b2b-cart-item-key="' +
            item.id +
            '"][bss-b2b-ajax-original-line-price]'
        ).html(Shopify.formatMoney(modifiedLineItemPrice));
        $(".atc-banner--container [data-atc-banner-product-price-value]").html(
          Shopify.formatMoney(modifiedItemPrice)
        );
        // fix for beuce
        $(".mini-products-list #cart-item-" + item.variant_id + " .price").html(
          Shopify.formatMoney(modifiedLineItemPrice)
        );
        // end fix
        //Fix for purefemale update price based on variant id xutho
        $(
          '[data-cart-item][data-variant-id="' + item.variant_id + '"] .money'
        ).html(Shopify.formatMoney(modifiedItemPrice));
        if (
          $('[data-cart-item][data-variant-id="' + item.variant_id + '"]')
            .closest('form[action*="/checkout"]')
            .find(".cart_subtotal")
        ) {
          var parent = $(
            '[data-cart-item][data-variant-id="' + item.variant_id + '"]'
          )
            .closest('form[action*="/checkout"]')
            .find(".cart_subtotal");
          if (parent.find(".money").length > 0) {
            parent
              .find(".money")
              .html(Shopify.formatMoney(itemsSubtotalPrice - totalDiscount));
          }
        }
        // fix for imageexchange
        let parentImageExchangeAjaxItemLinePrice = $(
          'a[href*="variant=' + item.variant_id + '"].cart-image'
        ).closest(".cart-row");
        if (parentImageExchangeAjaxItemLinePrice.length) {
          let imageExchangeAjaxItemLinePrice = $(
            parentImageExchangeAjaxItemLinePrice[0]
          ).find(
            "[bss-b2b-product-id][bss-b2b-product-handle][bss-b2b-variant-id]"
          );
          $(imageExchangeAjaxItemLinePrice).html(
            Shopify.formatMoney(modifiedLineItemPrice)
          );
          $(
            "[bss-b2b-product-id][bss-b2b-product-handle][bss-b2b-variant-id]"
          ).css("visibility", "visible");
        }
        // end
        // fix for wdw  by ThaBi
        if (BSS_B2B.storeId == 664) {
          if (
            $(
              '.bss-b2b-wdw-vechta-origin-price[data-product-key="' +
                item.key +
                '"]'
            ).length
          ) {
            $(
              '.bss-b2b-wdw-vechta-origin-price[data-product-key="' +
                item.key +
                '"]'
            ).html(Shopify.formatMoney(originalPrice));
            $(
              '.bss-b2b-wdw-vechta-origin-price[data-product-key="' +
                item.key +
                '"]'
            ).css("visibility", "visible");
            $(
              '.bss-b2b-wdw-vechta-origin-price[data-product-key="' +
                item.key +
                '"]'
            ).css("text-decoration", "line-through");
          }
        }
        // fix for industrial-athletic (vitu)
        let variantIds = [];
        $.each(
          $(".tt-cart-list .tt-item .tt-item-close a:first-child"),
          function (i, v) {
            let hrefProducts = [];
            hrefProducts.push(this.getAttribute("href"));
            hrefProducts.forEach((v) => {
              variantIds.push(
                v.substring(v.indexOf("id="), v.indexOf("&")).replace("id=", "")
              );
            });
          }
        );
        $.each(
          $(
            ".tt-cart-list .tt-item [data-cart-item][data-variant-id].tt-price"
          ),
          function (i, v) {
            this.setAttribute("data-variant-id", variantIds[i]);
          }
        );
        $(
          '[data-cart-item][data-variant-id="' + item.variant_id + '"].tt-price'
        ).html(Shopify.formatMoney(modifiedItemPrice));

        // end fix for industrial-athletic (vitu)

        //fix monpetitherbier by vitu
        $(
          '[bss-b2b-final-line-price][bss-b2b-cart-item-key="' + item.key + '"]'
        ).html(Shopify.formatMoney(modifiedLineItemPrice));

        var customCartOriginalPrice = BSS_B2B.getCssSelector(
          "ajax_cart_item_original_price"
        );
        if (customCartOriginalPrice != "") {
          if (isAjaxCart) {
            customCartOriginalPrice = customCartOriginalPrice.replace(
              /itemkey/g,
              item.key
            );
            customCartOriginalPrice = customCartOriginalPrice.replace(",", "");
            $(customCartOriginalPrice).html(
              Shopify.formatMoney(modifiedItemPrice)
            );
          }
        }

        if (isChangeQuantity) {
          $(
            '[data-cart-item-key="' +
              item.key +
              '"] [data-cart-item-regular-price]'
          ).html(Shopify.formatMoney(modifiedItemPrice));
          $(
            '[data-cart-item-key="' + item.key + '"] [bss-b2b-item-final-price]'
          ).html(Shopify.formatMoney(modifiedItemPrice));
          $(
            '[data-cart-item-key="' +
              item.key +
              '"] [data-cart-item-line-price] [data-cart-item-regular-price]'
          ).html(Shopify.formatMoney(modifiedLineItemPrice));
          $(
            '[data-cart-item-id="' +
              item.key +
              '"]  [data-cart-item-price-container] .cart-item__original-price'
          ).html(Shopify.formatMoney(modifiedItemPrice));
          $(
            '[data-cart-item-id="' +
              item.key +
              '"]  [data-cart-item-line-price-container] .cart-item__original-price'
          ).html(Shopify.formatMoney(modifiedLineItemPrice));
          $(
            '[data-cart-item-id="' +
              item.key +
              '"]  [bss-b2b-ajax-original-line-price]'
          ).html(Shopify.formatMoney(modifiedLineItemPrice));
          $(
            '[data-cart-item-id="' + item.key + '"]  [bss-b2b-final-line-price]'
          ).html(Shopify.formatMoney(modifiedLineItemPrice));
        }
      }
    }

    BSS_B2B.cart.cpPricingList = cpPricingList;

    if (isChangeQuantity) {
      if (isAjaxCart) {
        BSS_B2B.handleQuantityChangeAjaxCart(false);
      } else {
        inputQuantityElement.off();
        inputQuantityElement.on("change", function (e) {
          BSS_B2B.cart.cartQtyOnChange(
            timeDelayToReCalculate,
            timeDelayToChangeQuantity,
            isFirstLoad
          );
        });

        //Question: side effect when enable off()
        if (BSS_B2B.storeId == 1138) {
        } else {
          buttonChangeQuantity.off();
        }

        buttonChangeQuantity.on("click", function () {
          if (BSS_B2B.storeId == 1138) {
            $("[bss-b2b-final-line-price]").css("visibility", "hidden");
            $("[bss-b2b-final-line-price]").css("display", "none");
          }
          BSS_B2B.cart.cartQtyOnChange(
            timeDelayToReCalculate,
            timeDelayToChangeQuantity,
            isFirstLoad
          );
        });
        if (!isEnableAMO) {
          $(BSS_B2B.cart.removeButtons).on("click", function () {
            BSS_B2B.cart.cartQtyOnChange(
              timeDelayToReCalculate,
              timeDelayToChangeQuantity,
              isFirstLoad
            );
          });
        }
      }
    } else {
      $(BSS_B2B.cart.removeButtons).on("click", function () {
        BSS_B2B.cart.cartQtyOnChange(
          timeDelayToReCalculate,
          timeDelayToChangeQuantity,
          isFirstLoad
        );
      });
    }
    var modifiedItemsSubtotalPrice = itemsSubtotalPrice - totalDiscount;
    BSS_B2B.cart.modifiedItemsSubtotalPrice = modifiedItemsSubtotalPrice;
    $("[bss-b2b-cart-total-price]").html(
      Shopify.formatMoney(modifiedItemsSubtotalPrice)
    );
    $("[bss-b2b-ajax-cart-subtotal]").html(
      Shopify.formatMoney(modifiedItemsSubtotalPrice)
    );
    $("[bss-b2b-total-discount]").html(Shopify.formatMoney(totalDiscount));
    //Subtotal for supply theme
    $(".cart-subtotal--price").html(
      Shopify.formatMoney(modifiedItemsSubtotalPrice)
    );
    $("#cart-total").html(Shopify.formatMoney(modifiedItemsSubtotalPrice));
    $("#total-cart-bottom").html(
      Shopify.formatMoney(modifiedItemsSubtotalPrice)
    );
    $(".cartTotalSelector").html(
      Shopify.formatMoney(modifiedItemsSubtotalPrice)
    );
    // fix for industrial-athletic (vitu)
    $(".tt-cart-total-price").html(
      Shopify.formatMoney(modifiedItemsSubtotalPrice)
    );
    $(".tt-product-total .total-product-js").html(
      Shopify.formatMoney(modifiedItemsSubtotalPrice)
    ); //modal cart view in product page
    $(".tt-price.full-total-js").html(
      Shopify.formatMoney(modifiedItemsSubtotalPrice)
    );
    $(
      ".cart__item-sub.cart__item-row.cart__item--subtotal [data-subtotal]"
    ).html(Shopify.formatMoney(modifiedItemsSubtotalPrice));
    if (isAjaxCart) {
      $(
        "[bss-b2b-ajax-cart-subtotal], " +
          ".cart-drawer__subtotal-value, " +
          "[data-cart-price-bubble][data-cart-price]," +
          '[data-section-id="cart-drawer"] [data-cart-subtotal],' +
          "#ajaxifyCart .cart-subtotal--price," +
          ".atc-banner--container [data-atc-banner-cart-subtotal]," +
          ".cartTotalSelector"
      ).html(Shopify.formatMoney(modifiedItemsSubtotalPrice));
    }

    if (isChangeQuantity) {
      if (BSS_B2B.storeId !== 1240) {
        $("[data-cart-subtotal]").html(
          Shopify.formatMoney(modifiedItemsSubtotalPrice)
        );
      }
      $(
        ".cart__item-sub.cart__item-row.cart__item--subtotal [data-subtotal]"
      ).html(Shopify.formatMoney(modifiedItemsSubtotalPrice));
    }

    // fix for curlysecret by ThaBi
    if (
      isChangeQuantity &&
      BSS_B2B.storeId == 621 &&
      BSS_B2B.page.isCartPage()
    ) {
      BSS_B2B.handleCartCheckoutBtn(shopData);
    }

    BSS_B2B.cart.visbileElementAfterUpdateQuantity(
      isAjaxCart,
      isChangeQuantity
    );
    BSS_B2B.cart.hoverMinicart(
      shopData,
      cartData,
      isChangeQuantity,
      isAjaxCart,
      productMap,
      updatedLineItems,
      isFirstLoad
    );
  };

  //add event hover mini cart show product-purefemale-XuTho
  BSS_B2B.cart.hoverMinicart = function (
    shopData,
    cartData,
    isChangeQuantity,
    isAjaxCart,
    productMap,
    updatedLineItems,
    isFirstLoad
  ) {
    var classMiniCart = $(
      ".cart_container.clearfix," +
        //fix monpetitherbier by vitu
        ".cart-container"
    ); //class mini cart
    for (var i = 0; i < classMiniCart.length; i++) {
      // add event click change quantity on minicart
      classMiniCart[i]
        .querySelectorAll(".js-change-quantity")
        .forEach(function (element) {
          element.addEventListener("click", function () {
            setTimeout(function () {
              BSS_B2B.cart.updateWhenItemQuantityChange(
                shopData,
                cartData,
                isChangeQuantity,
                isAjaxCart,
                productMap,
                updatedLineItems,
                false
              );
              BSS_B2B.handleChangeQuantityEventFirstTime(1500, 1500);
            }, 3000);
          });
        });
      // add event click remove item on minicart
      classMiniCart[i]
        .querySelectorAll(".remove-icon")
        .forEach(function (element) {
          element.addEventListener("click", function () {
            setTimeout(function () {
              BSS_B2B.cart.updateWhenItemQuantityChange(
                shopData,
                cartData,
                isChangeQuantity,
                isAjaxCart,
                productMap,
                updatedLineItems,
                false
              );
              BSS_B2B.handleChangeQuantityEventFirstTime(1500, 1500);
            }, 3000);
          });
        });
    }
    // add event click add to cart show minicart from collection page
    var buttonAddToCart = $("button.ajax-submit.action_button.add_to_cart");
    for (var i = 0; i < buttonAddToCart.length; i++) {
      buttonAddToCart[i].addEventListener("click", function () {
        setTimeout(function () {
          BSS_B2B.cart.updateWhenItemQuantityChange(
            shopData,
            cartData,
            isChangeQuantity,
            isAjaxCart,
            productMap,
            updatedLineItems,
            false
          );
          BSS_B2B.handleChangeQuantityEventFirstTime(1500, 1500);
        }, 3000);
      });
    }
  };

  BSS_B2B.cart.getLineItemsPrice = function (
    shopData,
    cartData,
    isChangeQuantity,
    isAjaxCart
  ) {
    var isExistedUpdateCartBtn = BSS_B2B.cart.isExistedUpdateCartBtn;
    if (isChangeQuantity && isExistedUpdateCartBtn) {
      return;
    }
    var productMap = [];
    var handleUrls = [];
    var handles = [];
    var keyIdMap = [];
    cartData.items.forEach(function (item) {
      var proId = item.product_id;
      if (handles.indexOf(proId) === -1 && proId !== null) {
        handles.push(proId);
        handleUrls.push('id:"' + proId + '"');
        keyIdMap[proId] = item.key;
      }
    });
    if (
      BSS_B2B.cart.updatedLineItems.length &&
      BSS_B2B.cart.productMap.length &&
      BSS_B2B.page.isCartPage()
    ) {
      BSS_B2B.cart.updateWhenItemQuantityChange(
        shopData,
        cartData,
        isChangeQuantity,
        isAjaxCart,
        BSS_B2B.cart.productMap,
        BSS_B2B.cart.updatedLineItems,
        false
      );
    } else if (
      BSS_B2B.cart.updatedLineItems.length &&
      BSS_B2B.cart.productMap.length &&
      isAjaxCart &&
      isChangeQuantity
    ) {
      BSS_B2B.cart.updateWhenItemQuantityChange(
        shopData,
        cartData,
        isChangeQuantity,
        isAjaxCart,
        BSS_B2B.cart.productMap,
        BSS_B2B.cart.updatedLineItems,
        false
      );
    } else {
      var urlData = "/search.js?q=" + handleUrls.join(" OR ") + "&view=bss.b2b";
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
                price: pro.price_min,
                key: keyIdMap[pro.id],
              });
            }
          }
          var updatedLineItems = BSS_B2B.getPriceList(
            shopData,
            productMap,
            true
          );
          BSS_B2B.cart.updatedLineItems = updatedLineItems;
          BSS_B2B.cart.productMap = productMap;
          BSS_B2B.cart.updateWhenItemQuantityChange(
            shopData,
            cartData,
            isChangeQuantity,
            isAjaxCart,
            productMap,
            updatedLineItems,
            true
          );
        }
      });
    }
  };

  BSS_B2B.cart.getLineItemsPriceWhenUseAMO = function (
    shopData,
    cartData,
    isChangeQuantity,
    isAjaxCart
  ) {
    var isExistedUpdateCartBtn = BSS_B2B.cart.isExistedUpdateCartBtn;
    if (isChangeQuantity && isExistedUpdateCartBtn) {
      return;
    }
    var productMap = [];
    var handleUrls = [];
    var handles = [];
    var keyIdMap = [];
    cartData.items.forEach(function (item) {
      var proId = item.product_id;
      if (handles.indexOf(proId) === -1 && proId !== null) {
        handles.push(proId);
        handleUrls.push('id:"' + proId + '"');
        keyIdMap[proId] = item.key;
      }
    });

    if (
      BSS_B2B.cart.updatedLineItemsAndUseAMO.length &&
      BSS_B2B.cart.productMap.length
    ) {
      BSS_B2B.cart.updateWhenItemQuantityChangeAndUseAMO(
        shopData,
        cartData,
        isChangeQuantity,
        isAjaxCart,
        BSS_B2B.cart.productMap,
        BSS_B2B.cart.updatedLineItemsAndUseAMO,
        false
      );
    } else if (
      BSS_B2B.cart.updatedLineItemsAndUseAMO.length &&
      BSS_B2B.cart.productMap.length &&
      isAjaxCart &&
      isChangeQuantity
    ) {
      BSS_B2B.cart.updateWhenItemQuantityChangeAndUseAMO(
        shopData,
        cartData,
        isChangeQuantity,
        isAjaxCart,
        BSS_B2B.cart.productMap,
        BSS_B2B.cart.updatedLineItems,
        false
      );
    } else {
      var urlData = "/search.js?q=" + handleUrls.join(" OR ") + "&view=bss.b2b";
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
                price: pro.price_min,
                key: keyIdMap[pro.id],
              });
            }
          }

          var updatedLineItems = BSS_B2B.amo.getAppliedRulesForCartItems(
            productMap,
            true
          );
          BSS_B2B.cart.updatedLineItemsAndUseAMO = updatedLineItems;
          BSS_B2B.cart.updateWhenItemQuantityChangeAndUseAMO(
            shopData,
            cartData,
            isChangeQuantity,
            isAjaxCart,
            productMap,
            updatedLineItems,
            true
          );
        }
      });
    }
  };

  BSS_B2B.cart.fixer = function (shopData, isChangeQuantity, isAjaxCart) {
    $.ajax({
      url: "/cart.js",
      type: "GET",
      dataType: "json",
      success: function (data) {
        if (data) {
          var domain = shopData.shop.permanent_domain;
          /**
           * Insert qty table to correct cart item, update correct qty
           * table if item qty is changed
           */
          if (isEnableQB) {
            BSS_B2B.qb.insertQtyTableToCartItemBlock(data);
            if (!isAjaxCart || BSS_B2B.page.isCartPage()) {
              BSS_B2B.cart.reRenderQtyTable();
            }
            if (
              isAjaxCart &&
              isChangeQuantity &&
              (!isEnableCP || BSS_B2B.configData.length == 0)
            ) {
              BSS_B2B.handleQuantityChangeAjaxCart(false);
            }
          }

          if (isEnableCP && BSS_B2B.configData && BSS_B2B.configData.length) {
            BSS_B2B.cart.getLineItemsPrice(
              shopData,
              data,
              isChangeQuantity,
              isAjaxCart
            );
          }

          if (isEnableAMO && BSS_B2B.amoRules && BSS_B2B.amoRules.length > 0) {
            if (isEnableCP && BSS_B2B.configData && BSS_B2B.configData.length) {
              setTimeout(function () {
                BSS_B2B.cart.getLineItemsPriceWhenUseAMO(
                  shopData,
                  data,
                  isChangeQuantity,
                  isAjaxCart
                );
              }, 1000);
            } else {
              BSS_B2B.cart.getLineItemsPriceWhenUseAMO(
                shopData,
                data,
                isChangeQuantity,
                isAjaxCart
              );
            }
          }
          if (isEnableMc) {
            setTimeout(function () {
              let customPriceEL = $(
                "[data-cart-item-regular-price]," +
                  "[bss-b2b-item-price]," +
                  "[data-cart-subtotal]," +
                  "[bss-b2b-ajax-cart-subtotal]," +
                  "[bss-b2b-cart-item-key]," +
                  "[data-cart-price]," +
                  "[bss-b2b-cart-total-price]," +
                  // fix for auto discount
                  "[bss-b2b-cart-discount-total]," +
                  "[data-cart-discount-amount]," +
                  "[data-cart-price-bubble][data-cart-price]," +
                  "[data-cart-item-id]  [data-cart-item-price-container] .cart-item__original-price," +
                  "[data-cart-item-id]  [data-cart-item-line-price-container] .cart-item__original-price," +
                  ".cartTotalSelector ," +
                  ".cart_subtotal ," +
                  ".cart-item__price ," +
                  ".cart-subtotal--price" +
                  BSS_B2B.getCartPriceClass("cart_total") +
                  BSS_B2B.getCartPriceClass("cart_subtotal") +
                  BSS_B2B.getCartPriceClass("cart_item_regular_price") +
                  BSS_B2B.getCartPriceClass("cart_item_original_price")
              );
              let sessionCurrencyCode = sessionStorage.getItem(
                "currentCurrency"
              );
              let sessionCurrencyFormat = sessionStorage.getItem(
                "currentCurrencyFormat"
              );
              BSS_B2B.MC.preConvertCurrency(
                sessionCurrencyCode,
                sessionCurrencyFormat,
                customPriceEL
              );
            }, 1000);
          }
        } else {
          console.log("Could not get cart data");
        }
      },
      error: function (err) {
        console.log("Could not get cart data:", err);
      },
    });
  };
  BSS_B2B.cart.reRenderQtyTable = function () {
    /**
     * Fix bugs: If disable CP and enable QB, first time change QTY will not show qty table
     * Element (cart line item) was generated each time change, so need to
     * call event onClick after generate
     */
    if (!isEnableCP || !BSS_B2B.configData || BSS_B2B.configData.length == 0) {
      var isExistedUpdateCartBtn = BSS_B2B.cart.isExistedUpdateCartBtn;
      if (!isExistedUpdateCartBtn) {
        $(BSS_B2B.cart.inputQuantityElement).off();

        $(BSS_B2B.cart.inputQuantityElement).on("change", function (e) {
          setTimeout(function () {
            BSS_B2B.cart.fixer(shopData, false, false);
          }, 1500);
        });

        //Question: side effect when enable off()
        $(BSS_B2B.cart.buttonChangeQuantity).off();

        $(BSS_B2B.cart.buttonChangeQuantity).on("click", function () {
          setTimeout(function () {
            BSS_B2B.cart.fixer(shopData, false, false);
          }, 1500);
        });
      }
    }
  };

  BSS_B2B.cart.updateWhenItemQuantityChangeAndUseAMO = function (
    shopData,
    cartData,
    isChangeQuantity,
    isAjaxCart,
    productMap,
    updatedLineItems,
    isFirstLoad
  ) {
    var inputQuantityElement = $(BSS_B2B.cart.inputQuantityElement);
    var buttonChangeQuantity = $(BSS_B2B.cart.buttonChangeQuantity);
    var timeDelayToReCalculate = 1200;
    var customTimeDelayToChangeQuantity = BSS_B2B.getCssSelector(
      "cart_time_delay_changing_qty"
    );
    if (
      customTimeDelayToChangeQuantity != "" &&
      !isNaN(customTimeDelayToChangeQuantity)
    ) {
      timeDelayToChangeQuantity = parseInt(customTimeDelayToChangeQuantity);
    }
    var customTimeDelayToChangeQuantity = BSS_B2B.getCssSelector(
      "cart_time_delay_changing_qty"
    );
    if (
      customTimeDelayToChangeQuantity != "" &&
      !isNaN(customTimeDelayToChangeQuantity)
    ) {
      timeDelayToChangeQuantity = parseInt(customTimeDelayToChangeQuantity);
    }
    var timeDelayToChangeQuantity = 2000;
    var items = [];

    for (var i = 0; i < updatedLineItems.length; i++) {
      for (let k = 0; k < cartData.items.length; k++) {
        if (cartData.items[k].product_id == updatedLineItems[i].productId) {
          cartData.items[k] = { ...cartData.items[k], ...updatedLineItems[i] };
          items.push(cartData.items[k]);
        }
      }
    }

    if (BSS_B2B.amoSettings.amoType) {
      BSS_B2B.amo.checkAMORuleForAllProductsOfCartPage(items);
    } else {
      BSS_B2B.amo.checkAMORuleForPerProductOfCartPage(items);
    }

    if (isChangeQuantity) {
      if (isAjaxCart) {
        BSS_B2B.handleQuantityChangeAjaxCart(false);
      } else {
        inputQuantityElement.off();
        inputQuantityElement.on("change", function (e) {
          BSS_B2B.cart.cartQtyOnChange(
            timeDelayToReCalculate,
            timeDelayToChangeQuantity,
            isFirstLoad
          );
        });

        //Question: side effect when enable off()
        buttonChangeQuantity.off();

        buttonChangeQuantity.on("click", function () {
          BSS_B2B.cart.cartQtyOnChange(
            timeDelayToReCalculate,
            timeDelayToChangeQuantity,
            isFirstLoad
          );
        });

        if (isEnableCP && BSS_B2B.configData && BSS_B2B.configData.length > 0) {
          $(BSS_B2B.cart.removeButtons).on("click", function () {
            BSS_B2B.cart.cartQtyOnChange(
              timeDelayToReCalculate,
              timeDelayToChangeQuantity,
              isFirstLoad
            );
          });
        }
      }
    } else {
      if (
        (isEnableQB && BSS_B2B.qbRules && BSS_B2B.qbRules.length > 0) ||
        (isEnableCP && BSS_B2B.configData && BSS_B2B.configData > 0)
      ) {
      } else {
        $(BSS_B2B.cart.removeButtons).on("click", function () {
          BSS_B2B.cart.cartQtyOnChange(
            timeDelayToReCalculate,
            timeDelayToChangeQuantity,
            isFirstLoad
          );
        });
      }
    }

    BSS_B2B.cart.visbileElementAfterUpdateQuantity(
      isAjaxCart,
      isChangeQuantity
    );
    BSS_B2B.cart.hoverMinicart(
      shopData,
      cartData,
      isChangeQuantity,
      isAjaxCart,
      productMap,
      updatedLineItems,
      isFirstLoad
    );
  };

  BSS_B2B.cart.visbileElementAfterUpdateQuantity = function (
    isAjaxCart,
    isChangeQuantity
  ) {
    if (isAjaxCart) {
      $(
        "[bss-b2b-ajax-cart-subtotal], " +
          ".cart-drawer__subtotal-value," +
          "[bss-b2b-ajax-cart-line-price], " +
          "[bss-b2b-ajax-original-line-price]," +
          "[data-cart-price-bubble][data-cart-price]," +
          '[data-section-id="cart-drawer"] [data-cart-subtotal],' +
          "#ajaxifyCart .cart-subtotal--price," +
          ".drawer .cart-item__price," +
          ".cartTotalSelector"
      ).show();
    }

    if (isChangeQuantity) {
      $(
        "[data-cart-item-regular-price]," +
          "[data-cart-item-id]  [data-cart-item-price-container] .cart-item__original-price," +
          "[data-cart-item-id]  [data-cart-item-line-price-container] .cart-item__original-price"
      ).fadeIn(700);
      $(
        "[data-cart-subtotal],#cart-total,#total-cart-bottom,[bss-b2b-ajax-cart-subtotal]"
      ).fadeIn(700);
    } else {
      $(
        "[bss-b2b-cart-item-key]," +
          "[bss-b2b-cart-total-price]," +
          "[data-cart-item-regular-price]," +
          "[data-cart-subtotal]"
      ).css("visibility", "visible");
    }

    if (isChangeQuantity || isAjaxCart) {
      $(
        "[bss-b2b-cart-item-key]," +
          "[data-cart-subtotal]," +
          "#cart-total,#total-cart-bottom," +
          "[bss-b2b-ajax-cart-subtotal]," +
          "[bss-b2b-cart-item-key][bss-b2b-original-line-price], " +
          "[data-cart-item-regular-price], " +
          "[bss-b2b-ajax-original-line-price]," +
          "[bss-b2b-product-id]," +
          "[bss-b2b-final-line-price]," +
          "[bss-b2b-item-final-price]," +
          "[bss-b2b-product-id][bss-b2b-product-sale-price]," +
          //fix for nobby-mexico by XuTho
          ".product-price," +
          "[bss-b2b-product-id].priceRow," +
          // fix for imageexchange
          "[bss-b2b-product-id][bss-b2b-product-handle][bss-b2b-variant-id]," +
          //Fix for benki-brewingtools
          ".cart-prod-price .money span," +
          //Fix for idoinebio
          ".ajaxcart__price span[bss-b2b-ajax-original-line-price]" +
          //Fix for epicb2c
          ".atc-banner--container [data-atc-banner-product-price-value]," +
          ".atc-banner--container [data-atc-banner-cart-subtotal]," +
          "[bss-b2b-cart-total-price]"
      )
        .css("visibility", "visible")
        .show();
    }
  };
}
