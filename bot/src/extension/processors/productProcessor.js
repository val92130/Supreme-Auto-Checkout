import { notify } from '../notification';
import * as Helpers from '../helpers';
import BaseProcessor from './baseProcessor';

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

    /**
   * This function should be called when the user is on a product page, it will
   * try to figure out if the product is sold out or not, and if not, it will find the best available size
   * based on the user's preferences and then it will add the item to cart
   */
  processProduct() {
    const atcStyleId = Helpers.getQueryStringValue('atc-style-id');
    if (atcStyleId) {
      const btn = document.querySelector(`[data-style-id="${atcStyleId}"]`);
      if (btn) {
        btn.click();
        return;
      }
    }
    if (!ProductProcessor.isSoldOut()) {
      const maxPrice = this.preferences.maxPrice;
      const minPrice = this.preferences.minPrice;
      const itemPrice = document.querySelector('[itemprop=price]');


      if (itemPrice !== null) {
        const price = +(itemPrice.innerHTML.replace(/\D/g, ''));
        if (!isNaN(price)) {
          if (maxPrice !== undefined && price > maxPrice) {
            notify('Product price is too high, not checking out');
            return;
          }

          if (minPrice !== undefined && price < minPrice) {
            notify('Product price is too low, not checking out');
            return;
          }
        }
      }

      const submitBtn = document.querySelector('[name=commit]');
      const productCategory = ProductProcessor.getProductCategory();
      const sizesOptions = ProductProcessor.getSizesOptions();

      // If sizes options are available
      if (sizesOptions.length) {
        const categorySize = this.sizings[productCategory];
        if (categorySize === undefined) {
          notify(`Unknown category "${productCategory}", cannot process`);
          return;
        }
        let targetOption = sizesOptions.find(x => ProductProcessor.sizeMatch(categorySize, x.text, productCategory));

        if (!targetOption) {
          if (this.preferences.strictSize) {
            notify('The desired size is not available');
            return;
          }
          targetOption = sizesOptions[0];
        }
        targetOption.selected = true;
      }

      const atcDelay = this.preferences.addToCartDelay;
      Helpers.timeout(() => {
        const process = () => {
          if (document.querySelector('.in-cart') && document.getElementById('cart')) {
            setTimeout(() => {
              window.location.href = '/checkout';
            }, 200);
          } else {
            submitBtn.click();
            Helpers.timeout(() => process(), 500, 'Waiting for product to be in cart...');
          }
        };

        process();
      }, atcDelay, 'Adding to cart');
    }
  }
}
