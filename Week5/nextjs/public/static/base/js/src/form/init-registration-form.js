export default function initRegistrationForm(
  $,
  BSS_B2B,
  shopData,
  enableModule
) {
  const textColorFail = BSS_B2B.rfGeneralSettings.text_color_failed;
  const textColorSuccess = BSS_B2B.rfGeneralSettings.text_color_success;
  BSS_B2B.RF = {};
  BSS_B2B.RF.data = {};
  BSS_B2B.RF.getInputNumber = 0;
  BSS_B2B.RF.requireFields = [];
  BSS_B2B.RF.errMsg = "";
  BSS_B2B.RF.errField = null;
  BSS_B2B.RF.isValidate = true;
  BSS_B2B.RF.validVAT = false;
  BSS_B2B.RF.oldBorderCSS = $("input").css("border");
  BSS_B2B.RF.needScroll = false;
  let passwordId = "";
  if (window.location.pathname == "/account/login") {
    let url = new URL(window.location.href);
    let isBssLogin = url.searchParams.get("isBssLogin");
    if (isBssLogin == "true") {
      $("form[action='/account/login'] input[type='email']").val(
        window.localStorage.getItem("bssEmail")
      );
      $("form[action='/account/login'] input[type='password']").val(
        window.localStorage.getItem("bssPassword")
      );
      $("form[action='/account/login'] input[type='submit']").off();

      $("form[action='/account/login'] input[type='submit']").click();
      window.localStorage.removeItem("bssEmail");
      window.localStorage.removeItem("bssPassword");
    }

    // fix portgroup by vitu
    if (BSS_B2B.storeId == 596) {
      let isBSScustomForm = $("#create-customer form");
      $(isBSScustomForm).removeAttr("novalidate");
      let passwordField = $(isBSScustomForm).find('input[type*="password"]');

      if (passwordField.length) {
        passwordId = $(passwordField[0]).attr("id");
        $(passwordField[0]).after(
          '<div id="bss-b2b-registration-form-render"></div>'
        );
      }
    }
  } else if (window.location.pathname.includes("/account/register")) {
    let isBSScustomForm = $("[bss-b2b-is-email-field]").closest("form");

    // fix portgroup by vitu
    if (BSS_B2B.storeId == 596) {
      isBSScustomForm = $("[bss-b2b-is-email-field]")
        .closest("#customer-wrapper")
        .find("#create-customer form");
    }

    $(isBSScustomForm).removeAttr("novalidate");
    $(isBSScustomForm).prepend(
      '<div id="bss-b2b-registration-form-top"></div>'
    );
    let passwordField = $(isBSScustomForm).find('input[type*="password"]');

    if (passwordField.length && BSS_B2B.created_account !== 0) {
      passwordId = $(passwordField[0]).attr("id");
      $(passwordField[0]).after(
        '<div id="bss-b2b-registration-form-render"></div>'
      );
    } else {
      if ($("[bss-b2b-is-email-field]").length) {
        $("[bss-b2b-is-email-field]").after(
          '<div id="bss-b2b-registration-form-render"></div>'
        );
      }
    }
  } else {
    // fix portgroup by vitu (form login in login to access page app)
    if (BSS_B2B.storeId == 596) {
      let isBSScustomForm = $("#create-customer form");
      $(isBSScustomForm).removeAttr("novalidate");
      let passwordField = $(isBSScustomForm).find('input[type*="password"]');

      if (passwordField.length) {
        passwordId = $(passwordField[0]).attr("id");
        $(passwordField[0]).after(
          '<div id="bss-b2b-registration-form-render"></div>'
        );
      }
    }
  }
  let fbRender = $("#bss-b2b-registration-form-render");
  let fbRenderTop = $("#bss-b2b-registration-form-top");
  // fix for login form on header by ThaBi
  let fbRenderTopHeader = $("#bss-b2b-registration-form-render-top-header");
  let fbRenderBottomHeader = $(
    "#bss-b2b-registration-form-render-bottom-header"
  );
  // end fix for login form on header by ThaBi
  let closestForm = $("#bss-b2b-registration-form-render").closest("form");
  let closestFormHeader = $(
    "#bss-b2b-registration-form-render-bottom-header"
  ).closest("form");
  let timeIntervalForm = 0;
  let timeIntervalFormHeader = 0;
  // fix by ThaBi: change setTimeout remove attribute onsubmit to setInterval
  let removeAttrOnSubmitForm = setInterval(function () {
    if (timeIntervalForm == 5) {
      clearInterval(removeAttrOnSubmitForm);
    } else {
      $(closestForm).removeAttr("onsubmit");
      timeIntervalForm += 1;
    }
  }, 1000);

  let removeAttrOnSubmitFormHeader = setInterval(function () {
    let closestFormAtttrOnSubmit = $(
      "#bss-b2b-registration-form-render"
    ).closest("form[onsubmit]");
    if (timeIntervalFormHeader == 5) {
      clearInterval(removeAttrOnSubmitFormHeader);
    } else {
      $(closestFormHeader).removeAttr("onsubmit");
      timeIntervalFormHeader += 1;
    }
  }, 1000);
  // end fix by ThaBi
  // if (closestForm.length) {
  //     setTimeout(() => {
  //         $(closestForm).removeAttr('onsubmit')
  //     }, 2000)
  // }
  // if (closestFormHeader.length) {
  //     setTimeout(() => {
  //         $(closestFormHeader).removeAttr('onsubmit')
  //     }, 2000)
  // }
  let status = BSS_B2B.status;

  BSS_B2B.RF.getVatValidationInput = function () {
    BSS_B2B.RF.getInputNumber = BSS_B2B.RF.getInputNumber + 1;
    if (BSS_B2B.RF.getInputNumber == 3) {
      return;
    }
    if ($("#vat-validation").length) {
      $("#vat-validation").change(function () {
        BSS_B2B.RF.valiationVatField($("#vat-validation").val());
      });
    } else {
      setTimeout(() => {
        BSS_B2B.RF.getVatValidationInput();
      }, 1000);
    }
  };

  BSS_B2B.RF.valiationVatField = function (data) {
    $("#bss-vat-msg").remove();
    $(
      '<p id="bss-vat-msg" style="text-align: center">' +
        (BSS_B2B.rfGeneralSettings &&
        BSS_B2B.rfGeneralSettings.loadingForm &&
        BSS_B2B.rfGeneralSettings.loadingForm !== ""
          ? BSS_B2B.rfGeneralSettings.loadingForm
          : "Loading...") +
        "</p>"
    ).insertAfter("#vat-validation");
    let countryCode = data.substring(0, 2);
    let vatNumber = data.substring(2, data.length);
    $.ajax({
      type: "POST",
      url: bssB2bApiServer + "/wholesaler/check-valid-vat",
      dataType: "JSON",
      data: {
        countryCode: countryCode,
        vatNumber: vatNumber,
        domain: shopData.shop.permanent_domain,
      },
      success: function (result) {
        $(".bss-error-msg").remove();
        $("#bss-error-msg").remove();
        $("#bss-vat-msg").remove();
        if (result.success) {
          if (result.message.valid[0] == "true") {
            BSS_B2B.RF.validVAT = true;
            const content =
              `<p id="bss-vat-msg" style="color: ${textColorSuccess}; text-align: center;">` +
              (BSS_B2B.rfGeneralSettings &&
              BSS_B2B.rfGeneralSettings.vat_valid &&
              BSS_B2B.rfGeneralSettings.vat_valid !== ""
                ? BSS_B2B.rfGeneralSettings.vat_valid
                : "VALID VAT NUMBER") +
              `</p>`;
            $(content).insertAfter("#vat-validation");
          } else {
            BSS_B2B.RF.validVAT = false;
            const content =
              `<p id="bss-vat-msg" style="color: ${textColorFail}; text-align: center;">` +
              (BSS_B2B.rfGeneralSettings &&
              BSS_B2B.rfGeneralSettings.vat_not_valid &&
              BSS_B2B.rfGeneralSettings.vat_not_valid !== ""
                ? BSS_B2B.rfGeneralSettings.vat_not_valid
                : "EU VAT is not valid. Please re-enter") +
              `</p>`;
            $(content).insertAfter("#vat-validation");
          }
        } else {
          BSS_B2B.RF.validVAT = false;
          const content = `<p id="bss-vat-msg" style="color: ${textColorFail}; text-align: center;">${result.message}</p>`;
          $(content).insertAfter("#vat-validation");
        }
      },
      error: function (XMLHttpRequest, textStatus, errorThrown) {
        BSS_B2B.RF.validVAT = false;
        const content = `<p id="bss-vat-msg" style="color: ${textColorFail}; text-align: center;">${result.message}</p>`;
        $(content).insertAfter("#vat-validation");
      },
    });
  };

  BSS_B2B.RF.getRequireField = function () {
    let requiredField = $(".formbuilder-required");
    requiredField.map((index, item) => {
      let existField = $(item).parent().parent();
      let allClassNameOfRequireField = existField.attr("class").split(" ");
      let classNameRequireField = allClassNameOfRequireField[2].replace(
        "field-",
        ""
      );

      if (allClassNameOfRequireField[2] == "field-vat-validation") {
        classNameRequireField = "vat-validation";
      }
      if ($("#" + classNameRequireField).val() == "") {
        BSS_B2B.RF.requireFields.push(classNameRequireField);
      } else {
        $("#" + classNameRequireField).css("border", BSS_B2B.RF.oldBorderCSS);
      }
    });
    if (
      $(closestForm).find('input[name="customer[password]"]').length &&
      $(closestForm).find('input[name="customer[password]"]').val() == ""
    ) {
      BSS_B2B.RF.requireFields.push(
        $(closestForm).find('input[name="customer[password]"]').attr("id")
      );
    } else {
      $(closestForm)
        .find('input[name="customer[password]"]')
        .css("border", BSS_B2B.RF.oldBorderCSS);
    }
    if (
      $(closestForm).find('input[name="customer[email]"]').length &&
      $(closestForm).find('input[name="customer[email]"]').val() == ""
    ) {
      BSS_B2B.RF.requireFields.push(
        $(closestForm).find('input[name="customer[email]"]').attr("id")
      );
    } else {
      $(closestForm)
        .find('input[name="customer[email]"]')
        .css("border", BSS_B2B.RF.oldBorderCSS);
    }
    if (
      $(closestForm).find('input[name="customer[first_name]"]').length &&
      $(closestForm).find('input[name="customer[first_name]"]').val() == ""
    ) {
      BSS_B2B.RF.requireFields.push(
        $(closestForm).find('input[name="customer[first_name]"]').attr("id")
      );
    } else {
      $(closestForm)
        .find('input[name="customer[first_name]"]')
        .css("border", BSS_B2B.RF.oldBorderCSS);
    }
    // form header
    if (
      $(closestFormHeader).find('input[name="customer[password]"]').length &&
      $(closestFormHeader).find('input[name="customer[password]"]').val() == ""
    ) {
      BSS_B2B.RF.requireFields.push(
        $(closestFormHeader).find('input[name="customer[password]"]').attr("id")
      );
    } else {
      $(closestFormHeader)
        .find('input[name="customer[password]"]')
        .css("border", BSS_B2B.RF.oldBorderCSS);
    }
    if (
      $(closestFormHeader).find('input[name="customer[email]"]').length &&
      $(closestFormHeader).find('input[name="customer[email]"]').val() == ""
    ) {
      BSS_B2B.RF.requireFields.push(
        $(closestFormHeader).find('input[name="customer[email]"]').attr("id")
      );
    } else {
      $(closestFormHeader)
        .find('input[name="customer[email]"]')
        .css("border", BSS_B2B.RF.oldBorderCSS);
    }
    if (
      $(closestFormHeader).find('input[name="customer[first_name]"]').length &&
      $(closestFormHeader).find('input[name="customer[first_name]"]').val() ==
        ""
    ) {
      BSS_B2B.RF.requireFields.push(
        $(closestFormHeader)
          .find('input[name="customer[first_name]"]')
          .attr("id")
      );
    } else {
      $(closestFormHeader)
        .find('input[name="customer[first_name]"]')
        .css("border", BSS_B2B.RF.oldBorderCSS);
    }
  };

  BSS_B2B.RF.checkRequireField = function (
    allRequireField,
    data,
    isValidate,
    errField
  ) {
    BSS_B2B.RF.errField = errField;
    let result = isValidate;
    data.map((dataItem) => {
      allRequireField.map((requireItem) => {
        if (dataItem.name.includes(requireItem) && dataItem.value == "") {
          result = false;
        }
      });
    });

    return result;
  };

  BSS_B2B.RF.getAllCheckBoxField = function () {
    let checkboxFields = [];
    $("#bss-b2b-registration-form-render").each(function () {
      let allInput = $(this).find(":input");
      allInput.map((index, item) => {
        if ($(item).attr("id").includes("checkbox-group")) {
          let checkboxId = $(item).attr("id").split("-").splice(0, 3).join("-");
          if (!checkboxFields.includes(checkboxId)) {
            checkboxFields.push(checkboxId);
          }
        }
      });
    });
    return checkboxFields;
  };

  BSS_B2B.RF.checkValidEmailField = function (
    isValidate,
    errField,
    requireEmailFields
  ) {
    BSS_B2B.RF.errField = errField;
    let result = isValidate;
    $("#bss-b2b-registration-form-render").each(function () {
      let allInput = $(this).find(':input[type="email"]');
      allInput.map((index, item) => {
        if (requireEmailFields.includes($(item).attr("id"))) {
          if (!$(item).val().includes("@")) {
            BSS_B2B.RF.errField = "input#" + $(item).attr("id");
            BSS_B2B.RF.errMsg =
              BSS_B2B.rfGeneralSettings &&
              BSS_B2B.rfGeneralSettings.email_format &&
              BSS_B2B.rfGeneralSettings.email_format !== ""
                ? BSS_B2B.rfGeneralSettings.email_format
                : "Must be email format";
            result = false;
          }
          if ($(item).val() == "") {
            BSS_B2B.RF.errField = "input#" + $(item).attr("id");
            BSS_B2B.RF.errMsg =
              BSS_B2B.rfGeneralSettings &&
              BSS_B2B.rfGeneralSettings.email_format &&
              BSS_B2B.rfGeneralSettings.required_field !== ""
                ? BSS_B2B.rfGeneralSettings.required_field
                : "This field is required";
            result = false;
          }
        } else {
          if (!$(item).val().includes("@") && $(item).val() !== "") {
            BSS_B2B.RF.errField = "input#" + $(item).attr("id");
            BSS_B2B.RF.errMsg =
              BSS_B2B.rfGeneralSettings &&
              BSS_B2B.rfGeneralSettings.email_format &&
              BSS_B2B.rfGeneralSettings.email_format !== ""
                ? BSS_B2B.rfGeneralSettings.email_format
                : "Must be email format";
            result = false;
          }
        }
      });
    });
    return result;
  };

  BSS_B2B.RF.getAllFileValue = function (form) {
    let fileField = $(form).find("input[type='file']");
    let inputField = [];
    let error = null;
    if (fileField.length) {
      fileField.map((index, item) => {
        if (item.files.length) {
          for (var i = 0; i < item.files.length; i++) {
            if (item.files[i].size > 10485760) {
              error = `The following file couldn’t be uploaded: ${item.files[i].name} is more than 10mb`;
            }
            if (
              [
                "text/csv",
                "application/msword",
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                "image/gif",
                "image/jpeg",
                "image/png",
                "application/pdf",
                "audio/wav",
                "application/vnd.ms-excel",
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                "application/zip",
                "video/mp4",
                "text/plain",
                "application/x-zip-compressed",
              ].indexOf(item.files[i].type) == -1
            ) {
              error = `The following file couldn’t be uploaded: ${item.files[i].name} is not supported`;
            }
          }
          inputField.push({ id: item.id, file: item.files });
        }
      });
    }
    if (error) {
      return { fail: true, error: error };
    } else {
      return inputField;
    }
  };

  BSS_B2B.RF.getAllFieldValue = function (inputArr, checkboxFields) {
    BSS_B2B.RF.needScroll = false;
    let correctInputArr = [];
    let correctCheck = new Map();
    checkboxFields.map((item, index) => {
      correctCheck.set(item + "[]", "");
    });
    for (var i = 0; i < inputArr.length; i++) {
      if (inputArr[i].name.includes("password")) {
        if (BSS_B2B.created_account == 3 || BSS_B2B.created_account == 1) {
          BSS_B2B.RF.data.wholesaler.password = inputArr[i].value;
          correctInputArr.push({ name: "password", value: inputArr[i].value });
        } else {
          correctInputArr.push({ name: "password", value: null });
        }
        if (inputArr[i].value == null || inputArr[i].value == "") {
          BSS_B2B.RF.isValidate = false;
          BSS_B2B.RF.errField = 'input[name="customer[password]"]';
          BSS_B2B.RF.errMsg =
            BSS_B2B.rfGeneralSettings &&
            BSS_B2B.rfGeneralSettings.required_field &&
            BSS_B2B.rfGeneralSettings.required_field !== ""
              ? BSS_B2B.rfGeneralSettings.required_field
              : "This field is required";
          BSS_B2B.RF.needScroll = true;
          break;
        }
      } else if (inputArr[i].name.includes("last_name")) {
        correctInputArr.push({ name: "last_name", value: inputArr[i].value });
        BSS_B2B.RF.data.wholesaler.last_name = inputArr[i].value;
      } else if (inputArr[i].name.includes("email")) {
        correctInputArr.push({
          name: "email",
          value: inputArr[i].value.trim(),
        });
        BSS_B2B.RF.data.wholesaler.email = inputArr[i].value.trim();
        if (inputArr[i].value == null || inputArr[i].value == "") {
          BSS_B2B.RF.isValidate = false;
          BSS_B2B.RF.errField = 'input[name="customer[email]"]';
          BSS_B2B.RF.errMsg =
            BSS_B2B.rfGeneralSettings &&
            BSS_B2B.rfGeneralSettings.required_field &&
            BSS_B2B.rfGeneralSettings.required_field !== ""
              ? BSS_B2B.rfGeneralSettings.required_field
              : "This field is required";
          BSS_B2B.RF.needScroll = true;
          break;
        } else if (!inputArr[i].value.includes("@")) {
          BSS_B2B.RF.isValidate = false;
          BSS_B2B.RF.errField = 'input[name="customer[email]"]';
          BSS_B2B.RF.errMsg = "Must be email format";
        }
      } else if (inputArr[i].name.includes("first_name")) {
        correctInputArr.push({ name: "first_name", value: inputArr[i].value });
        BSS_B2B.RF.data.wholesaler.first_name = inputArr[i].value;
        if (inputArr[i].value == null || inputArr[i].value == "") {
          BSS_B2B.RF.isValidate = false;
          BSS_B2B.RF.errField = 'input[name="customer[first_name]"]';
          BSS_B2B.RF.errMsg =
            BSS_B2B.rfGeneralSettings &&
            BSS_B2B.rfGeneralSettings.required_field &&
            BSS_B2B.rfGeneralSettings.required_field !== ""
              ? BSS_B2B.rfGeneralSettings.required_field
              : "This field is required";
          BSS_B2B.RF.needScroll = true;
          break;
        }
      } else {
        if (
          !inputArr[i].name.includes("utf8") &&
          !inputArr[i].name.includes("form_type")
        ) {
          if (inputArr[i].name.includes("checkbox-group")) {
            let value = "";
            if (correctCheck.get(inputArr[i].name) !== "") {
              value =
                correctCheck.get(inputArr[i].name) + "," + inputArr[i].value;
            } else {
              value = inputArr[i].value;
            }
            correctCheck.set(inputArr[i].name, value);
          } else {
            correctInputArr.push(inputArr[i]);
          }
        }
      }
    }
    correctCheck.forEach((value, index) => {
      correctInputArr.push({ name: index, value: value });
    });
    return correctInputArr;
  };

  BSS_B2B.RF.getPhoneFieldValue = function () {
    let phoneFields = $("#phone-field");
    if (phoneFields.length) {
      return phoneFields[0].value;
    }
  };

  BSS_B2B.RF.getCompanyFieldValue = function () {
    let companyFields = $("#company-field");
    if (companyFields.length) {
      return companyFields[0].value;
    }
  };
  BSS_B2B.RF.renderReCAPCHA = function () {
    const dataSiteKey = BSS_B2B.CAPCHA_SITE_KEY;
    let submitBtn = $(closestForm).find("[type=submit]");
    if (submitBtn.length) {
      $(submitBtn).before(
        `<div class="g-recaptcha" data-sitekey="${dataSiteKey}" data-callback="correctCaptcha"></div>`
      );
      var bssB2BLoadScript = function (url, callback) {
        var script = document.createElement("script");
        script.type = "text/javascript";
        // If the browser is Internet Explorer.
        if (script.readyState) {
          script.onreadystatechange = function () {
            if (
              script.readyState == "loaded" ||
              script.readyState == "complete"
            ) {
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
      bssB2BLoadScript("https://www.google.com/recaptcha/api.js", function () {
        $(submitBtn).on("click", function (e) {
          e.preventDefault();
          const recaptchaRes = $("[name=g-recaptcha-response]").val();
          const url = $("form").attr("action");
          $(".reCAPCHA-err").remove();
          $.ajax({
            type: "POST",
            url: bssB2bApiServer + "/recapcha/verify",
            dataType: "JSON",
            data: {
              "g-recaptcha-response": recaptchaRes,
            },
            success: function (result) {
              if (result.success) {
                $(".reCAPCHA-err").remove();
                $(submitBtn).submit();
              } else {
                const content = `<p class="reCAPCHA-err" style="color: ${textColorFail}; text-align: center; margin-bottom: 10px;">${
                  BSS_B2B.rfGeneralSettings &&
                  BSS_B2B.rfGeneralSettings.complete_reCapcha_task &&
                  BSS_B2B.rfGeneralSettings.complete_reCapcha_task !== ""
                    ? BSS_B2B.rfGeneralSettings.complete_reCapcha_task
                    : "Please complete reCAPCHA task"
                }</p>`;
                $(submitBtn).before(content);
              }
              $(".bss-loading-msg").remove();
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
              const url = $("form").attr("action");
              const content = `<p class="reCAPCHA-err" style="color: ${textColorFail}; text-align: center; margin-bottom: 10px;">Something went wrong with reCAPTCHA task</p>`;
              $(submitBtn).before(content);
            },
          });
        });
        var correctCaptcha = function (response) {
          if (response.length) {
            $(".reCAPCHA-err").remove();
          }
        };
        window.correctCaptcha = correctCaptcha;
      });
    }
  };

  BSS_B2B.RF.handleSubmitFormDefault = function (form, formData) {
    let allowContinue = true;
    $(form)
      .find('[type="submit"]')
      .click(function () {
        $(".bss-error-msg").remove();
        $("#bss-error-msg").remove();
        $("#bss-vat-msg").remove();
        $('form[action*="/account"]').prepend(
          `<p class="bss-error-msg bss-loading-msg" style="text-align: center;">` +
            (BSS_B2B.rfGeneralSettings &&
            BSS_B2B.rfGeneralSettings.loadingForm &&
            BSS_B2B.rfGeneralSettings.loadingForm !== ""
              ? BSS_B2B.rfGeneralSettings.loadingForm
              : "Loading...") +
            `</p>`
        );
        BSS_B2B.RF.requireFields = [];
        let isValidate = true;
        BSS_B2B.RF.isValidate = true;
        BSS_B2B.RF.errMsg = "";

        BSS_B2B.RF.data = {
          domain: shopData.shop.permanent_domain,
          formId: BSS_B2B.formId,
          wholesaler: {
            email: null,
            first_name: null,
            last_name: null,
            custom_field: [],
            raw_form_data: JSON.stringify(formData),
            edited_form_data: JSON.stringify(formData),
            status: BSS_B2B.created_account !== 1 ? 0 : 1,
          },
        };

        let inputArr = $(form).serializeArray();

        let checkboxFields = BSS_B2B.RF.getAllCheckBoxField();
        let correctInputArr = BSS_B2B.RF.getAllFieldValue(
          inputArr,
          checkboxFields
        );
        let fileInputArr = BSS_B2B.RF.getAllFileValue(form);

        BSS_B2B.RF.getRequireField();
        let isRequireVAT = false;
        BSS_B2B.RF.requireFields.map((item, index) => {
          if (item.includes("vat-validation")) {
            isRequireVAT = true;
          }
        });

        isValidate = BSS_B2B.RF.checkRequireField(
          BSS_B2B.RF.requireFields,
          correctInputArr,
          BSS_B2B.RF.isValidate,
          BSS_B2B.RF.errField
        );

        let requireEmailFields = [];
        $("#bss-b2b-registration-form-render").each(function () {
          let allInput = $(this).find('checkRequireField:input[type="email"]');
          allInput.map((index, item) => {
            if (BSS_B2B.RF.requireFields.includes($(item).attr("id"))) {
              requireEmailFields.push($(item).attr("id"));
            }
          });
        });

        isValidate = BSS_B2B.RF.checkValidEmailField(
          isValidate,
          BSS_B2B.RF.errField,
          requireEmailFields
        );

        if (!isValidate) {
          if (BSS_B2B.reCAPCHA) {
            //reset reCAPCHA
            grecaptcha.reset();
          }
          $(".bss-loading-msg").remove();
          let checkedField = [];
          BSS_B2B.RF.requireFields.map((item) => {
            if (checkedField.indexOf(item) == -1) {
              $("#" + item).after(
                `<span class="bss-error-msg" style="color: ${textColorFail}; text-align: center;display: block; margin: auto; margin-bottom: 15px;">` +
                  (BSS_B2B.rfGeneralSettings &&
                  BSS_B2B.rfGeneralSettings.required_field &&
                  BSS_B2B.rfGeneralSettings.required_field !== ""
                    ? BSS_B2B.rfGeneralSettings.required_field
                    : "This field is require") +
                  `</span>`
              );
              $("#" + item).css("border", `solid 1px ${textColorFail}`);
              checkedField.push(item);
              allowContinue = false;
            }
          });
          // fix for maxtopcomms by XuTho
          if (BSS_B2B.storeId == 1454) {
            BSS_B2B.RF.needScroll = false;
            $([document.documentElement, document.body]).animate(
              {
                scrollTop: 200,
              },
              100
            );
          }
          if (BSS_B2B.RF.needScroll) {
            $([document.documentElement, document.body]).animate(
              {
                scrollTop: $(BSS_B2B.RF.errField).offset().top - 50,
              },
              600
            );
          }
        } else {
          allowContinue = true;
        }
      });

    $(form).submit(async function (e) {
      e.preventDefault();
      if (allowContinue) {
        $(".bss-error-msg").remove();
        $("#bss-error-msg").remove();
        $("#bss-vat-msg").remove();
        $('form[action*="/account"]').prepend(
          `<p class="bss-error-msg bss-loading-msg" style="text-align: center;">` +
            (BSS_B2B.rfGeneralSettings &&
            BSS_B2B.rfGeneralSettings.loadingForm &&
            BSS_B2B.rfGeneralSettings.loadingForm !== ""
              ? BSS_B2B.rfGeneralSettings.loadingForm
              : "Loading...") +
            `</p>`
        );
        if (BSS_B2B.created_account !== 2) {
          e.preventDefault();
        }
        let isValidate = true;
        BSS_B2B.RF.isValidate = true;
        BSS_B2B.RF.errMsg = "";

        BSS_B2B.RF.data = {
          domain: shopData.shop.permanent_domain,
          formId: BSS_B2B.formId,
          wholesaler: {
            email: null,
            first_name: null,
            last_name: null,
            custom_field: [],
            raw_form_data: JSON.stringify(formData),
            edited_form_data: JSON.stringify(formData),
            status: BSS_B2B.created_account !== 1 ? 0 : 1,
          },
        };
        let inputArr = $(form).serializeArray();
        let checkboxFields = BSS_B2B.RF.getAllCheckBoxField();
        let correctInputArr = BSS_B2B.RF.getAllFieldValue(
          inputArr,
          checkboxFields
        );
        let fileInputArr = BSS_B2B.RF.getAllFileValue(form);

        if (fileInputArr.fail) {
          $(".bss-loading-msg").remove();
          $('form[action*="/account"]').prepend(
            `<p class="bss-error-msg" style="text-align: center; color: ${textColorFail}">` +
              fileInputArr.error +
              `</p>`
          );
          $([document.documentElement, document.body]).animate(
            {
              scrollTop: $('form[action*="/account"]').offset().top - 15,
            },
            600
          );
          return;
        }
        if (fileInputArr.length) {
          let uploadFormData = new FormData();
          uploadFormData.append("storeId", BSS_B2B.storeId);
          fileInputArr.map(async (item) => {
            if (item.file.length) {
              uploadFormData.append("file", item.file[0]);
            }
          });

          let res = await fetch(`${bssB2bApiServer}/upload_file/`, {
            method: "POST",
            body: uploadFormData,
          });
          let resJson = await res.json();
          if (resJson.success) {
            fileInputArr.map((item) => {
              if (item.file.length) {
                resJson.files.map((file) => {
                  if (file.originalname == item.file[0].name) {
                    correctInputArr.push({ name: item.id, value: file.path });
                  }
                });
              }
            });

            let isRequireVAT = false;
            BSS_B2B.RF.requireFields.map((item, index) => {
              if (item.includes("vat-validation")) {
                isRequireVAT = true;
              }
            });

            isValidate = BSS_B2B.RF.checkRequireField(
              BSS_B2B.RF.requireFields,
              correctInputArr,
              BSS_B2B.RF.isValidate,
              BSS_B2B.RF.errField
            );
            let requireEmailFields = [];
            $("#bss-b2b-registration-form-render").each(function () {
              let allInput = $(this).find(':input[type="email"]');
              allInput.map((index, item) => {
                if (BSS_B2B.RF.requireFields.includes($(item).attr("id"))) {
                  requireEmailFields.push($(item).attr("id"));
                }
              });
            });

            isValidate = BSS_B2B.RF.checkValidEmailField(
              isValidate,
              BSS_B2B.RF.errField,
              requireEmailFields
            );
            if (!BSS_B2B.RF.validVAT) {
              if (BSS_B2B.reCAPCHA) {
                //reset reCAPCHA
                grecaptcha.reset();
              }
              $(".bss-loading-msg").remove();
              if (isRequireVAT) {
                $(".bss-error-msg").remove();
                $("#bss-error-msg").remove();
                $("#bss-vat-msg").remove();
                $('label[for="vat-validation"]').after(
                  `<span class="bss-error-msg" style="color: ${textColorFail}; text-align: center;display: block; margin: auto">` +
                    (BSS_B2B.rfGeneralSettings &&
                    BSS_B2B.rfGeneralSettings.vat_not_valid &&
                    BSS_B2B.rfGeneralSettings.vat_not_valid !== ""
                      ? BSS_B2B.rfGeneralSettings.vat_not_valid
                      : "EU VAT is not valid. Please re-enter") +
                    `</span>`
                );
                $('input[name="vat-validation"]').css(
                  "border",
                  `solid 1px ${textColorFail}`
                );
                $([document.documentElement, document.body]).animate(
                  {
                    scrollTop:
                      $('label[for="vat-validation"]').offset().top - 5,
                  },
                  600
                );
                return;
              } else {
                if (
                  $("#vat-validation").length > 0 &&
                  $("#vat-validation").val() !== ""
                ) {
                  $(".bss-error-msg").remove();
                  $("#bss-error-msg").remove();
                  $("#bss-vat-msg").remove();
                  $('label[for="vat-validation"]').after(
                    `<span class="bss-error-msg" style="color: ${textColorFail}; text-align: center;display: block; margin: auto">` +
                      (BSS_B2B.rfGeneralSettings &&
                      BSS_B2B.rfGeneralSettings.vat_not_valid &&
                      BSS_B2B.rfGeneralSettings.vat_not_valid !== ""
                        ? BSS_B2B.rfGeneralSettings.vat_not_valid
                        : "EU VAT is not valid. Please re-enter") +
                      `</span>`
                  );
                  $('input[name="vat-validation"]').css(
                    "border",
                    `solid 1px ${textColorFail}`
                  );
                  $([document.documentElement, document.body]).animate(
                    {
                      scrollTop:
                        $('label[for="vat-validation"]').offset().top - 5,
                    },
                    600
                  );
                  return;
                }
              }
            }
            BSS_B2B.RF.data.wholesaler.custom_field = JSON.stringify(
              correctInputArr
            );
            if (isValidate) {
              $(".bss-error-msg").remove();
              $("#bss-error-msg").remove();
              $("#bss-vat-msg").remove();
              $('form[action*="/account"]').prepend(
                `<p class="bss-error-msg bss-loading-msg" style="text-align: center;">` +
                  (BSS_B2B.rfGeneralSettings &&
                  BSS_B2B.rfGeneralSettings.loadingForm &&
                  BSS_B2B.rfGeneralSettings.loadingForm !== ""
                    ? BSS_B2B.rfGeneralSettings.loadingForm
                    : "Loading...") +
                  `</p>`
              );
              $([document.documentElement, document.body]).animate(
                {
                  scrollTop: $('form[action*="/account"]').offset().top - 15,
                },
                600
              );
              let customerNoteMap = new Map();
              BSS_B2B.formDataRender.map((item) => {
                if (
                  item.name !== "email" &&
                  item.name !== "password" &&
                  item.name !== "first_name" &&
                  item.name !== "last_name"
                ) {
                  customerNoteMap.set(
                    item.name,
                    item.label
                      ? item.label.replace(new RegExp("&nbsp;", "g"), "")
                      : ""
                  );
                }
              });
              var currentDate = new Date()
                .toJSON()
                .slice(0, 10)
                .replace(/-/g, "/");
              let note = `---${currentDate}--- \n`;
              let fileUploadNote = ``;
              JSON.parse(BSS_B2B.RF.data.wholesaler.custom_field).map(
                (item) => {
                  if (
                    customerNoteMap.get(item.name.replace("[]", "")) !== null &&
                    customerNoteMap.get(item.name.replace("[]", "")) !==
                      undefined &&
                    item.value
                  ) {
                    if (
                      customerNoteMap.get(item.name.replace("[]", "")) !== ""
                    ) {
                      if (item.name.includes("file-")) {
                        fileUploadNote += `${customerNoteMap.get(
                          item.name.replace("[]", "")
                        )}: <a href="${bssB2bApiServer}/upload_file/download_customer_file_from_url?filePath=${
                          item.value
                        }" target="_blank">${item.value}</a> \n`;
                      }
                      note += `${customerNoteMap.get(
                        item.name.replace("[]", "")
                      )}: ${item.value} \n`;
                    } else {
                      if (item.name.includes("file-")) {
                        fileUploadNote += `<a href="${bssB2bApiServer}/upload_file/download_customer_file_from_url?filePath=${item.value}" target="_blank">${item.value}</a> \n`;
                      }
                      note += `${item.value} \n`;
                    }
                  }
                }
              );
              BSS_B2B.RF.data.wholesaler.note = note;
              BSS_B2B.RF.data.wholesaler.fileUploadNote = fileUploadNote;
              BSS_B2B.RF.data.wholesaler.tax_exempt = BSS_B2B.taxExempt;
              BSS_B2B.RF.data.wholesaler.phone = BSS_B2B.RF.getPhoneFieldValue();
              BSS_B2B.RF.data.wholesaler.company = BSS_B2B.RF.getCompanyFieldValue();

              $.ajax({
                type: "POST",
                url:
                  bssB2bApiServer +
                  (BSS_B2B.created_account !== 1
                    ? "/wholesaler/create-wholesaler-on-b2b"
                    : "/wholesaler/create-wholesaler-on-both"),
                dataType: "JSON",
                data: BSS_B2B.RF.data,
                success: function (result) {
                  if (result.success) {
                    $(".bss-error-msg").remove();
                    $("#bss-error-msg").remove();
                    $('form[action*="/account"]').prepend(
                      `<p class="bss-error-msg" style="color: ${textColorSuccess}; text-align: center;">` +
                        (BSS_B2B.rfGeneralSettings &&
                        BSS_B2B.rfGeneralSettings.form_success_notification &&
                        BSS_B2B.rfGeneralSettings.form_success_notification !==
                          ""
                          ? BSS_B2B.rfGeneralSettings.form_success_notification
                          : result.message) +
                        `</p>`
                    );
                    if (BSS_B2B.created_account == 1) {
                      window.localStorage.setItem(
                        "bssEmail",
                        BSS_B2B.RF.data.wholesaler.email
                      );
                      window.localStorage.setItem(
                        "bssPassword",
                        BSS_B2B.RF.data.wholesaler.password
                      );
                      window.location.href =
                        shopData.shop.url +
                        "/account/login" +
                        "?return_url=" +
                        encodeURI(BSS_B2B.redirect_url) +
                        "&&isBssLogin=true";
                    } else {
                      // fix for miamata by ThaBi
                      if (
                        BSS_B2B.storeId == 1023 &&
                        BSS_B2B.created_account == 3
                      ) {
                        window.location.href =
                          "https://miamata.it/" + BSS_B2B.redirect_url;
                      } else {
                        window.location.href =
                          shopData.shop.url + BSS_B2B.redirect_url;
                      }
                    }
                  } else {
                    $(".bss-error-msg").remove();
                    $("#bss-error-msg").remove();
                    $('form[action*="/account"]').prepend(
                      `<p class="bss-error-msg" style="color: ${textColorFail}; text-align: center;">` +
                        result.message +
                        `</p>`
                    );
                  }
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                  console.log(errorThrown);
                  $(".bss-error-msg").remove();
                  $("#bss-error-msg").remove();
                  $('form[action*="/account"]').prepend(
                    `<p class="bss-error-msg" style="color: ${textColorFail}; text-align: center;">${errorThrown}</p>`
                  );
                },
              });
            } else {
              $(".bss-error-msg").remove();
              $("#bss-error-msg").remove();
              if (BSS_B2B.RF.errField.includes("input")) {
                $(BSS_B2B.RF.errField).after(
                  `<span class="bss-error-msg" style="color: ${textColorFail}; text-align: center;display: block; margin: auto; margin-bottom: 15px;"> ${BSS_B2B.RF.errMsg} </span>`
                );
              } else {
                $(BSS_B2B.RF.errField).after(
                  `<span class="bss-error-msg" style="color: ${textColorFail}; text-align: center;display: block; margin: auto; margin-bottom: 15px;">` +
                    (BSS_B2B.rfGeneralSettings &&
                    BSS_B2B.rfGeneralSettings.required_field &&
                    BSS_B2B.rfGeneralSettings.required_field !== ""
                      ? BSS_B2B.rfGeneralSettings.required_field
                      : "This field is require") +
                    `</span>`
                );
              }
              $([document.documentElement, document.body]).animate(
                {
                  scrollTop: $(BSS_B2B.RF.errField).offset().top - 12,
                },
                600
              );
            }
          } else {
            $(".bss-error-msg").remove();
            $("#bss-error-msg").remove();
            $('form[action*="/account"]').prepend(
              `<p class="bss-error-msg" style="color: ${textColorFail}; text-align: center;">${resJson.msg}</p>`
            );
            $([document.documentElement, document.body]).animate(
              {
                scrollTop: $(BSS_B2B.RF.errField).offset().top - 12,
              },
              600
            );
          }
        } else {
          let isRequireVAT = false;
          BSS_B2B.RF.requireFields.map((item, index) => {
            if (item.includes("vat-validation")) {
              isRequireVAT = true;
            }
          });

          isValidate = BSS_B2B.RF.checkRequireField(
            BSS_B2B.RF.requireFields,
            correctInputArr,
            BSS_B2B.RF.isValidate,
            BSS_B2B.RF.errField
          );
          let requireEmailFields = [];
          $("#bss-b2b-registration-form-render").each(function () {
            let allInput = $(this).find(':input[type="email"]');
            allInput.map((index, item) => {
              if (BSS_B2B.RF.requireFields.includes($(item).attr("id"))) {
                requireEmailFields.push($(item).attr("id"));
              }
            });
          });

          isValidate = BSS_B2B.RF.checkValidEmailField(
            isValidate,
            BSS_B2B.RF.errField,
            requireEmailFields
          );
          if (!BSS_B2B.RF.validVAT) {
            if (BSS_B2B.reCAPCHA) {
              //reset reCAPCHA
              grecaptcha.reset();
            }
            $(".bss-loading-msg").remove();
            if (isRequireVAT) {
              $(".bss-error-msg").remove();
              $("#bss-error-msg").remove();
              $("#bss-vat-msg").remove();
              $('label[for="vat-validation"]').after(
                `<span class="bss-error-msg" style="color: ${textColorFail}; text-align: center;display: block; margin: auto">` +
                  (BSS_B2B.rfGeneralSettings &&
                  BSS_B2B.rfGeneralSettings.vat_not_valid &&
                  BSS_B2B.rfGeneralSettings.vat_not_valid !== ""
                    ? BSS_B2B.rfGeneralSettings.vat_not_valid
                    : "EU VAT is not valid. Please re-enter") +
                  `</span>`
              );
              $([document.documentElement, document.body]).animate(
                {
                  scrollTop: $('label[for="vat-validation"]').offset().top - 5,
                },
                600
              );
              return;
            } else {
              if (
                $("#vat-validation").length > 0 &&
                $("#vat-validation").val() !== ""
              ) {
                $(".bss-error-msg").remove();
                $("#bss-error-msg").remove();
                $("#bss-vat-msg").remove();
                $('label[for="vat-validation"]').after(
                  `<span class="bss-error-msg" style="color: ${textColorFail}; text-align: center;display: block; margin: auto">` +
                    (BSS_B2B.rfGeneralSettings &&
                    BSS_B2B.rfGeneralSettings.vat_not_valid &&
                    BSS_B2B.rfGeneralSettings.vat_not_valid !== ""
                      ? BSS_B2B.rfGeneralSettings.vat_not_valid
                      : "EU VAT is not valid. Please re-enter") +
                    `</span>`
                );
                $([document.documentElement, document.body]).animate(
                  {
                    scrollTop:
                      $('label[for="vat-validation"]').offset().top - 5,
                  },
                  600
                );
                return;
              }
            }
          }
          BSS_B2B.RF.data.wholesaler.custom_field = JSON.stringify(
            correctInputArr
          );
          if (isValidate) {
            $(".bss-error-msg").remove();
            $("#bss-error-msg").remove();
            $("#bss-vat-msg").remove();
            $('form[action*="/account"]').prepend(
              `<p class="bss-error-msg bss-loading-msg" style="text-align: center;">` +
                (BSS_B2B.rfGeneralSettings &&
                BSS_B2B.rfGeneralSettings.loadingForm &&
                BSS_B2B.rfGeneralSettings.loadingForm !== ""
                  ? BSS_B2B.rfGeneralSettings.loadingForm
                  : "Loading...") +
                `</p>`
            );
            $([document.documentElement, document.body]).animate(
              {
                scrollTop: $('form[action*="/account"]').offset().top - 15,
              },
              600
            );
            let customerNoteMap = new Map();
            BSS_B2B.formDataRender.map((item) => {
              if (
                item.name !== "email" &&
                item.name !== "password" &&
                item.name !== "first_name" &&
                item.name !== "last_name"
              ) {
                customerNoteMap.set(
                  item.name,
                  item.label
                    ? item.label.replace(new RegExp("&nbsp;", "g"), "")
                    : ""
                );
              }
            });
            var currentDate = new Date()
              .toJSON()
              .slice(0, 10)
              .replace(/-/g, "/");
            let note = `---${currentDate}--- \n`;
            let fileUploadNote = ``;
            JSON.parse(BSS_B2B.RF.data.wholesaler.custom_field).map((item) => {
              if (
                customerNoteMap.get(item.name.replace("[]", "")) !== null &&
                customerNoteMap.get(item.name.replace("[]", "")) !==
                  undefined &&
                item.value
              ) {
                if (customerNoteMap.get(item.name.replace("[]", "")) !== "") {
                  if (item.name.includes("file-")) {
                    fileUploadNote += `${customerNoteMap.get(
                      item.name.replace("[]", "")
                    )}: <a href="${bssB2bApiServer}/upload_file/download_customer_file_from_url?filePath=${
                      item.value
                    }" target="_blank">${item.value}</a> \n`;
                  }
                  note += `${customerNoteMap.get(
                    item.name.replace("[]", "")
                  )}: ${item.value} \n`;
                } else {
                  if (item.name.includes("file-")) {
                    fileUploadNote += `<a href="${bssB2bApiServer}/upload_file/download_customer_file_from_url?filePath=${item.value}" target="_blank">${item.value}</a> \n`;
                  }
                  note += `${item.value} \n`;
                }
              }
            });

            BSS_B2B.RF.data.wholesaler.note = note;
            BSS_B2B.RF.data.wholesaler.fileUploadNote = fileUploadNote;
            BSS_B2B.RF.data.wholesaler.tax_exempt = BSS_B2B.taxExempt;
            BSS_B2B.RF.data.wholesaler.phone = BSS_B2B.RF.getPhoneFieldValue();
            BSS_B2B.RF.data.wholesaler.company = BSS_B2B.RF.getCompanyFieldValue();

            $.ajax({
              type: "POST",
              url:
                bssB2bApiServer +
                (BSS_B2B.created_account !== 1
                  ? "/wholesaler/create-wholesaler-on-b2b"
                  : "/wholesaler/create-wholesaler-on-both"),
              dataType: "JSON",
              data: BSS_B2B.RF.data,
              success: function (result) {
                if (result.success) {
                  $(".bss-error-msg").remove();
                  $("#bss-error-msg").remove();
                  $('form[action*="/account"]').prepend(
                    `<p class="bss-error-msg" style="color: ${textColorSuccess}; text-align: center;">` +
                      (BSS_B2B.rfGeneralSettings &&
                      BSS_B2B.rfGeneralSettings.form_success_notification &&
                      BSS_B2B.rfGeneralSettings.form_success_notification !== ""
                        ? BSS_B2B.rfGeneralSettings.form_success_notification
                        : result.message) +
                      `</p>`
                  );
                  if (BSS_B2B.created_account == 1) {
                    window.localStorage.setItem(
                      "bssEmail",
                      BSS_B2B.RF.data.wholesaler.email
                    );
                    window.localStorage.setItem(
                      "bssPassword",
                      BSS_B2B.RF.data.wholesaler.password
                    );
                    window.location.href =
                      shopData.shop.url +
                      "/account/login" +
                      "?return_url=" +
                      encodeURI(BSS_B2B.redirect_url) +
                      "&&isBssLogin=true";
                  } else {
                    // fix for miamata by ThaBi
                    if (
                      BSS_B2B.storeId == 1023 &&
                      BSS_B2B.created_account == 3
                    ) {
                      window.location.href =
                        "https://miamata.it/" + BSS_B2B.redirect_url;
                    } else {
                      window.location.href =
                        shopData.shop.url + BSS_B2B.redirect_url;
                    }
                  }
                } else {
                  $(".bss-error-msg").remove();
                  $("#bss-error-msg").remove();
                  $('form[action*="/account"]').prepend(
                    `<p class="bss-error-msg" style="color: ${textColorFail}; text-align: center;">` +
                      result.message +
                      `</p>`
                  );
                }
              },
              error: function (XMLHttpRequest, textStatus, errorThrown) {
                console.log(errorThrown);
                $(".bss-error-msg").remove();
                $('form[action*="/account"]').prepend(
                  `<p class="bss-error-msg" style="color: ${textColorFail}; text-align: center;">${errorThrown}</p>`
                );
              },
            });
          } else {
            $(".bss-error-msg").remove();
            $("#bss-error-msg").remove();
            if (BSS_B2B.RF.errField.includes("input")) {
              $(BSS_B2B.RF.errField).after(
                `<span class="bss-error-msg" style="color: ${textColorFail}; text-align: center;display: block; margin: auto"> ${BSS_B2B.RF.errMsg} </span>`
              );
            } else {
              $(BSS_B2B.RF.errField).after(
                `<span class="bss-error-msg" style="color: ${textColorFail}; text-align: center;display: block; margin: auto">` +
                  (BSS_B2B.rfGeneralSettings &&
                  BSS_B2B.rfGeneralSettings.required_field &&
                  BSS_B2B.rfGeneralSettings.required_field !== ""
                    ? BSS_B2B.rfGeneralSettings.required_field
                    : "This field is require") +
                  `</span>`
              );
            }
            $([document.documentElement, document.body]).animate(
              {
                scrollTop: $(BSS_B2B.RF.errField).offset().top - 12,
              },
              600
            );
          }
        }
      }
    });
  };
  if (enableModule) {
    if (
      fbRender.length &&
      status !== 0 &&
      fbRenderTop.length &&
      BSS_B2B.formDataRender
    ) {
      var formData = BSS_B2B.formDataRender;
      var formRenderDataTop = [];
      var formRenderDataBottom = [];

      formData.map((item) => {
        if (item.placement == "top") {
          formRenderDataTop.push(item);
        } else {
          formRenderDataBottom.push(item);
        }
      });

      if (BSS_B2B.created_account == 0) {
        $('form[action*="/account"] input[type*="password"]').remove();
        $('form[action*="/account"] label[for="' + passwordId + '"]').remove();
      }
      if (BSS_B2B.created_account !== 2) {
        if (formRenderDataTop.length) {
          $(fbRenderTop).formRender({
            formData: formRenderDataTop,
            dataType: "json",
          });
        }
        if (formRenderDataBottom.length) {
          $(fbRender).formRender({
            formData: formRenderDataBottom,
            dataType: "json",
          });
        }
        let timeout = 500;
        // fix koshani by vitu
        if (BSS_B2B.storeId == 1643) {
          timeout = 1000;
        }
        setTimeout(function () {
          BSS_B2B.RF.getRequireField();
        }, timeout);
      }
      BSS_B2B.RF.getVatValidationInput();
      if (BSS_B2B.created_account !== 2) {
        BSS_B2B.RF.handleSubmitFormDefault(closestForm, formData);
      }
      if (BSS_B2B.reCAPCHA) {
        BSS_B2B.RF.renderReCAPCHA();
      }
    }

    // fix for login form on header by ThaBi
    if (
      fbRenderTopHeader.length &&
      fbRenderBottomHeader.length &&
      status !== 0 &&
      BSS_B2B.formDataRender
    ) {
      var formData = BSS_B2B.formDataRender;
      var formRenderDataTopHeader = [];
      var formRenderDataBottomHeader = [];

      formData.map((item) => {
        if (item.placement == "top") {
          formRenderDataTopHeader.push(item);
        } else {
          formRenderDataBottomHeader.push(item);
        }
      });

      if (BSS_B2B.created_account == 0) {
        $('form[action*="/account"] input[type*="password"]').remove();
        $('form[action*="/account"] label[for="' + passwordId + '"]').remove();
      }
      if (BSS_B2B.created_account !== 2) {
        if (formRenderDataTopHeader.length) {
          $(fbRenderTopHeader).formRender({
            formData: formRenderDataTopHeader,
            dataType: "json",
          });
        }
        if (formRenderDataBottomHeader.length) {
          $(fbRenderBottomHeader).formRender({
            formData: formRenderDataBottomHeader,
            dataType: "json",
          });
        }
        setTimeout(function () {
          BSS_B2B.RF.getRequireField();
        }, 500);
      }
      BSS_B2B.RF.getVatValidationInput();
      if (BSS_B2B.created_account !== 2) {
        BSS_B2B.RF.handleSubmitFormDefault(closestFormHeader, formData);
      }
    }
    // end fix for login form on header by ThaBi
  } else {
    if (window.location.pathname !== "/account/register") {
      let isCustomForm = $('form[action*="/account"]').find(
        "#bss-b2b-registration-form-render"
      );
      if (isCustomForm.length) {
        $('form[action*="/account"]').remove();
      }
    } else {
      $("#bss-b2b-registration-form-render").remove();
    }
  }
}
