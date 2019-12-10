import * as Helpers from './helpers';
import ProductProcessor from './processors/productProcessor';
import CartProcessor from './processors/cartProcessor';
import CheckoutProcessor from './processors/checkoutProcessor';
import AtcProcessor from './processors/atcProcessor';
import { notify } from './notification';

export default class SupremeManager {
  constructor(preferences, sizings, billing) {
    this.preferences = preferences;
    this.sizings = sizings;
    this.billing = billing;
  }

  start() {
    // Checks for page change by repeatedly checking the current page location and tracking change
    (() => {
      let currentPage = window.location.href;
      setInterval(() => {
        if (currentPage !== window.location.href) {
          currentPage = window.location.href;
          setTimeout(() => this.onPageChange(), 100);
        }
      }, 50);
      this.onPageChange();
    })();
  }

  /**
   * This function is called whenever a new page change occurs
   */
  async onPageChange() {
    SupremeManager.processLinks();

    // if stores are not configured yet..
    if (!this.isConfigured()) {
      notify('Extension not configured', true);
      return;
    }
    Array.prototype.forEach.call(document.getElementsByClassName('sold_out_tag'), x => x.style.display = 'block');
    if (this.preferences.hideSoldOut) {
      SupremeManager.hideSoldOutProducts();
    }

    const autoCheckout = this.preferences.autoCheckout;
    const autoPay = this.preferences.autoPay;
    notify('Auto-checkout ' + (autoCheckout ? 'enabled' : 'disabled') + ', Auto-payment ' + (autoPay ? 'enabled' : 'disabled'));

    if (Helpers.isProductPage()) {
      ProductProcessor.start(this.preferences, this.sizings, this.billing);
    } else if (Helpers.isCart()) {
      CartProcessor.start(this.preferences, this.sizings, this.billing);
    } else if (Helpers.isCheckout()) {
      CheckoutProcessor.start(this.preferences, this.sizings, this.billing);
    } else if (Helpers.isShopCategoryPage()) {
      AtcProcessor.start(this.preferences, this.sizings, this.billing);
    }
  }

  isConfigured() {
    return !([this.preferences, this.sizings, this.billing].some(x => x === undefined));
  }

  /**
   * Attach an event on product links of the page to reload the page instead of loading in ajax
   */
  static processLinks() {
    const links = document.links;
    document.body.setAttribute('data-no-turbolink', true);
    for (const link of links) {
      link.addEventListener('click', function (e) {
        window.location.href = this.href;
        if (!e) {
          e = window.event;
        }

        if (e.stopPropagation) {
          e.stopPropagation();
        } else {
          e.cancelBubble = true;
        }
      });
    }
  }

  static hideSoldOutProducts() {
    const soldOuts = Array.prototype.filter.call(document.getElementsByTagName('article'), x => x.getElementsByClassName('sold_out_tag').length);
    for (let node of soldOuts) {
      node.remove();
    }
  }
}
