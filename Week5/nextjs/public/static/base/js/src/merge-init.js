import bssB2BRunScript from "./init/runscript";
import initRegistrationForm from "./form/init-registration-form";
import tax from "./taxexem/tax";
export default function MergeInitFunction(jQueryObj) {
  var shopModules = BSS_B2B.shopModules;
  if (
    shopModules === undefined ||
    shopModules == null ||
    shopModules.length == 0
  ) {
    BSS_B2B.shopModules = [
      { code: "cp", status: 1 },
      { code: "qb", status: 1 },
      { code: "form", status: 1 },
    ];
    shopModules = BSS_B2B.shopModules;
  }
  var isEnableCP = true;
  var isEnableQB = true;
  var isEnableRg = true;

  shopModules.forEach(function (sm) {
    if (sm.code == "cp") {
      isEnableCP = sm.status;
    } else if (sm.code == "qb") {
      isEnableQB = sm.status;
    } else if (sm.code == "form") {
      isEnableRg = sm.status;
    }
  });
  if (
    !BSS_B2B.isAllowFree &&
    (BSS_B2B.planCode == "null" ||
      BSS_B2B.planCode == "" ||
      BSS_B2B.planCode == "undefined")
  ) {
    isEnableRg = false;
  }
  if (isEnableRg) {
    jQueryObj("#RegisterForm").fadeIn(500);
  } else if (window.location.pathname == "/account/register") {
    jQueryObj("#RegisterForm").fadeIn(500);
  }
  var shopData = {};

  if (jQueryObj("#bss-b2b-store-data").length) {
    shopData = JSON.parse(jQueryObj("#bss-b2b-store-data").html());
  }
  // init registration form

  let urlArr = window.location.href.split("/");
  let isCartPage =
    urlArr[urlArr.length - 1] == "cart" ||
    urlArr[urlArr.length - 1].includes("cart");
  setTimeout(function () {
    //Must be detect country and vat first time
    let countryCode = "";
    let countryTax = 0;
    if (typeof Storage !== "undefined") {
      if (
        sessionStorage.bssB2BCountryCode &&
        sessionStorage.bssB2BCountryCode != "NA" &&
        sessionStorage.bssB2BCountryCode != "undefined"
      ) {
        countryCode = sessionStorage.bssB2BCountryCode;
      }

      if (
        sessionStorage.bssB2BCountryTax &&
        sessionStorage.bssB2BCountryTax != "NA" &&
        sessionStorage.bssB2BCountryTax != "undefined"
      ) {
        countryTax = sessionStorage.bssB2BCountryTax;
      }
    }
    if (countryCode == "") {
      let data = {
        domain: shopData.shop.permanent_domain,
      };
      fetch(bssB2bApiServer + "/vat/get-tax-based-country", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
        .then((response) => response.json())
        .then(function (data) {
          if (data.success) {
            BSS_B2B.countryCode = data.countryCode;
            BSS_B2B.countryTax = data.tax;

            if (typeof Storage !== "undefined") {
              sessionStorage.bssB2BCountryCode = data.countryCode;
              sessionStorage.bssB2BCountryTax = data.tax;
              console.log(
                "SR country code & Tax:",
                sessionStorage.bssB2BCountryCode,
                sessionStorage.bssB2BCountryTax
              );
            } else {
              console.log(
                "Country Code & Tax:",
                BSS_B2B.countryCode,
                BSS_B2B.countryTax
              );
            }
          } else {
            console.log("Could not get country by IP");
          }
          bssB2BRunScript(jQueryObj, BSS_B2B, shopModules, shopData);
          if (
            !isEnableCP ||
            !BSS_B2B.configData ||
            BSS_B2B.configData.length === 0
          ) {
            tax.showProductPriceInlcudedVat(BSS_B2B, shopData);
          }
        });
    } else {
      BSS_B2B.countryCode = countryCode;
      BSS_B2B.countryTax = countryTax;
      bssB2BRunScript(jQueryObj, BSS_B2B, shopModules, shopData);
      if (
        !isEnableCP ||
        !BSS_B2B.configData ||
        BSS_B2B.configData.length === 0
      ) {
        tax.showProductPriceInlcudedVat(BSS_B2B, shopData);
      }
    }
  }, 500);
  if (!isCartPage) {
    console.log("init registration form");
    initRegistrationForm(jQueryObj, BSS_B2B, shopData, isEnableRg);
  }

  // end init registration form
}
