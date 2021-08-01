export default function initCartHelper() {
  BSS_B2B.cart = {};
  BSS_B2B.cart.updatedLineItems = [];
  BSS_B2B.cart.updatedLineItemsAndUseAMO = [];
  BSS_B2B.cart.productMap = [];
  BSS_B2B.cart.cpPricingList = [];
  BSS_B2B.cart.modifiedItemsSubtotalPrice = false;
  BSS_B2B.cart.inputQuantityElement =
    'form[action*="/cart"] input[type="number"], ' +
    'form[action*="/cart"] input[data-quantity-input],' +
    'form[action*="/cart"] input[data-cart-item-input-quantity],' +
    'form[action*="/cart"] input.js-qty__input,' +
    'form[action*="/cart"] input.js-qty__num,' +
    'form[action*="/cart"] input.quantity-selector__value,' +
    ".cart-wrapper input.quantity-selector__value," +
    'form[action*="/cart"] input.ajaxifyCart--num,' +
    'form[action*="/cart"] input[aria-label="Quantity"],' +
    'form[action*="/cart"] input[data-qv-qtt-id],' +
    'form[action*="/cart"] input[name="quantity"],' +
    'form[action*="/cart"] input[name="updates[]"],' +
    //fix biomatrixweb by vitu
    '.quantity-controls input[aria-label="Quantity"],' +
    "table.line-item-table .line-item__quantity input," +
    // fix for kanucks-gear-inc by XuTho
    'form[action*="/cart"] input.ajax-cart__qty-input' +
    BSS_B2B.getCssSelector("cart_quantity_input");

  BSS_B2B.cart.buttonChangeQuantity =
    'form[action*="/cart"] .js-qty__adjust,' +
    'form[action*="/cart"] .ajaxifyCart--qty-adjuster,' +
    'form[action*="/cart"] .qty-wrapper .qty-up,' +
    'form[action*="/cart"] .qty-wrapper .qty-down,' +
    'form[action*="/cart"] .quantity-selector__button,' +
    '#shopify-section-cart-template [data-section-id="cart-template"] .quantity-selector__button,' +
    'form[action*="/cart"] .qtybtn,' +
    'form[action*="/cart"] a[data-action="decrease-quantity"],' +
    ".cart-wrapper button.quantity-selector__button," +
    '.cart-wrapper a[data-action="decrease-quantity"],' +
    'form[action*="/cart"] a[data-qv-minus-qtt],' +
    'form[action*="/cart"] a[data-qv-plus-qtt],' +
    'form[action*="/cart"] a.minus.button,' +
    'form[action*="/cart"] a.plus.button,' +
    ".cart-window .cart-prod-qty .qty-btn," +
    ".tt-input-counter .plus-btn," +
    //fix biomatrixweb by vitu
    ".tt-input-counter .minus-btn," +
    ".quantity-controls .alt-focus," +
    //fix monpetitherbier by vitu
    ".product-quantity-box .js-change-quantity," +
    "table.line-item-table .line-item__quantity button," +
    'form[action*="/cart"] .quantity-element,' +
    'form[action*="/cart"].product-single__form button[type="submit"].btn.btn--full.add-to-cart.btn--secondary,' +
    // fix for curlysecret by ThaBi
    'form[action*="/cart"] a.plus,' +
    'form[action*="/cart"] a.minus,' +
    // fix for kanucks-gear-inc by XuTho
    'form[action*="/cart"] a.ajax-cart__qty-control--up,' +
    'form[action*="/cart"] a.ajax-cart__qty-control--down,' +
    // fix for studyphones by ThaBi
    'form[action*="/cart"] #quantity-minus,' +
    'form[action*="/cart"] #quantity-plus';

  BSS_B2B.cart.removeButtons =
    'form[action*="/cart"] [data-cart-remove], form[action*="/cart"] .cart__remove:not(:has([data-cart-remove])), a[rv-data-cart-remove].remove';
}
