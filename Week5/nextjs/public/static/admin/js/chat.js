function getCookie(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(";");
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}
function initFreshChat() {
  let shop = getCookie("shopOrigin");
  window.fcWidget.init({
    token: "3501b42f-b220-4b7c-9a7c-a648971091b6",
    host: "https://wchat.freshchat.com",
    externalId: shop,
    firstName: shop,
  });
}
function initialize(i, t) {
  var e;
  i.getElementById(t)
    ? initFreshChat()
    : (((e = i.createElement("script")).id = t),
      (e.async = !0),
      (e.src = "https://wchat.freshchat.com/js/widget.js"),
      (e.onload = initFreshChat),
      i.head.appendChild(e));
}
function initiateCall() {
  initialize(document, "freshchat-js-sdk");
}
window.addEventListener
  ? window.addEventListener("load", initiateCall, !1)
  : window.attachEvent("load", initiateCall, !1);
