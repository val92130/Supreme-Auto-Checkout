Supreme Auto Checkout
=====================

Supreme Auto Checkout is a Google Chrome extension to automate the process of buying a product from the Supreme shop.

![Bot](https://github.com/val92130/Supreme-Auto-Checkout/blob/develop/screen-bot.jpg "Bot")

# Requirements
  - Chrome for desktop release 55

# Features

Supreme Auto Checkout provides many features such as:
  - **Auto Checkout** - The product will automatically be added to your cart and will straight go to the checkout page.
  - **AutoFill** - All of your billing informations will be automaticaly filled on the checkout page.
  - **Configurable delays for every steps of the checkout process.**
  - **Size choice for every category of product.**
  - **Captcha bypass** (beta feature).
  - **Option to set a minimum/maximum price for a product.**
  - **Option to hide sold out products.**
  - **Easy configuration.**
  
# Coming soon
Features that will be added in the future:
  - **AutoCop** - You can set keywords for products and they will automatically be added to cart when they are available on the shop.
  - **Product Monitor** - Be notified when new products are added to the shop.

# Installation

To install the chrome extension you must first download the latest release [here](https://github.com/val92130/Supreme-Auto-Checkout/releases).

Once it's done, follow these steps:
  >- Extract the downloaded release to a folder of your choice.
  >- Open Google Chrome and type in your address bar **chrome://extensions/** and enable the **Developer** mode option at the top of the page.
  >- Drag the **bot/build** folder containing the extension into Google Chrome.

# Configuration

After the extension is installed, the extension logo should appear on the Chrome menu.

Make sure to configure all the required options otherwise the bot won't load.

# Usage

After you have configured the extension, go to the Supreme website. If the extension is installed correctly you should see a message on the top of the webpage stating that the bot is running.

If you have a message stating that the bot is not configured, check that every required option is filled in the bot configuration page.

Once on a product page, if **AutoCheckout** is enabled, the bot will automatically try to add to your cart your desired size for the product category.
If you have enabled the **Strict size choice** option, the product won't be added to your cart if your desired size isn't available, otherwise, it will try to add the first available size for the product.

If you have set the **Minimum Price** or **Maximum Price** option, the product won't be added to your cart if the price is higher or lower than what you set.

If **Auto Payment** is enabled, the bot will automatically submit the checkout form once you're on the checkout page, otherwise, your billing infos will still be automatically filled but you will need to manually click on the checkout button.

# Captcha Bypass

The **Captcha Bypass** feature works by deleting from the DOM the node containing the re-captcha input.

This temporary works because Supreme doesn't seems to validate Google's Re-captcha on server-side.

This option is **NOT** recommended, use with caution.
 
 # Development
 
Requirements:
- node.js 7+
- yarn

First, you'll need to install the npm dependencies:
 ```bash
  $ yarn
 ```
 
To build and run the dev server, type the following command in your terminal:
 ```bash
  $ yarn start
 ```
 
 To package a new version of the application run the following command:
  ```bash
   $ yarn build
  ```
