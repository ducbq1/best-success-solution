export default function handleAjaxCart($, BSS_B2B, shopData, isEnableQB) {
  BSS_B2B.makeChangesAfterClickAjaxcart = function (ajaxCartDelayTime) {
    $(
      "[bss-b2b-ajax-cart-subtotal], " +
        ".cart-drawer__subtotal-value, " +
        "[bss-b2b-ajax-cart-line-price], " +
        "[bss-b2b-ajax-original-line-price]," +
        "[data-cart-price-bubble][data-cart-price], " +
        '[data-section-id="cart-drawer"] [data-cart-subtotal],' +
        "#ajaxifyCart .cart-subtotal--price," +
        'header[data-sticky-class="header-mobile-center header-color-dark"] > .money,' +
        ".cartTotalSelector," +
        ".header-cart[data-ajax-cart-trigger]" +
        BSS_B2B.getCartPriceClass("ajax_cart_item_original_price") +
        BSS_B2B.getCartPriceClass("ajax_cart_item_regular_price") +
        BSS_B2B.getCartPriceClass("ajax_cart_item_line_price") +
        BSS_B2B.getCartPriceClass("ajax_cart_original_item_line_price") +
        BSS_B2B.getCartPriceClass("ajax_cart_total") +
        BSS_B2B.getCartPriceClass("ajax_cart_subtotal")
    ).hide();
    $(
      ".atc-banner--container [data-atc-banner-product-price-value]," +
        ".atc-banner--container [data-atc-banner-cart-subtotal]"
    ).css("visibility", "hidden");
    setTimeout(function () {
      BSS_B2B.cart.fixer(shopData, false, true);
      setTimeout(function () {
        BSS_B2B.handleQuantityChangeAjaxCart(true);
        BSS_B2B.handleCartCheckoutBtn(shopData);
      }, ajaxCartDelayTime);
    }, ajaxCartDelayTime);
  };

  BSS_B2B.handleAjaxCart = function () {
    if (!BSS_B2B.page.isCartPage()) {
      if ($("[data-cart-price-bubble][data-cart-price]").html() != "") {
        $("[data-cart-price-bubble][data-cart-price]").hide();
        BSS_B2B.cart.fixer(shopData, false, true);
      }
    }

    var ajaxCartDelayTime = 1500;
    if (BSS_B2B.storeId == 537) {
      ajaxCartDelayTime = 2200;
    }
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
        "a.add-cart-btn," +
        "button.tt-dropdown-toggle," +
        ".quick-view button.add-to-cart-btn.btn," +
        "button.add.font--secondary-button," +
        'button[type="submit"].gf_add-to-cart.product-form-product-template,' +
        "a.header--cart-link.font--accent," +
        //fix cra-wellness by vitu
        ".cart-container," +
        // fix for dugit by tuli
        ".icon-bag.mini_cart.dropdown_link," +
        // fix for americanbaileyllc by ThaBi
        "a.my-cart-link," +
        // fix for curlysecret by ThaBi
        ".product-form--button-container button.product-form--add-to-cart," +
        // fix korresshop-greece by vitu
        ".product-form--submit span.price" +
        BSS_B2B.getCssSelector("ajax_cart_action_button")
    );
    if (ajaxCartElement.length) {
      ajaxCartElement.on("click", function (e) {
        BSS_B2B.makeChangesAfterClickAjaxcart(ajaxCartDelayTime);
      });
      if (BSS_B2B.storeId == 1629) {
        //fix cra-wellness by vitu
        ajaxCartElement.on("hover", function (e) {
          BSS_B2B.makeChangesAfterClickAjaxcart(ajaxCartDelayTime);
        });
      }
      if (BSS_B2B.storeId == 1609) {
        ajaxCartElement.on("mouseover", function (e) {
          BSS_B2B.makeChangesAfterClickAjaxcart(ajaxCartDelayTime);
        });
      }
    }
  };

  BSS_B2B.handleQuantityChangeAjaxCart = function (isFirstload) {
    var ajaxCartChangeQtyDelayTime = isFirstload ? 2500 : 2000;
    var customAjaxCartChangeQtyDelayTime = BSS_B2B.getCssSelector(
      "ajax_cart_time_delay_changing_qty"
    );
    if (
      customAjaxCartChangeQtyDelayTime != "" &&
      !isNaN(customAjaxCartChangeQtyDelayTime)
    ) {
      ajaxCartChangeQtyDelayTime = parseInt(customAjaxCartChangeQtyDelayTime);
    }
    if ($(".bss-b2b-cart-item-qty-table-header").length) {
      $(".bss-b2b-cart-item-qty-table-header").off();
      $(".bss-b2b-cart-item-qty-table-header").on("click", function (e) {
        e.stopPropagation();
        $(this)
          .closest(".bss-b2b-cart-item-qty-table")
          .find(".bss-b2b-qty-table-wrapper")
          .toggle();
      });
    }
    var adjustQuantityButton = $(
      'form[action*="/cart"] .ajaxcart__qty-adjust,' +
        'form[action*="/cart"] .ajaxifyCart--qty-adjuster,' +
        'form[action*="/cart"] .js-qty__adjust,' +
        'form[action*="/cart"] .quantity-selector__button,' +
        'form[action*="/cart"] a[data-action="update-item-quantity"],' +
        'form[action*="/cart"] button.quantity-selector__button,' +
        'form[action*="/cart"] a[data-action="decrease-quantity"],' +
        ".cart-window .cart-prod-qty .qty-btn," +
        'form[action*="/cart"] span.ajaxifyCart--qty-adjuster,' +
        'form[action*="/cart"] a.ajaxifyCart--remove,' +
        'form[action*="/checkout"] .js-change-quantity,' +
        //XuTho fix ixcor
        'form[action*="/cart"] a.QuantitySelector__Button,' +
        'form[action*="/cart"] a.CartItem__Remove,' +
        //fix for nobby-mexico by XuTho
        "ul.mini-products-list a.remove," +
        //fix biomatrixweb by vitu
        ".cart-item-quantity-button," +
        //fix monpetitherbier by vitu
        ".left.product-quantity-box .js-change-quantity," +
        '#cart-modal .quantity-part input[type="button"],' +
        'form[action*="/cart"] a.minus,' +
        'form[action*="/cart"] a.plus,' +
        "div.mini-cart__item--content span.icon-minus," +
        "div.mini-cart__item--content span.icon-plus," +
        "span.ss-icon.js-change-quantity"
    );
    // if (BSS_B2B.page.isCartPage()) {
    //     $(adjustQuantityButton).off();
    // }

    // fix ama-demo-store.myshopify.com
    var isProductPage = BSS_B2B.page.isProductPage();
    if (isProductPage && BSS_B2B.storeId == 514) {
      var qtyButtonChange = $(".inc.button," + ".dec.button");
      $(qtyButtonChange).on("click", function () {
        let priceElement = $(
          ".product_single_price .grid-link__org_price[bss-b2b-product-id]"
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
    if (BSS_B2B.storeId == 77 || BSS_B2B.storeId == 1609) {
      $(adjustQuantityButton).off();
    }

    $(adjustQuantityButton).on("click", function () {
      $(
        "[bss-b2b-ajax-cart-subtotal]," +
          "[bss-b2b-ajax-cart-line-price]," +
          "[bss-b2b-ajax-original-line-price]" +
          BSS_B2B.getCartPriceClass("ajax_cart_total") +
          BSS_B2B.getCartPriceClass("ajax_cart_subtotal") +
          BSS_B2B.getCartPriceClass("ajax_cart_item_line_price") +
          BSS_B2B.getCartPriceClass("ajax_cart_original_item_line_price").split(
            " "
          )[1] +
          BSS_B2B.getCartPriceClass("ajax_cart_item_original_price") +
          BSS_B2B.getCartPriceClass("ajax_cart_item_regular_price")
      ).hide();
      setTimeout(function () {
        BSS_B2B.cart.fixer(shopData, true, true);
        BSS_B2B.handleCartCheckoutBtn(shopData);
        // fix show cart price for rojodistro (global as well)
        setTimeout(function () {
          $("[bss-b2b-original-line-price]").css("visibility", "visible");
        }, 500);
      }, ajaxCartChangeQtyDelayTime);
    });
    var ajaxCartQuantityInput = $(
      'form[action*="/cart"] .ajaxcart__qty-num,' +
        'form[action*="/cart"] .cart-drawer__input,' +
        'form[action*="/cart"] .cart-drawer__item-quantity,' +
        'form[action*="/cart"] input.QuantitySelector__CurrentQuantity,' +
        ".cart-window .cart-prod-qty input.update-product," +
        'form[action*="/cart"] input[aria-label="Quantity"],' +
        'form[action*="/cart"] input[aria-label="quantity"],' +
        'form[action*="/cart"] input.ajaxifyCart--num,' +
        //fix biomatrixweb by vitu
        'input[aria-label="Quantity"]' +
        BSS_B2B.getCartPriceClass("ajax_cart_quantity_input")
    );
    if (!isEnableQB || !BSS_B2B.qbRules || BSS_B2B.qbRules.length == 0) {
      // fix for rojodistro by ThaBi
      if (!(BSS_B2B.storeId == 537)) {
        ajaxCartQuantityInput.off();
      }
    }

    ajaxCartQuantityInput.on("change", function (e) {
      $(
        "[bss-b2b-ajax-cart-subtotal]," +
          "[bss-b2b-ajax-cart-line-price]," +
          "[bss-b2b-ajax-original-line-price]," +
          ".cart-drawer__subtotal-value," +
          ".cart-drawer__subtotal-number," +
          ".drawer .cart-item__price," +
          //fix biomatrixweb by vitu
          ".cart-item-price-wrapper .cart-item-price" +
          BSS_B2B.getCartPriceClass("ajax_cart_total") +
          BSS_B2B.getCartPriceClass("ajax_cart_subtotal")
      ).hide();
      setTimeout(function () {
        BSS_B2B.cart.fixer(shopData, true, true);
        BSS_B2B.handleCartCheckoutBtn(shopData);
      }, ajaxCartChangeQtyDelayTime);
    });
  };
}
