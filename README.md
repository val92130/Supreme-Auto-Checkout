Supreme Auto Checkout
=====================

Supreme Auto Checkout is a Google Chrome extension to automate the process of buying a product from the Supreme shop.

![Bot](https://github.com/val92130/Supreme-Auto-Checkout/blob/develop/screenshot.jpg "Bot")

# Requirements
  - Chrome for desktop release 55

# Features

Supreme Auto Checkout provides many features such as:
  - **Auto Checkout** - The product will automatically be added to your cart and will straight go to the checkout page.
  - **AutoFill** - All of your billing informations will be automaticaly filled on the checkout page.
  - **Multi profiles** - You can setup multiple profiles to quickly switch settings during drop day!
  - **Configurable delays for every steps of the checkout process.**
  - **Size choice for every category of product.**
  - **Option to set a minimum/maximum price for a product.**
  - **Option to hide sold out products.**
  - **Easy configuration.**
  - **AutoCop** - You can set keywords for products and they will automatically be added to cart when they are available on the shop.
  - **Product Monitor** - Be notified when a product goes back in stock!
  - **Profile Export** - Export your profiles and securely import them onto another computer (Your data will be encrypted using AES).
  - **Drop list**

# Coming soon
Features that will be added in the future:
  - **Proxies support**

# Installation

You can download the bot on the Chrome Web Store [here](https://chrome.google.com/webstore/detail/supreme-auto-checkout-bot/lokkgfofiabinmcohpdalkcmfjpepkjb?hl=fr&gl=FR).

Or you can also download the latest release [here](https://github.com/val92130/Supreme-Auto-Checkout/releases).

Once it's done, follow these steps:
  >- Extract the downloaded release to a folder of your choice.
  >- Open Google Chrome and type in your address bar **chrome://extensions/** and enable the **Developer** mode option at the top of the page.
  >- Drag the extracted folder containing the extension into Google Chrome.

# Configuration

After the extension is installed, the extension logo should appear on the Chrome menu.

Make sure to configure all the required options otherwise the bot won't load.

It is also recommended to clear your cookies on the Supreme shop before using the bot.

# Usage

After you have configured the extension, go to the Supreme website. If the extension is installed correctly you should see a message on the top of the webpage stating that the bot is running.

If you have a message stating that the bot is not configured, check that every required option is filled in the bot configuration page.

Once on a product page, if **AutoCheckout** is enabled, the bot will automatically try to add to your cart your desired size for the product category.
If you have enabled the **Strict size choice** option, the product won't be added to your cart if your desired size isn't available, otherwise, it will try to add the first available size for the product.

If you have set the **Minimum Price** or **Maximum Price** option, the product won't be added to your cart if the price is higher or lower than what you set.

If **Auto Payment** is enabled, the bot will automatically submit the checkout form once you're on the checkout page, otherwise, your billing infos will still be automatically filled but you will need to manually click on the checkout button.

# AutoCop

Autocop is a feature to automatically add to cart products who matches some specific keywords.

You **MUST** keep your browser open for this feature to work.

To set it up, you first must enable **AutoCheckout** and **Enable AutoCop** in the Options tab.

You'll then have to setup an **ATC Start Time**, which would most likely be the time when the online shop updates (11AM).

You will have to set the time as a 24hour format (hh:mm:ss), note that it will be based on your system's time.

A recommended value would be **11:00:10** to make sure that the shop has updated before running the ATC.

Once the ATC time is reached, the bot will automatically open a tab to add to cart matching products.

The product who matches the most the keywords will be added to the cart.

![Atc](https://github.com/val92130/Supreme-Auto-Checkout/blob/develop/atc.gif "Atc")

# Setting up AutoCop products

To setup AutoCop products, you need to go in the **AutoCop** tab of your bot then click on the **Add new** button.

This will open a form requesting the following informations:
   - **Name** - A name to distinct your atc products, not really important.
   - **Product keywords** - This field is a multi-selectable input, you can add keywords by pressing the Enter key,
   thoses keywords are **case insensitive** and white-spaces at the end and start of the keyword will be removed.
   - **Color** (optional) - If set, the ATC will try to checkout the product matching this color, also **case insensitive**.
   - **Product category** - The category of the product.
   - **Retry count if not found** - If the product is not found during an Autocop, the page will tryo to find the product again for N times before skipping to the next Autocop product.
   - **Enabled**

You can manually trigger the AutoCop for a product by clicking on the `Run now` button in the Atc product list.

# Development

Requirements:
- node.js 7+
- yarn

First, you'll need to install the npm dependencies:
 ```bash
  $ yarn
 ```

 To build and watch for changes run the following command:
  ```bash
   $ yarn watch
  ```

  To build the project, run:
  ```bash
  $ yarn build
  ```

 Those commands will create a `build` folder containing the packaged application.

 To run unit tests:
 ```bash
 $ yarn test
 ```

## Donation
This project will always be supported for free but any donation would be greatly appreciated!

[![paypal](https://www.paypalobjects.com/en_US/i/btn/btn_donateCC_LG.gif)](https://www.paypal.me/vchatelain)
