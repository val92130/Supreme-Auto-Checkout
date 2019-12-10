import $ from 'jquery';
import * as SupremeUtils from '../../../../app/utils/SupremeUtils';
import BaseProcessor from './baseProcessor';
import { notify } from '../notification';
import { timeout } from '../helpers';

export default class CartProcessor extends BaseProcessor {
  static start(preferences, sizings, billing) {
    const processor = new CartProcessor(preferences, sizings, billing);
    processor.beginProcess();
    return processor;
  }

  beginProcess() {
    this.processCart();
  }

    /**
   * This function should be called when the user is on the 'cart' page, it will then redirect the user
   * to the checkout page after the delay configured in the options
   */
  processCart() {
    if (!this.preferences.autoCheckout) {
      return;
    }
    const outOfStockItems = document.querySelectorAll('.out_of_stock');
    const outOfStockAction = this.preferences.onCartSoldOut;
    if (!outOfStockItems.length) {
      timeout(() => {
        document.location.href = '/checkout';
      }, 100, 'Going to checkout');
      return;
    }
    if (outOfStockAction === SupremeUtils.OnSoldOutCartActions.STOP) {
      notify('Product was sold out, aborting...', true);
    } else if (outOfStockAction === SupremeUtils.OnSoldOutCartActions.REMOVE_SOLD_OUT_PRODUCTS) {
      const promises = [];
      for (const product of outOfStockItems) {
        const form = product.querySelector('form');
        if (form) {
          promises.push(new Promise((resolve, reject) => {
            $.ajax({
              type: 'POST',
              url: $(form).attr('action'),
              data: $(form).serializeArray(),
              success: resolve,
              error: reject,
            });
          }));
        }
      }
      Promise.all(promises).then(() => {
        timeout(() => {
          document.location.href = '/checkout';
        }, 100, 'Going to checkout');
      });
    }
  }
}
