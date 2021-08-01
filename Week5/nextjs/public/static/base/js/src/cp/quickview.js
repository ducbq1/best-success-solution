export default function handleQuickView($, BSS_B2B, shopData) {
  $("a.full-width-link").on("click", function () {
    setTimeout(function () {
      BSS_B2B.applyChangePriceForMultiCarform();
      var carform = $(
        '[data-product-modal-wrapper] form[action*="/cart/add"],' +
          '.modal.modal--quick-shop.modal--is-active[data-product-id] form[action*="/cart/add"]'
      );
      if (carform.length) {
        BSS_B2B.makeCloneBuyItNow(carform);
      }
    }, 2000);
  });
  $(".quick-product__btn[data-product-id]").on("click", function () {
    setTimeout(function () {
      $(".shopify-payment-button__button").fadeIn();
    }, 500);
    setTimeout(function () {
      BSS_B2B.applyChangePriceForMultiCarform();
      var carform = $(
        '.modal.modal--quick-shop.modal--is-active[data-product-id] form[action*="/cart/add"]'
      );
      if (carform.length) {
        BSS_B2B.makeCloneBuyItNow(carform);
      }
    }, 1500);
  });
  $(
    ".productitem--action-trigger[data-quickshop-full], .productitem--action-trigger[data-quickshop-slim]"
  ).on("click", function () {
    setTimeout(function () {
      $(".shopify-payment-button__button").fadeIn();
    }, 500);
    setTimeout(function () {
      BSS_B2B.applyChangePriceForMultiCarform();
      var carform = $(
        '.modal.modal--quickshop-full[data-modal-container] form[action*="/cart/add"],' +
          '.modal.modal--quickshop-slim[data-modal-container] form[action*="/cart/add"]'
      );

      if (carform.length) {
        var closestProductMain = carform.closest(".product-main");
        $(closestProductMain)
          .find("[bss-b2b-product-id][bss-b2b-product-parent-price]")
          .removeAttr("bss-b2b-product-active");
        // fix for top-3-sources
        if (BSS_B2B.storeId == 66 || BSS_B2B.storeId == 778) {
          BSS_B2B.changeProductPrice(shopData, null, carform);
        } else {
          BSS_B2B.changeProductPrice(
            shopData,
            "." +
              $(closestProductMain).attr("class").split(" ")[0] +
              " [bss-b2b-product-parent-price]",
            carform
          );
        }
        $(closestProductMain)
          .find("[bss-b2b-product-id][bss-b2b-product-parent-price]")
          .removeAttr("bss-b2b-product-active");
        BSS_B2B.makeCloneBuyItNow(carform);
      }
    }, 1500);
  });
  $("a[data-fancybox].quick").on("click", function () {
    setTimeout(function () {
      $(".shopify-payment-button__button").fadeIn();
    }, 500);
    setTimeout(function () {
      BSS_B2B.applyChangePriceForMultiCarform();
      var carform = $(
        '#product-id-product-template-quick form[action*="/cart/add"]'
      );

      if (carform.length) {
        var closestProductMain = carform.closest(
          "#product-id-product-template-quick"
        );
        $(closestProductMain)
          .find("[bss-b2b-product-id][bss-b2b-product-parent-price]")
          .removeAttr("bss-b2b-product-active");
        BSS_B2B.changeProductPrice(
          shopData,
          "." +
            $(closestProductMain).attr("class").split(" ")[0] +
            " [bss-b2b-product-parent-price]",
          carform
        );
        $(closestProductMain)
          .find("[bss-b2b-product-id][bss-b2b-product-parent-price]")
          .removeAttr("bss-b2b-product-active");
        BSS_B2B.makeCloneBuyItNow(carform);
      }
    }, 1500);
  });

  $('button.product-item__action-button[data-action="open-modal"]').on(
    "click",
    function () {
      setTimeout(function () {
        $(".shopify-payment-button__button").fadeIn();
      }, 500);
      setTimeout(function () {
        BSS_B2B.applyChangePriceForMultiCarform();
        var carform = $(
          '#modal-quick-view-collection-template form[action*="/cart/add"]'
        );

        if (carform.length) {
          var closestProductMain = carform.closest(
            "#modal-quick-view-collection-template"
          );
          $(closestProductMain)
            .find("[bss-b2b-product-id][bss-b2b-product-price]")
            .removeAttr("bss-b2b-product-active");
          BSS_B2B.changeProductPrice(
            shopData,
            "#" +
              $(closestProductMain).attr("id").split(" ")[0] +
              " [bss-b2b-product-price]",
            carform
          );
          $(closestProductMain)
            .find("[bss-b2b-product-id][bss-b2b-product-price]")
            .removeAttr("bss-b2b-product-active");
          BSS_B2B.makeCloneBuyItNow(carform);
        }
      }, 1500);
    }
  );
  // fix for becue
  $('a.quickview-button[title="Quick View"]').on("click", function () {
    setTimeout(function () {
      BSS_B2B.applyChangePriceForMultiCarform();
      var carform = $('.quickview-tpl form[action*="/cart/add"]');
      if (carform.length) {
        BSS_B2B.changeProductPrice(shopData, false, carform);
        // BSS_B2B.cart.fixer(shopData, false, carform);
        BSS_B2B.makeCloneBuyItNow(carform);
      }
    }, 2000);
  });
  //end
  // fix for steve-labpro by ThaBi
  $(
    "a[data-original-title].quickview-icon.quickview.open-quick-view.woodmart-tltp"
  ).on("click", function () {
    setTimeout(function () {
      BSS_B2B.applyChangePriceForMultiCarform();
      var carform = $('form[action*="/cart/add"]#product-form');
      if (carform.length) {
        BSS_B2B.changeProductPrice(shopData, false, carform);
        BSS_B2B.makeCloneBuyItNow(carform);
        BSS_B2B.handleAjaxCart();
      }
    }, 1500);
  });
  // fix for benki-brewingtools (madu)
  $("a.btn-action.quick_view").on("click", function () {
    setTimeout(function () {
      BSS_B2B.applyChangePriceForMultiCarform();
      var carform = $('.product-focus form[action*="/cart/add"]#product-form');
      if (carform.length) {
        BSS_B2B.changeProductPrice(shopData, false, carform);
        // BSS_B2B.cart.fixer(shopData, false, carform);
        BSS_B2B.makeCloneBuyItNow(carform);
      }
    }, 2000);
  });

  // fix for thevyapar by XuTho
  $("input.cart__submit.btn.btn--small-wide").on("click", function () {
    setTimeout(function () {
      BSS_B2B.applyChangePriceForMultiCarform();
      var carform = $('form[action*="/cart"].cart');
      if (carform.length) {
        BSS_B2B.changeProductPrice(shopData, false, carform);
        BSS_B2B.makeCloneBuyItNow(carform);
        BSS_B2B.handleAjaxCart();
      }
    }, 1500);
  });

  // fix for southeastedibles2020 (madu)
  if (BSS_B2B.storeId == 243) {
    $(".quick-product__btn").on("click", function () {
      setTimeout(function () {
        BSS_B2B.applyChangePriceForCollectionPage();
      }, 1500);
    });
  }
  //fix for nobby by XuTho
  $("a.quick-view").on("click", function () {
    //click button quick view
    setTimeout(function () {
      BSS_B2B.applyChangePriceForMultiCarform();
      var carform = $('form[action*="/cart/add"].productForm');
      if (carform.length) {
        BSS_B2B.changeProductPrice(shopData, false, carform);
        BSS_B2B.makeCloneBuyItNow(carform);
        $("button#AddToCart-quickView").on("click", function () {
          //add to cart from quick view
          setTimeout(function () {
            BSS_B2B.applyChangePriceForMultiCarform();
            var carform = $('form[action*="/cart"]');
            if (carform.length) {
              BSS_B2B.changeProductPrice(shopData, false, carform);
              BSS_B2B.makeCloneBuyItNow(carform);
              BSS_B2B.applyChangePriceForCollectionPage();
              BSS_B2B.handleAjaxCart();
            }
          }, 1000);
        });
      }
    }, 1000);
  });
  $("a.add-to-cart").on("click", function () {
    //click quick add to cart
    setTimeout(function () {
      BSS_B2B.applyChangePriceForMultiCarform();
      var carform = $('form[action*="/cart"]');
      if (carform.length) {
        BSS_B2B.changeProductPrice(shopData, false, carform);
        BSS_B2B.makeCloneBuyItNow(carform);
        BSS_B2B.applyChangePriceForCollectionPage();
        BSS_B2B.handleAjaxCart();
      }
    }, 1000);
  });
  //fix for hlh-biopharma-gmbh.myshopify.com by ThaBi
  $("a.quick-add-button-variants").on("click", function () {
    setTimeout(function () {
      var carform = $('form[action*="/cart"]');
      if (carform.length) {
        BSS_B2B.changeProductPrice(shopData, false, carform[0]);
        setTimeout(function () {
          BSS_B2B.makeCloneBuyItNow(carform[0]);
        }, 2000);
      }
    }, 1000);
  });

  // quickview fix ama-demo-store.myshopify.com
  $(".btn.quick-view-text.product_link").on("click", function () {
    if ($(this).closest(".products").length) {
      let productId = $(this)
        .closest(".products")
        .find(".product-detail [bss-b2b-product-id]")
        .attr("bss-b2b-product-id");
      $(document)
        .find(".price.h6[bss-b2b-product-id]")
        .attr("bss-b2b-product-id", productId);
      $(document)
        .find(".compare-price[bss-b2b-product-id]")
        .attr("bss-b2b-product-id", productId);
      $(document)
        .find(".details.clearfix .total-price[bss-b2b-product-id]")
        .attr("bss-b2b-product-id", productId);
      $(document)
        .find(".details.clearfix .total-price .h5[bss-b2b-product-id]")
        .attr("bss-b2b-product-id", productId);
    }
  });
  //fix voyage-trade by XuTho support ThaBi
  $("a.qs-button, button.btn-cart").on("click", function () {
    //click button quick view
    setTimeout(function () {
      BSS_B2B.applyChangePriceForMultiCarform();
      var carform = $('form[data-form="cdz-mini-cart"], div.product-info-main');
      if (carform.length) {
        BSS_B2B.changeProductPrice(shopData, false, carform);
        BSS_B2B.makeCloneBuyItNow(carform);
        $("a.btn-cart, button.btn-update-qty").on("click", function () {
          //add to cart from quick view
          setTimeout(function () {
            BSS_B2B.applyChangePriceForMultiCarform();
            var carformMini = $("div.block-content");
            if (carformMini.length) {
              //show mini cart and price
              //BSS_B2B.changeProductPrice(shopData, false, carformMini);
              BSS_B2B.handleAjaxCart();
              BSS_B2B.handleCartCheckoutBtn(shopData);
            }
          }, 1200);
        });
      }
    }, 1000);
  });
  $("button.btn-update-qty, a.btn-cart, a.btn-remove.update-cart-btn").on(
    "click",
    function () {
      //add to cart from quick view
      setTimeout(function () {
        BSS_B2B.applyChangePriceForMultiCarform();
        var carformMini = $("div.block-content");
        if (carformMini.length) {
          //show mini cart and price
          BSS_B2B.changeProductPrice(shopData, false, carformMini);
          BSS_B2B.handleAjaxCart();
          BSS_B2B.handleCartCheckoutBtn(shopData);
        }
      }, 1200);
    }
  );
  //fix for packaging by XuTho
  $("a.quick-view-btn").on("click", function () {
    //click button quick view
    setTimeout(function () {
      BSS_B2B.applyChangePriceForMultiCarform();
      var carform = $('form[action*="/cart/add"].shopify-product-form');
      if (carform.length) {
        BSS_B2B.changeProductPrice(shopData, false, carform);
        $("input#addToCart").on("click", function () {
          //add to cart from quick view
          setTimeout(function () {
            BSS_B2B.applyChangePriceForMultiCarform();
            var carform = $('form[action*="/cart"]');
            if (carform.length) {
              BSS_B2B.changeProductPrice(shopData, false, carform);
              BSS_B2B.handleAjaxCart();
            }
          }, 1000);
        });
      }
    }, 1000);
  });
  $("input.cart-popup, input#addToCart").on("click", function () {
    //add to cart from quick view
    setTimeout(function () {
      BSS_B2B.applyChangePriceForMultiCarform();
      var carform = $('form[action*="/cart"]');
      if (carform.length) {
        BSS_B2B.changeProductPrice(shopData, false, carform);
        BSS_B2B.handleAjaxCart();
      }
    }, 1000);
  });
  //fix for southern-grace-brands by XuTho
  $("div.quick-product__btn").on("click", function () {
    //click quick view
    setTimeout(function () {
      BSS_B2B.applyChangePriceForMultiCarform();
      var carform = $("div.product-single__meta");
      if (carform.length) {
        BSS_B2B.changeProductPrice(shopData, false, carform);
        $("button#add-to-cart").on("click", function () {
          //add to cart from quick view
          setTimeout(function () {
            BSS_B2B.applyChangePriceForMultiCarform();
            var carform = $('form#CartDrawerForm[action*="/cart"]');
            if (carform.length) {
              BSS_B2B.changeProductPrice(shopData, false, carform);
              BSS_B2B.handleAjaxCart();
            }
          }, 1000);
        });
      }
    }, 1000);
  });

  //fix monpetitherbier by vitu
  $("span.quick_shop.ss-icon.js-quick-shop-link").on("click", function () {
    //click button quick view
    setTimeout(function () {
      var carform = $('form[action*="/cart/add"]');
      BSS_B2B.changeProductPrice(shopData, false, carform);
      $("button.ajax-submit.action_button.add_to_cart").on(
        "click",
        function () {
          //add to cart from quick view
          setTimeout(function () {
            if (carform.length) {
              BSS_B2B.handleAjaxCart();
            }
          }, 500);
        }
      );
    }, 1000);
  });
  //fix for viastara by XuTho
  $("span.quick_shop").on("click", function () {
    //click quick view
    setTimeout(function () {
      BSS_B2B.applyChangePriceForMultiCarform();
      var carform = $("div.quick-shop__text-wrap");
      if (carform.length) {
        BSS_B2B.changeProductPrice(shopData, false, carform);
        $("button.button--add-to-cart").on("click", function () {
          //add to cart from quick view
          setTimeout(function () {
            BSS_B2B.applyChangePriceForMultiCarform();
            var carform = $('form.ajax-cart__form[action*="/cart"]');
            if (carform.length) {
              BSS_B2B.changeProductPrice(shopData, false, carform);
              BSS_B2B.handleAjaxCart();
              BSS_B2B.handleCartCheckoutBtn(shopData);
            }
          }, 2200);
        });
      }
    }, 1000);
  });
  //fix for purveyd by XuTho
  $("a.quick.btn.auto-width").on("click", function () {
    //click quick shop
    setTimeout(function () {
      BSS_B2B.applyChangePriceForMultiCarform();
      var carform = $("div.product-product-template-quick");
      if (carform.length) {
        BSS_B2B.changeProductPrice(shopData, false, carform);
        $("input.add-to-cart").on("click", function () {
          //add to cart from quick view
          setTimeout(function () {
            BSS_B2B.applyChangePriceForMultiCarform();
            var carform = $("ul.clearfix.account-active");
            if (carform.length) {
              BSS_B2B.changeProductPrice(shopData, false, carform);
              BSS_B2B.handleAjaxCart();
            }
          }, 1500);
        });
      }
    }, 1000);
  });

  // fix for studyphones by ThaBi
  $("a.btn.product-loop__quickview").on("click", function () {
    setTimeout(function () {
      BSS_B2B.applyChangePriceForMultiCarform();
      var carform = $('form[action*="/cart/add"]');
      if (carform.length) {
        BSS_B2B.changeProductPrice(shopData, false, carform);
        BSS_B2B.handleAjaxCart();
        BSS_B2B.handleCartCheckoutBtn(shopData);
      }
    }, 3000);
  });

  // fix for repairpartners by ThaBi
  $("a.quick-view-text").on("click", function () {
    setTimeout(function () {
      BSS_B2B.applyChangePriceForMultiCarform();
      var carform = $('.quick-view form[action*="/cart/add"]');

      var parentLevel2 = $('form[action*="/cart/add"]').parent();

      if (carform.length) {
        $("[bss-b2b-product-id][bss-b2b-product-parent-price]").css(
          "visibility",
          "hidden"
        );
        $("[bss-b2b-product-id][bss-b2b-product-price]").css(
          "visibility",
          "hidden"
        );
        $(
          ".prices.product_price[bss-b2b-product-id][bss-b2b-product-parent-price]"
        ).removeAttr("bss-b2b-product-active");
        $(".price.h2[bss-b2b-product-id][bss-b2b-product-price]").removeAttr(
          "bss-b2b-product-active"
        );
        BSS_B2B.changeProductPrice(shopData, false, carform);
        BSS_B2B.handleAjaxCart();
        BSS_B2B.handleCartCheckoutBtn(shopData);
        $(".single-option-selector").on("change", function () {
          $("[bss-b2b-product-id][bss-b2b-product-parent-price]").css(
            "visibility",
            "hidden"
          );
          $("[bss-b2b-product-id][bss-b2b-product-price]").css(
            "visibility",
            "hidden"
          );
          $(".price.h2[bss-b2b-product-id][bss-b2b-product-price]").removeAttr(
            "bss-b2b-product-active"
          );
          BSS_B2B.changeProductPrice(shopData, ".price.h2", carform);
        });
      }
    }, 500);
  });

  // click quick shop by XuTho or ViTu
  $("button.btn.btn--circle.btn--icon.quick-product__btn").on(
    "click",
    function () {
      setTimeout(function () {
        BSS_B2B.applyChangePriceForMultiCarform();
        var carform = $('form[action*="/cart/add"]');
        if (carform.length) {
          BSS_B2B.changeProductPrice(shopData, false, carform);
          BSS_B2B.handleAjaxCart();
          BSS_B2B.handleCartCheckoutBtn(shopData);
        }
      }, 1000);
    }
  );

  // fix for industrial-athletic (tuli)
  $(".tt-btn-quickview").on("click", function () {
    let parent = $(this).closest(".respimgsize");
    let correctParent = $(parent).find("[bss-b2b-product-id]");
    let correctId = null;
    if (correctParent.length) {
      correctId = $(correctParent).attr("bss-b2b-product-id");
    }
    let quickViewModal = $(".modal-dialog.modal-lg").find(
      "[bss-b2b-product-price]"
    );
    $(quickViewModal).removeAttr("bss-b2b-product-active");
    $(quickViewModal).css("visibility", "hidden");
    $(quickViewModal).attr("bss-b2b-product-id", correctId);
    setTimeout(function () {
      BSS_B2B.applyChangePriceForMultiCarform();
      var carform = $('form[action*="/cart/add"]#modal_quick_view');
      if (carform.length) {
        BSS_B2B.changeProductPrice(shopData, false, carform);
        BSS_B2B.handleAjaxCart();
        BSS_B2B.handleCartCheckoutBtn(shopData);
      }
    }, 500);
  });
  // fix for kanucks-gear-inc by XuTho
  $(".my-cart-link-container").on("click", function () {
    setTimeout(function () {
      BSS_B2B.applyChangePriceForMultiCarform();
      var carform = $('form[action*="/cart"].js-cart-form');
      if (carform.length) {
        BSS_B2B.changeProductPrice(shopData, false, carform);
        BSS_B2B.handleAjaxCart();
        BSS_B2B.handleCartCheckoutBtn(shopData);
      }
    }, 1000);
  });

  // fix for studyphones by ThaBi
  $("a.btn.product-loop__quickview").on("click", function () {
    setTimeout(function () {
      BSS_B2B.applyChangePriceForMultiCarform();
      var carform = $('#quick form[action*="/cart/add"]');

      if (carform.length) {
        $("[bss-b2b-product-id][bss-b2b-product-parent-price]").css(
          "visibility",
          "hidden"
        );
        $("[bss-b2b-product-id][bss-b2b-product-price]").css(
          "visibility",
          "hidden"
        );
        $("[bss-b2b-product-id][bss-b2b-product-parent-price]").removeAttr(
          "bss-b2b-product-active"
        );
        $("[bss-b2b-product-id][bss-b2b-product-price]").removeAttr(
          "bss-b2b-product-active"
        );
        BSS_B2B.changeProductPrice(shopData, false, carform);
        BSS_B2B.handleAjaxCart();
        BSS_B2B.handleCartCheckoutBtn(shopData);

        $(carform)
          .find("div.swatch-element")
          .on("click", function () {
            $("[bss-b2b-product-id][bss-b2b-product-parent-price]").css(
              "visibility",
              "hidden"
            );
            $("[bss-b2b-product-id][bss-b2b-product-price]").css(
              "visibility",
              "hidden"
            );
            $("[bss-b2b-product-id][bss-b2b-product-parent-price]").removeAttr(
              "bss-b2b-product-active"
            );
            $("[bss-b2b-product-id][bss-b2b-product-price]").removeAttr(
              "bss-b2b-product-active"
            );
            BSS_B2B.changeProductPrice(shopData, null, false);
          });
      }
    }, 2000);
  });

  // fix for americanbaileyllc by ThaBi
  $(".product-modal").on("click", function () {
    setTimeout(function () {
      BSS_B2B.applyChangePriceForMultiCarform();
      var carform = $('form[action*="/cart"].product_form');
      if (carform.length) {
        BSS_B2B.changeProductPrice(shopData, false, carform);
        BSS_B2B.handleAjaxCart();
        BSS_B2B.handleCartCheckoutBtn(shopData);
      }
    }, 2000);
  });
}
