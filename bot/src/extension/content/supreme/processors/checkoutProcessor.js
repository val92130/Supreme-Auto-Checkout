import BaseProcessor from './baseProcessor';
import CheckoutService from '../../../../services/supreme/CheckoutService';
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
   */
  async processCheckout() {
    const checkoutDelay = this.preferences.checkoutDelay;
    const querySelectorAll = (document.mockedQuerySelectorAll || document.querySelectorAll)
      .bind(document);
    const querySelector = (document.mockedQuerySelector || document.querySelector)
      .bind(document);

    const inputs = [...querySelectorAll('input, textarea, select')]
      .filter(x => ['hidden', 'submit', 'button', 'checkbox'].indexOf(x.type) === -1
        && (!x.value || x.type === 'select-one'));
    await CheckoutService.processFields(inputs, this.billing, checkoutDelay);
    const terms = querySelector('.terms');
    if (terms) terms.click();
    const checkboxes = querySelectorAll('input[type="checkbox"]');
    if (checkboxes.length) checkboxes[checkboxes.length - 1].checked = true;
    if (this.preferences.autoPay) {
      timeout(() => {
        const commitBtn = querySelector('[name="commit"]');
        if (commitBtn) {
          commitBtn.click();
        }
      }, checkoutDelay, 'Checking out');
    }
  }
}
