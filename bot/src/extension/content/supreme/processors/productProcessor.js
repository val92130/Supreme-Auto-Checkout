import { notify } from '../notification';
import * as Helpers from '../helpers';
import BaseProcessor from './baseProcessor';
import FuzzyStringMatcher from '../../../../app/utils/FuzzyStringMatcher';
import AtcService from '../../../../services/supreme/AtcService';

export default class ProductProcessor extends BaseProcessor {
  static start(preferences, sizings, billing) {
    const processor = new ProductProcessor(preferences, sizings, billing);
    processor.beginProcess();
    return processor;
  }

  beginProcess() {
    this.processProduct();
  }

  /**
   * Check if the current product is sold out
   * @return {Boolean}
   */
  static isSoldOut() {
    return document.querySelector('input[name=commit]') === null;
  }

  /**
   * Returns the product category when the user is on a product page
   */
  static getProductCategory() {
    const category = Helpers.getQueryStringValue('atc-category');
    return !category ? location.pathname.substring(1).split('/')[1] : category;
  }

  static sizeMatch(sA, sB, category) {
    const sizeA = sA.toString().toLowerCase();
    const sizeB = sB.toString().toLowerCase();
    if (!sizeB || !sizeA) return false;

    if (sizeA === sizeB) {
      return true;
    }

    if (category === 'shoes') {
      // Match sizes like UK10/US10.5'
      const a = sizeA.split(/(?:\/)+/);
      const b = sizeB.split(/(?:\/)+/);

      if (a.some(x => b.indexOf(x) !== -1)) {
        return true;
      }
      return a[0].replace(/\D/g, '') === b[0].replace(/\D/g, '');
    }

    if (!isNaN(sizeA) || !isNaN(sizeB)) return false;

    // Match sizes like 'S/M';
    const splitA = sizeA.split('/');
    const splitB = sizeB.split('/');

    return splitA.some(x => sizeB[0] === x[0]) || splitB.some(x => sizeA[0] === x[0]);
  }

  /**
   * Return the available sizes for the current product
   * @return {Array}
   */
  static getSizesOptions() {
    const sizes = document.getElementById('size') || document.querySelector('[name=size]') || (document.querySelector('form.add').querySelector('select'));
    if (!sizes || !sizes.options) {
      return [];
    }
    return [...sizes.options];
  }

  static getAvailableColors() {
    const colors = Array.from(document.querySelectorAll('[data-style-name]')).map(x => ({
      name: x.attributes['data-style-name'].value,
      node: x
    }));
    const data = [];
    // remove dups
    for (let i = 0; i < colors.length; i += 1) {
      if (!data.find(x => x.name === colors[i].name)) {
        data.push(colors[i]);
      }
    }
    return data;
  }

  trySelectProductSize() {
    const productCategory = ProductProcessor.getProductCategory();
    const sizesOptions = ProductProcessor.getSizesOptions();

    // If sizes options are available
    if (sizesOptions.length) {
      const categorySize = this.sizings[productCategory];
      if (categorySize === undefined) {
        notify(`Unknown category "${productCategory}", cannot process`, true);
        return false;
      }
      let targetOption = sizesOptions.find(x => ProductProcessor.sizeMatch(categorySize, x.text, productCategory));

      if (!targetOption) {
        if (this.preferences.strictSize && categorySize !== 'Any') {
          notify('The desired size is not available', true);
          return false;
        }
        targetOption = sizesOptions[0];
      }
      targetOption.selected = true;
    }
    return true;
  }

  isPriceInRange() {
    const maxPrice = this.preferences.maxPrice;
    const minPrice = this.preferences.minPrice;
    const itemPrice = document.querySelector('[itemprop=price]');

    if (itemPrice === null) return false;
    const price = +(itemPrice.innerHTML.replace(/\D/g, ''));
    if (isNaN(price)) return false;

    if (maxPrice !== undefined && price > maxPrice) {
      notify('Product price is too high, not checking out', true);
      return false;
    }

    if (minPrice !== undefined && price < minPrice) {
      notify('Product price is too low, not checking out', true);
      return false;
    }
    return true;
  }

  addToCart(nextUrl = null) {
    const atcDelay = this.preferences.addToCartDelay;
    const submitBtn = document.querySelector('[name=commit]');

    Helpers.timeout(() => {
      const process = () => {
        if (document.querySelector('.in-cart') && document.getElementById('cart')) {
          if (nextUrl) {
            window.location.href = nextUrl;
            Helpers.timeout(() => window.location.href = nextUrl, 200, 'Going to next step...');
            return false;
          }
        } else {
          submitBtn.click();
          Helpers.timeout(() => process(), 500, 'Waiting for product to be in cart...');
        }
      };

      process();
    }, atcDelay, 'Adding to cart');
  }

  async processProductMonitor() {
    const atcRunAll = Helpers.getQueryStringValue('atc-run-all');
    const atcId = Number(Helpers.getQueryStringValue('atc-id'));
    const atcProduct = await AtcService.getAtcProductById(atcId);
    const atcColor = Helpers.getQueryStringValue('atc-color');

    if (!atcProduct) return notify('Invalid Autocop Product Id');

    let nextUrl = '/checkout';
    if (atcRunAll) {
      const nextProduct = await AtcService.getNextAtcMonitorProduct(atcId);
      if (nextProduct) {
        nextUrl = await AtcService.getAtcMonitorUrl(nextProduct, true);
      }
    }

    const colors = ProductProcessor.getAvailableColors();
    const firstAvailableColor = colors.find(x => {
      const soldOutAttr = x.node.attributes['data-sold-out'];
      if (soldOutAttr) {
        return soldOutAttr.value === 'false';
      }
      return true;
    });
    if (atcColor) {
      if (firstAvailableColor && atcColor === 'any') {
        if (atcRunAll) {
          firstAvailableColor.node.href = `${firstAvailableColor.node.href}?atc-id=${atcId}&atc-run-all=true&atc-monitor=true`;
        }
        firstAvailableColor.node.click();
        return false;
      }
      const fuse = new FuzzyStringMatcher(colors, {key: 'name'});
      const matches = fuse.search(atcColor);
      if (matches.length) {
        if (atcRunAll) {
          window.location.href = `${matches[0].node.href}?atc-id=${atcId}&atc-run-all=true&atc-monitor=true`;
        } else {
          window.location.href = matches[0].node.href;
        }
        return false;
      }
    }

    if (ProductProcessor.isSoldOut()) {
      if (nextUrl) {
        window.location.href = nextUrl;
        Helpers.timeout(() => window.location.href = nextUrl, 500, 'No sizes available, going to next atc product...', true);
      }
      return false;
    }

    const hasSelectedSize = this.trySelectProductSize();
    if (!this.isPriceInRange() || !hasSelectedSize) {
      if (nextUrl) {
        window.location.href = nextUrl;
        Helpers.timeout(() => window.location.href = nextUrl, 500, 'Continuing to next step...', true);
        return false;
      }
    }

    this.addToCart(nextUrl);
    return true;
  }

  /**
   * This function should be called when the user is on a product page, it will
   * try to figure out if the product is sold out or not, and if not, it will find the best available size
   * based on the user's preferences and then it will add the item to cart
   */
  async processProduct() {
    const atcRunAll = Helpers.getQueryStringValue('atc-run-all');
    const atcId = Number(Helpers.getQueryStringValue('atc-id'));
    const atcMonitor = Helpers.getQueryStringValue('atc-monitor');

    if (isNaN(atcId) && !this.preferences.autoCheckout) return false;

    if (!isNaN(atcId) && atcMonitor) {
      return await this.processProductMonitor();
    }
    let nextUrl = '/checkout';
    if (!isNaN(atcId) && atcRunAll) {
      const nextProduct = await AtcService.getNextEnabledAtcProduct(atcId);
      if (nextProduct) {
        nextUrl = AtcService.getAtcUrl(nextProduct, true);
      }
    }

    if (ProductProcessor.isSoldOut()) {
      if (nextUrl) {
        window.location.href = nextUrl;
        Helpers.timeout(() => window.location.href = nextUrl, 500, 'No sizes available, going to next atc product...', true);
      }
      return false;
    }

    const hasSelectedSize = this.trySelectProductSize();
    if (!this.isPriceInRange() || !hasSelectedSize) {
      if (nextUrl) {
        window.location.href = nextUrl;
        Helpers.timeout(() => window.location.href = nextUrl, 500, 'Continuing to next step...', true);
        return false;
      }
    }

    this.addToCart(nextUrl);
    return true;
  }
}
