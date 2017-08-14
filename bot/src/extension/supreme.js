class SupremeManager extends BaseManager {
  constructor(preferences, sizings, billing) {
    super();
    this.preferences = preferences;
    this.sizings = sizings;
    this.billing = billing;
  }
  /**
   * This function is called whenever a new page change occurs
   * @param  {String} location new location of the page
   */
  async onPageChange() {
    this.processLinks();

    // if stores are not configured yet..
    if (!this.isConfigured()) {
      this.setNotificationBarText('Bot not yet configured');
      return;
    }
    const hideSoldOut = this.preferences.hideSoldOut;
    this.processSoldOutProducts(hideSoldOut);

    const autoCheckout = this.preferences.autoCheckout;
    const autoPay = this.preferences.autoPay;
    this.setNotificationBarText('AutoCheckout ' + (autoCheckout ? 'enabled' : 'disabled') + ', AutoPay ' + (autoPay ? 'enabled' : 'disabled'));
    if (!this.preferences.autoCheckout) return;

    if (this.isProductPage()) {
      this.processProduct();
    } else if (this.isCart()) {
      this.processCart();
    } else if (this.isCheckout()) {
      this.processCheckout();
    }
  }

  isConfigured() {
    return !([this.preferences, this.sizings, this.billing].some(x => x === undefined));
  }

  /**
   * Attach an event on product links of the page to reload the page instead of loading in ajax
   */
  processLinks() {
    let links = document.links;

    for (let link of links) {
      link.addEventListener('click', function (e) {
        window.location.href = this.href;
        if (!e)
          e = window.event;

        if (e.stopPropagation) {
          e.stopPropagation();
        }
        else {
          e.cancelBubble = true;
        }
      });
    }
  }

  processSoldOutProducts(hideSoldOut) {
    Array.prototype.forEach.call(document.getElementsByClassName('sold_out_tag'), x => x.style.display = 'block');
    if (hideSoldOut) {
      let sold_outs = Array.prototype.filter.call(document.getElementsByTagName('article'), x => x.getElementsByClassName('sold_out_tag').length);
      for (let node of sold_outs) {
        node.remove();
      }
    }
  }

  /**
   * This function should be called when the user is on the 'cart' page, it will then redirect the user
   * to the checkout page after the delay configured in the options
   * @param  {Object} preferencesStore Object that stores the preference options
   */
  processCart() {
    this.timeout(() => {
      document.location.href = '/checkout';
    }, 100, 'Going to checkout');
  }

  /**
   * This function should be called when the user is on the 'checkout' page, it will fill
   * the checkout form with the values defined by the user in the options and then checkout after a delay
   * @param  {Object} preferencesStore Object that stores the preference options
   * @param  {Object} billingStore Object that stores the billings options
   */
  processCheckout() {
    const checkoutDelay = this.preferences.checkoutDelay;
    document.getElementsByName('order[terms]')[0].click();

    for (let key of Object.keys(this.billing)) {
      let el = document.getElementById(key);
      el.value = this.billing[key];
      el.dispatchEvent(new Event('change'));
    }

    if (this.preferences.captchaBypass) {
      let captcha = document.querySelector('.g-recaptcha');
      if (captcha) {
        captcha.remove();
      }
    }
    if (this.preferences.autoPay) {
      this.timeout(() => {
        document.getElementsByName('commit')[0].click();
      }, checkoutDelay, 'Checking out');
    }
  }

  /**
   * This function should be called when the user is on a product page, it will
   * try to figure out if the product is sold out or not, and if not, it will find the best available size
   * based on the user's preferences and then it will add the item to cart
   * @param  {Object} preferencesStore Object that stores the preference options
   * @param  {Object} sizingStore Object that stores the sizings options
   */
  processProduct() {
    if (!this.isSoldOut()) {
      let maxPrice = this.preferences.maxPrice;
      let minPrice = this.preferences.minPrice;
      let itemPrice = document.querySelector('[itemprop=price]');

      if (itemPrice !== null) {
        let price = itemPrice.innerHTML.replace(/\D/g, '');
        if (!isNaN(price)) {
          if (maxPrice !== undefined && price > maxPrice) {
            this.setNotificationBarText('Product price is too high, not checking out');
            return;
          }

          if (minPrice !== undefined && price < minPrice) {
            this.setNotificationBarText('Product price is too low, not checking out');
            return;
          }
        }
      }

      let submitBtn = document.querySelector('[name=commit]');
      let productCategory = this.getProductCategory();
      let sizesOptions = this.getSizesOptions();

      // If sizes options are available
      if (sizesOptions.length) {
        let categorySize = this.sizings[productCategory];
        if (categorySize === undefined) {
          this.setNotificationBarText('Unknown category "' + productCategory + '", cannot process');
          return;
        }
        let targetOption = sizesOptions.find(x => this.sizeMatch(categorySize, x.text, productCategory));

        if (!targetOption) {
          if (this.preferences.strictSize) {
            this.setNotificationBarText('The desired size is not available');
            return;
          }
          targetOption = sizesOptions[0];
        }
        targetOption.selected = true;
      }

      let atcDelay = this.preferences.addToCartDelay;
      this.timeout(() => {
        const process = () => {
          if (document.querySelector('.in-cart') && document.getElementById('cart')) {
            setTimeout(() => {
              window.location.href = '/checkout';
            }, 200);
          } else {
            submitBtn.click();
            this.timeout(() => process(), 500, 'Waiting for product to be in cart...');
          }
        };

        process();
      }, atcDelay, 'Adding to cart');
    }
  }

  /**
   * Check if the user is currently on a product page
   */
  isProductPage() {
    let path = location.pathname.substring(1).split('/');
    return (path.length === 4 && path[0] === 'shop') || getQueryStringValue('atc-category') !== "";
  }

  /**
   * Check if the user is currently on the 'cart' page
   */
  isCart() {
    let path = location.pathname.substring(1).split('/');
    return path[1] === 'cart';
  }

  /**
   * Check if the user is currently at the checkout page
   */
  isCheckout() {
    let path = location.pathname.substring(1).split('/');
    return path[0] === 'checkout';
  }

  /**
   * Returns the product category when the user is on a product page
   */
  getProductCategory() {
    let category = getQueryStringValue('atc-category');
    return category === "" ? location.pathname.substring(1).split('/')[1] : category;
  }

  /**
   * Check if the current product is sold out
   * @return {Boolean}
   */
  isSoldOut() {
    return document.querySelector('input[name=commit]') === null;
  }

  /**
   * Return the available sizes for the current product
   * @return {Array}
   */
  getSizesOptions() {
    const sizes = document.getElementById('size');
    if (!sizes || !sizes.options)
      return [];
    return [...sizes.options];
  }
}

function Start() {
  const stores = getOptions('Supreme', ['preferences', 'sizings', 'billing']);
  const supremeManager = new SupremeManager(stores[0], stores[1], stores[2]);
  supremeManager.start();
}

Start();
