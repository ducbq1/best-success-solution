import bssB2BRunScript from "./runscript";
export default function Init(BSS_B2B, shopModules, shopData) {
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
  function compareVersion(v1, v2) {
    if (typeof v1 !== "string") return false;
    if (typeof v2 !== "string") return false;
    v1 = v1.split(".");
    v2 = v2.split(".");
    const k = Math.min(v1.length, v2.length);
    for (let i = 0; i < k; ++i) {
      v1[i] = parseInt(v1[i], 10);
      v2[i] = parseInt(v2[i], 10);
      if (v1[i] > v2[i]) return 1;
      if (v1[i] < v2[i]) return -1;
    }
    return v1.length == v2.length ? 0 : v1.length < v2.length ? -1 : 1;
  }

  if (
    typeof jQuery === "undefined" ||
    compareVersion(jQuery.fn.jquery, "1.7") == -1
  ) {
    if (typeof BSS_B2B == "undefined") {
      var BSS_B2B = {};
    }

    // bssB2BLoadScript('//ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js', function() {
    // bssB2BLoadScript('//cdnjs.cloudflare.com/ajax/libs/jQuery-formBuilder/3.6.1/form-render.min.js', function () {
    console.log("Load form render");
    var jquery341 = jQuery.noConflict(true);
    window.jQuery = jquery341;
    bssB2BRunScript(jquery341, BSS_B2B, shopModules, shopData);
    // });
    // });
  } else {
    if (typeof BSS_B2B == "undefined") {
      var BSS_B2B = {};
    }

    // bssB2BLoadScript('//cdnjs.cloudflare.com/ajax/libs/jQuery-formBuilder/3.6.1/form-render.min.js', function () {
    console.log("Load form render");
    bssB2BRunScript(jQuery, BSS_B2B, shopModules, shopData);
    // });
  }
}
