import modifyCheckout from "./modify-checkout";
import handleBuyItNow from "./handle-buy-it-now";
import changeProductPrice from "./change-product-price";
export default function initCp(
  $,
  BSS_B2B,
  shopData,
  Shopify,
  firstLoadProduct,
  isEnableCP,
  isEnableQB,
  isEnableAMO,
  isEnableMc
) {
  modifyCheckout($, BSS_B2B, shopData, isEnableAMO);
  handleBuyItNow($, BSS_B2B, shopData, isEnableCP, isEnableQB, isEnableAMO);
  changeProductPrice(
    $,
    BSS_B2B,
    shopData,
    Shopify,
    firstLoadProduct,
    isEnableMc
  );
}
