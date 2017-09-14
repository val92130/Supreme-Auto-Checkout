import BaseProcessor from './baseProcessor';
import * as InputProcessor from '../InputProcessor';
import { timeout } from '../helpers';


export default class CheckoutProcessor extends BaseProcessor {
  static start(preferences, sizings, billing) {
    const processor = new CheckoutProcessor(preferences, sizings, billing);
    processor.beginProcess();
    return processor;
  }

  beginProcess() {
    this.processCheckout();
  }


  /**
   * This function should be called when the user is on the 'checkout' page, it will fill
   * the checkout form with the values defined by the user in the options and then checkout after a delay
   * @param  {Object} preferencesStore Object that stores the preference options
   * @param  {Object} billingStore Object that stores the billings options
   */
  processCheckout() {
    const checkoutDelay = this.preferences.checkoutDelay;
    const inputs = [...document.querySelectorAll('input, textarea, select')]
      .filter(x => ['hidden', 'submit', 'button', 'checkbox'].indexOf(x.type) === -1);
    InputProcessor.processFields(inputs, this.billing);
    const terms = document.getElementsByName('order[terms]');
    if (terms.length) {
      terms[0].click();
    }

    if (this.preferences.captchaBypass) {
      const captcha = document.querySelector('.g-recaptcha');
      if (captcha) {
        captcha.remove();
      }
    }
    if (this.preferences.autoPay) {
      timeout(() => {
        const commitBtn = document.getElementsByName('commit')[0];
        if (commitBtn) {
          commitBtn.click();
        }
      }, checkoutDelay, 'Checking out');
    }
  }
}