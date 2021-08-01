module.exports = {
  newCustomerRegisterSubject: `You have a new register`,
  newCustomerRegisterBody: `<html>
    <head>
        <meta http-equiv="Content-Security-Policy" content="script-src 'none'; style-src * 'unsafe-inline'; default-src *; img-src * data:">
    </head>
    <body>
        <title>Your store have a new register!</title>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
        <meta name="viewport" content="width=device-width">
        <style>
            body {
                margin: 0;
            }
            h1 a:hover {
                font-size: 30px;
                color: #333;
            }
            h1 a:active {
                font-size: 30px;
                color: #333;
            }
            h1 a:visited {
                font-size: 30px;
                color: #333;
            }
            a:hover {
                text-decoration: none;
            }
            a:active {
                text-decoration: none;
            }
            a:visited {
                text-decoration: none;
            }
            .button__text:hover {
                color: #fff;
                text-decoration: none;
            }
            .button__text:active {
                color: #fff;
                text-decoration: none;
            }
            .button__text:visited {
                color: #fff;
                text-decoration: none;
            }
            a:hover {
                color: #1990C6;
            }
            a:active {
                color: #1990C6;
            }
            a:visited {
                color: #1990C6;
            }
            @media(max-width: 600px) {
                .container {
                    width: 94% !important;
                }
                .main-action-cell {
                    float: none !important;
                    margin-right: 0 !important;
                }
                .secondary-action-cell {
                    text-align: center;
                    width: 100%;
                }
                .header {
                    margin-top: 20px !important;
                    margin-bottom: 2px !important;
                }
                .shop-name__cell {
                    display: block;
                }
                .order-number__cell {
                    display: block;
                    text-align: left !important;
                    margin-top: 20px;
                }
                .button {
                    width: 100%;
                }
                .or {
                    margin-right: 0 !important;
                }
                .apple-wallet-button {
                    text-align: center;
                }
                .customer-info__item {
                    display: block;
                    width: 100% !important;
                }
                .spacer {
                    display: none;
                }
                .subtotal-spacer {
                    display: none;
                }
            }
        </style>
        <table class="body" style="height: 100% !important; width: 100% !important; border-spacing: 0; border-collapse: collapse;">
            <tbody>
                <tr>
                    <td style="font-family: -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, &quot;Roboto&quot;, &quot;Oxygen&quot;, &quot;Ubuntu&quot;, &quot;Cantarell&quot;, &quot;Fira Sans&quot;, &quot;Droid Sans&quot;, &quot;Helvetica Neue&quot;, sans-serif;">
                        <table class="header row" style="width: 100%; border-spacing: 0; border-collapse: collapse; margin: 40px 0 20px;">
                            <tbody>
                                <tr>
                                    <td class="header__cell" style="font-family: -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, &quot;Roboto&quot;, &quot;Oxygen&quot;, &quot;Ubuntu&quot;, &quot;Cantarell&quot;, &quot;Fira Sans&quot;, &quot;Droid Sans&quot;, &quot;Helvetica Neue&quot;, sans-serif;">
                                        <center>
                                            <table class="container" style="width: 560px; text-align: left; border-spacing: 0; border-collapse: collapse; margin: 0 auto;">
                                                <tbody>
                                                    <tr>
                                                        <td style="font-family: -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, &quot;Roboto&quot;, &quot;Oxygen&quot;, &quot;Ubuntu&quot;, &quot;Cantarell&quot;, &quot;Fira Sans&quot;, &quot;Droid Sans&quot;, &quot;Helvetica Neue&quot;, sans-serif;">
                                                            <table class="row" style="width: 100%; border-spacing: 0; border-collapse: collapse;">
                                                                <tbody>
                                                                    <tr>
                                                                        <td class="shop-name__cell" style="font-family: -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, &quot;Roboto&quot;, &quot;Oxygen&quot;, &quot;Ubuntu&quot;, &quot;Cantarell&quot;, &quot;Fira Sans&quot;, &quot;Droid Sans&quot;, &quot;Helvetica Neue&quot;, sans-serif;">
                                                                            <h1 class="shop-name__text" style="font-weight: normal; font-size: 30px; color: #333; margin: 0;">
                                                                                <span style="font-size: 30px; color: #333; text-decoration: none;">Your store has a new register</span>
                                                                            </h1>
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </center>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <table class="row content" style="width: 100%; border-spacing: 0; border-collapse: collapse;">
                            <tbody>
                                <tr>
                                    <td class="content__cell" style="font-family: -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, &quot;Roboto&quot;, &quot;Oxygen&quot;, &quot;Ubuntu&quot;, &quot;Cantarell&quot;, &quot;Fira Sans&quot;, &quot;Droid Sans&quot;, &quot;Helvetica Neue&quot;, sans-serif; padding-bottom: 40px; border: 0;">
                                        <center>
                                            <table class="container" style="width: 560px; text-align: left; border-spacing: 0; border-collapse: collapse; margin: 0 auto;">
                                                <tbody>
                                                    <tr>
                                                        <td style="font-family: -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, &quot;Roboto&quot;, &quot;Oxygen&quot;, &quot;Ubuntu&quot;, &quot;Cantarell&quot;, &quot;Fira Sans&quot;, &quot;Droid Sans&quot;, &quot;Helvetica Neue&quot;, sans-serif;">
                                                            <h2 style="font-weight: normal; font-size: 24px; margin: 0 0 10px;">{{new_customer_email}}
                                                                has created an account on your store</h2>
                                                            <p style="color: #777; line-height: 150%; font-size: 16px; margin: 0;">New account has been registed with these information:
                                                            </p>
                                                            <ul>
                                                                <li>Name: {{new_customer_name}}</li>
                                                                <li>Email: {{new_customer_email}}</li>
                                                                <li>Note: {{new_customer_note}}</li>
                                                                <li>Upload File: {{upload_file}}</li>
                                                            </ul>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </center>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <table class="row footer" style="width: 100%; border-spacing: 0; border-collapse: collapse; border-top-width: 1px; border-top-color: #e5e5e5; border-top-style: solid;">
                            <tbody>
                                <tr>
                                    <td class="footer__cell" style="font-family: -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, &quot;Roboto&quot;, &quot;Oxygen&quot;, &quot;Ubuntu&quot;, &quot;Cantarell&quot;, &quot;Fira Sans&quot;, &quot;Droid Sans&quot;, &quot;Helvetica Neue&quot;, sans-serif; padding: 35px 0;">
                                        <center>
                                            <table class="container" style="width: 560px; text-align: left; border-spacing: 0; border-collapse: collapse; margin: 0 auto;">
                                                <tbody>
                                                    <tr>
                                                        <td style="font-family: -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, &quot;Roboto&quot;, &quot;Oxygen&quot;, &quot;Ubuntu&quot;, &quot;Cantarell&quot;, &quot;Fira Sans&quot;, &quot;Droid Sans&quot;, &quot;Helvetica Neue&quot;, sans-serif;">
                                                            <p class="disclaimer__subtext" style="color: #999; line-height: 150%; font-size: 14px; margin: 0;">If you have any questions, contact us at
                                                                <a href="mailto:{{contact_email}}" style="font-size: 14px; text-decoration: none; color: #1990C6;">{{contact_email}}</a>
                                                            </p>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </center>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <img src="https://cdn.shopify.com/shopifycloud/shopify/assets/themes_support/notifications/spacer-1a26dfd5c56b21ac888f9f1610ef81191b571603cb207c6c0f564148473cab3c.png" class="spacer" height="1" style="min-width: 600px; height: 0;">
                    </td>
                </tr>
            </tbody>
        </table>
    </body>
</html>`,
  newCustomerApproved: "You account is approved",
  newCustomerApprovedBody: `<html>
    <head>
        <meta http-equiv="Content-Security-Policy" content="script-src 'none'; style-src * 'unsafe-inline'; default-src *; img-src * data:">
    </head>
    <body>
        <title>Your account is approved</title>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
        <meta name="viewport" content="width=device-width">
        <style>
            body {
                margin: 0;
            }
            h1 a:hover {
                font-size: 30px;
                color: #333;
            }
            h1 a:active {
                font-size: 30px;
                color: #333;
            }
            h1 a:visited {
                font-size: 30px;
                color: #333;
            }
            a:hover {
                text-decoration: none;
            }
            a:active {
                text-decoration: none;
            }
            a:visited {
                text-decoration: none;
            }
            .button__text:hover {
                color: #fff;
                text-decoration: none;
            }
            .button__text:active {
                color: #fff;
                text-decoration: none;
            }
            .button__text:visited {
                color: #fff;
                text-decoration: none;
            }
            a:hover {
                color: #1990C6;
            }
            a:active {
                color: #1990C6;
            }
            a:visited {
                color: #1990C6;
            }
            @media(max-width: 600px) {
                .container {
                    width: 94% !important;
                }
                .main-action-cell {
                    float: none !important;
                    margin-right: 0 !important;
                }
                .secondary-action-cell {
                    text-align: center;
                    width: 100%;
                }
                .header {
                    margin-top: 20px !important;
                    margin-bottom: 2px !important;
                }
                .shop-name__cell {
                    display: block;
                }
                .order-number__cell {
                    display: block;
                    text-align: left !important;
                    margin-top: 20px;
                }
                .button {
                    width: 100%;
                }
                .or {
                    margin-right: 0 !important;
                }
                .apple-wallet-button {
                    text-align: center;
                }
                .customer-info__item {
                    display: block;
                    width: 100% !important;
                }
                .spacer {
                    display: none;
                }
                .subtotal-spacer {
                    display: none;
                }
            }
        </style>
        <table class="body" style="height: 100% !important; width: 100% !important; border-spacing: 0; border-collapse: collapse;">
            <tbody>
                <tr>
                    <td style="font-family: -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, &quot;Roboto&quot;, &quot;Oxygen&quot;, &quot;Ubuntu&quot;, &quot;Cantarell&quot;, &quot;Fira Sans&quot;, &quot;Droid Sans&quot;, &quot;Helvetica Neue&quot;, sans-serif;">
                        <table class="header row" style="width: 100%; border-spacing: 0; border-collapse: collapse; margin: 40px 0 20px;">
                            <tbody>
                                <tr>
                                    <td class="header__cell" style="font-family: -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, &quot;Roboto&quot;, &quot;Oxygen&quot;, &quot;Ubuntu&quot;, &quot;Cantarell&quot;, &quot;Fira Sans&quot;, &quot;Droid Sans&quot;, &quot;Helvetica Neue&quot;, sans-serif;">
                                        <center>
                                            <table class="container" style="width: 560px; text-align: left; border-spacing: 0; border-collapse: collapse; margin: 0 auto;">
                                                <tbody>
                                                    <tr>
                                                        <td style="font-family: -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, &quot;Roboto&quot;, &quot;Oxygen&quot;, &quot;Ubuntu&quot;, &quot;Cantarell&quot;, &quot;Fira Sans&quot;, &quot;Droid Sans&quot;, &quot;Helvetica Neue&quot;, sans-serif;">
                                                            <table class="row" style="width: 100%; border-spacing: 0; border-collapse: collapse;">
                                                                <tbody>
                                                                    <tr>
                                                                        <td class="shop-name__cell" style="font-family: -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, &quot;Roboto&quot;, &quot;Oxygen&quot;, &quot;Ubuntu&quot;, &quot;Cantarell&quot;, &quot;Fira Sans&quot;, &quot;Droid Sans&quot;, &quot;Helvetica Neue&quot;, sans-serif;">
                                                                            <h1 class="shop-name__text" style="font-weight: normal; font-size: 30px; color: #333; margin: 0;">
                                                                                <p style="font-size: 26px; color: #333; text-decoration: none; line-height: 35px;margin-top: -20px;">Welcome to {{store_name}}</p>
                                                                            </h1>
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </center>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <table class="row content" style="width: 100%; border-spacing: 0; border-collapse: collapse;">
                            <tbody>
                                <tr>
                                    <td class="content__cell" style="font-family: -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, &quot;Roboto&quot;, &quot;Oxygen&quot;, &quot;Ubuntu&quot;, &quot;Cantarell&quot;, &quot;Fira Sans&quot;, &quot;Droid Sans&quot;, &quot;Helvetica Neue&quot;, sans-serif; padding-bottom: 40px; border: 0;">
                                        <center>
                                            <table class="container" style="width: 560px; text-align: left; border-spacing: 0; border-collapse: collapse; margin: 0 auto;">
                                                <tbody>
                                                    <tr>
                                                        <td style="font-family: -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, &quot;Roboto&quot;, &quot;Oxygen&quot;, &quot;Ubuntu&quot;, &quot;Cantarell&quot;, &quot;Fira Sans&quot;, &quot;Droid Sans&quot;, &quot;Helvetica Neue&quot;, sans-serif;">
                                                            <h2 style="font-weight: normal; font-size: 17px; margin: 0 0 10px; line-height: 35px">You account is approved. Next time you shop with us,
                                                            login for faster checkout</h2>
                                                            </p>
                                                            <p style="color: #777; line-height: 150%; font-size: 16px; margin: 0;">New account has been registed with these information:
                                                            </p>
                                                            <ul>
                                                                <li>Name: {{new_customer_name}}</li>
                                                                <li>Email: {{new_customer_email}}</li>
                                                                <li>Note: {{new_customer_note}}</li>
                                                            </ul>
                                                            <a style="font-size: 16px;text-decoration: none;color: #1990C6; text-align: center;display: block;" href="{{url_store}}">Visit our store</a>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </center>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <table class="row footer" style="width: 100%; border-spacing: 0; border-collapse: collapse; border-top-width: 1px; border-top-color: #e5e5e5; border-top-style: solid;">
                            <tbody>
                                <tr>
                                    <td class="footer__cell" style="font-family: -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, &quot;Roboto&quot;, &quot;Oxygen&quot;, &quot;Ubuntu&quot;, &quot;Cantarell&quot;, &quot;Fira Sans&quot;, &quot;Droid Sans&quot;, &quot;Helvetica Neue&quot;, sans-serif; padding: 35px 0;">
                                        <center>
                                            <table class="container" style="width: 560px; text-align: left; border-spacing: 0; border-collapse: collapse; margin: 0 auto;">
                                                <tbody>
                                                    <tr>
                                                        <td style="font-family: -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, &quot;Roboto&quot;, &quot;Oxygen&quot;, &quot;Ubuntu&quot;, &quot;Cantarell&quot;, &quot;Fira Sans&quot;, &quot;Droid Sans&quot;, &quot;Helvetica Neue&quot;, sans-serif;">
                                                            <p class="disclaimer__subtext" style="color: #999; line-height: 150%; font-size: 14px; margin: 0;">If you have any questions, contact us at
                                                                <a href="mailto:{{contact_email}}" style="font-size: 14px; text-decoration: none; color: #1990C6;">{{contact_email}}</a>
                                                            </p>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </center>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <img src="https://cdn.shopify.com/shopifycloud/shopify/assets/themes_support/notifications/spacer-1a26dfd5c56b21ac888f9f1610ef81191b571603cb207c6c0f564148473cab3c.png" class="spacer" height="1" style="min-width: 600px; height: 0;">
                    </td>
                </tr>
            </tbody>
        </table>
    </body>
</html>`,
  newCustomerRejected: "You account is rejected",
  newCustomerRejectedBody: `<html>
    <head>
        <meta http-equiv="Content-Security-Policy" content="script-src 'none'; style-src * 'unsafe-inline'; default-src *; img-src * data:">
    </head>
    <body>
        <title>Your account is rejected!</title>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
        <meta name="viewport" content="width=device-width">
        <style>
            body {
                margin: 0;
            }
            h1 a:hover {
                font-size: 30px;
                color: #333;
            }
            h1 a:active {
                font-size: 30px;
                color: #333;
            }
            h1 a:visited {
                font-size: 30px;
                color: #333;
            }
            a:hover {
                text-decoration: none;
            }
            a:active {
                text-decoration: none;
            }
            a:visited {
                text-decoration: none;
            }
            .button__text:hover {
                color: #fff;
                text-decoration: none;
            }
            .button__text:active {
                color: #fff;
                text-decoration: none;
            }
            .button__text:visited {
                color: #fff;
                text-decoration: none;
            }
            a:hover {
                color: #1990C6;
            }
            a:active {
                color: #1990C6;
            }
            a:visited {
                color: #1990C6;
            }
            @media(max-width: 600px) {
                .container {
                    width: 94% !important;
                }
                .main-action-cell {
                    float: none !important;
                    margin-right: 0 !important;
                }
                .secondary-action-cell {
                    text-align: center;
                    width: 100%;
                }
                .header {
                    margin-top: 20px !important;
                    margin-bottom: 2px !important;
                }
                .shop-name__cell {
                    display: block;
                }
                .order-number__cell {
                    display: block;
                    text-align: left !important;
                    margin-top: 20px;
                }
                .button {
                    width: 100%;
                }
                .or {
                    margin-right: 0 !important;
                }
                .apple-wallet-button {
                    text-align: center;
                }
                .customer-info__item {
                    display: block;
                    width: 100% !important;
                }
                .spacer {
                    display: none;
                }
                .subtotal-spacer {
                    display: none;
                }
            }
        </style>
        <table class="body" style="height: 100% !important; width: 100% !important; border-spacing: 0; border-collapse: collapse;">
            <tbody>
                <tr>
                    <td style="font-family: -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, &quot;Roboto&quot;, &quot;Oxygen&quot;, &quot;Ubuntu&quot;, &quot;Cantarell&quot;, &quot;Fira Sans&quot;, &quot;Droid Sans&quot;, &quot;Helvetica Neue&quot;, sans-serif;">
                        <table class="header row" style="width: 100%; border-spacing: 0; border-collapse: collapse; margin: 40px 0 20px;">
                            <tbody>
                                <tr>
                                    <td class="header__cell" style="font-family: -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, &quot;Roboto&quot;, &quot;Oxygen&quot;, &quot;Ubuntu&quot;, &quot;Cantarell&quot;, &quot;Fira Sans&quot;, &quot;Droid Sans&quot;, &quot;Helvetica Neue&quot;, sans-serif;">
                                        <center>
                                            <table class="container" style="width: 560px; text-align: left; border-spacing: 0; border-collapse: collapse; margin: 0 auto;">
                                                <tbody>
                                                    <tr>
                                                        <td style="font-family: -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, &quot;Roboto&quot;, &quot;Oxygen&quot;, &quot;Ubuntu&quot;, &quot;Cantarell&quot;, &quot;Fira Sans&quot;, &quot;Droid Sans&quot;, &quot;Helvetica Neue&quot;, sans-serif;">
                                                            <table class="row" style="width: 100%; border-spacing: 0; border-collapse: collapse;">
                                                                <tbody>
                                                                    <tr>
                                                                        <td class="shop-name__cell" style="font-family: -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, &quot;Roboto&quot;, &quot;Oxygen&quot;, &quot;Ubuntu&quot;, &quot;Cantarell&quot;, &quot;Fira Sans&quot;, &quot;Droid Sans&quot;, &quot;Helvetica Neue&quot;, sans-serif;">
                                                                            <h1 class="shop-name__text" style="font-weight: normal; font-size: 30px; color: #333; margin: 0;">
                                                                                <p style="font-size: 26px; color: #333; text-decoration: none; line-height: 35px; margin-top: -20px;">Sorry, your {{store_name}} account has been rejected by store owner.</p>
                                                                                <span style="font-size: 17px; color: #333; text-decoration: none; line-height: 28px; display: block;">If you think there was a mistake, contact us for further information on your rejection.</span> <br>
                                                                            </h1>
                                                                            <a style="font-size: 16px;text-decoration: none;color: #1990C6; text-align: center;display: block;" href="{{url_store}}">Visit our store</a>
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </center>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <table class="row footer" style="width: 100%; border-spacing: 0; border-collapse: collapse; border-top-width: 1px; border-top-color: #e5e5e5; border-top-style: solid;">
                            <tbody>
                                <tr>
                                    <td class="footer__cell" style="font-family: -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, &quot;Roboto&quot;, &quot;Oxygen&quot;, &quot;Ubuntu&quot;, &quot;Cantarell&quot;, &quot;Fira Sans&quot;, &quot;Droid Sans&quot;, &quot;Helvetica Neue&quot;, sans-serif; padding: 35px 0;">
                                        <center>
                                            <table class="container" style="width: 560px; text-align: left; border-spacing: 0; border-collapse: collapse; margin: 0 auto;">
                                                <tbody>
                                                    <tr>
                                                        <td style="font-family: -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, &quot;Roboto&quot;, &quot;Oxygen&quot;, &quot;Ubuntu&quot;, &quot;Cantarell&quot;, &quot;Fira Sans&quot;, &quot;Droid Sans&quot;, &quot;Helvetica Neue&quot;, sans-serif;">
                                                            <p class="disclaimer__subtext" style="color: #999; line-height: 150%; font-size: 14px; margin: 0;">If you have any questions, contact us at
                                                                <a href="mailto:{{contact_email}}" style="font-size: 16px; text-decoration: none; color: #1990C6;">{{contact_email}}</a>
                                                            </p>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </center>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <img src="https://cdn.shopify.com/shopifycloud/shopify/assets/themes_support/notifications/spacer-1a26dfd5c56b21ac888f9f1610ef81191b571603cb207c6c0f564148473cab3c.png" class="spacer" height="1" style="min-width: 600px; height: 0;">
                    </td>
                </tr>
            </tbody>
        </table>
    </body>
</html>`,
};
