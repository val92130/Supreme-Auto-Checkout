const ignoredIds = ['g-recaptcha-response', 'number_v', 'order_billing_address_3'];

export default class CheckoutService{
  static async processFields(inputs, settings, delay) {
    const successes = await Promise.all(inputs.map(x => this.processField(x, settings, delay)));
    await this.cleanup(inputs, settings);
    return successes.every(x => x === true);
  }

  static async processField(input, settings, delay) {
    const id = input.id;
    if (ignoredIds.indexOf(id) !== -1) {
      return true;
    }
    if (typeof (settings[id]) !== 'undefined') {
      await this.setInputValue(input, settings[id], delay);
      return true;
    }
    return this.processUnknownField(input, settings);
  }

  static type(input, value, delay){
    return new Promise((resolve) => {
      (function writer(i){
        if(value.length <= i++){
          input.value = value;
          resolve();
          return;
        }
        input.value = value.substring(0,i);
        setTimeout(function(){writer(i);}, delay/100 - 10);
      })(0)
    })
  }

  static async setInputValue(input, value, delay, dispatchEvent=true) {
    if (value === undefined) return input;

    input.type === 'select-one' ? input.value = value : await this.type(input, value, delay);

    if (dispatchEvent) {
      input.dispatchEvent(new Event('change'));
    }
    return input;
  }

  static async processUnknownField(input, settings) {
    const splittedName = settings['order_billing_name'].split(' ');
    if (input.name === 'credit_card[last_name]') {
      await this.setInputValue(input, splittedName[0]);
      return true;
    }
    if (input.name === 'credit_card[first_name]') {
      await this.setInputValue(input, splittedName[1]);
      return true;
    }
    if (input.name === 'order[billing_name]') {
      await this.setInputValue(input, settings['order_billing_name']);
      return true;
    }

    if (input.name === 'order[email]') {
      await this.setInputValue(input, settings['order_email']);
      return true;
    }

    if (input.name === 'order[tel]') {
      await this.setInputValue(input, settings['order_tel']);
      return true;
    }

    if (input.name === 'order[billing_address]') {
      await this.setInputValue(input, settings['bo']);
      return true;
    }

    if (input.name === 'order[billing_address_2]') {
      await this.setInputValue(input, settings['oba3']);
      return true;
    }

    if (input.name === 'order[billing_city]') {
      await this.setInputValue(input, settings['order_billing_city']);
      return true;
    }

    if (input.name === 'order[billing_zip]') {
      await this.setInputValue(input, settings['order_billing_zip']);
      return true;
    }

    if (input.name === 'order[billing_state]') {
      await this.setInputValue(input, settings['order_billing_state']);
      return true;
    }

    if (input.name === 'order[billing_country]') {
      await this.setInputValue(input, settings['order_billing_country']);
      return true;
    }

    if (input.name === 'credit_card[type]') {
      await this.setInputValue(input, settings['credit_card_type']);
      return true;
    }

    if (input.name === 'credit_card[month]') {
      await this.setInputValue(input, settings['credit_card_month']);
      return true;
    }

    if (input.name === 'credit_card[year]') {
      await this.setInputValue(input, settings['credit_card_year']);
      return true;
    }

    if (input.name === 'credit_card[nlb]' || input.name === 'credit_card[cnb]') {
      await this.setInputValue(input, settings['cnb']);
      return true;
    }

    if (input.name === 'credit_card[rvv]' || input.name === 'credit_card[vval]') {
      await this.setInputValue(input, settings['vval']);
      return true;
    }

    return this.processByLabel(input, settings);
  }

  static async processByLabel(input, settings) {
    let parent = input.parentNode;
    let label = parent.getElementsByTagName('label')[0] || parent.querySelector('.sr-label');
    if (!label) {
      const children = parent.childNodes;
      for (let i = 0; i < children.length; i += 1) {
        const hasClass = [...children[i].classList].filter(x => x.toLowerCase().indexOf('label') !== -1).length > 0;
        if (hasClass) {
          label = children[i];
          break;
        }
      }
    }
    if (!label) return false;

    const text = label.innerText;
    if (!text) {
      return;
    }

    const inArray = function(txt, arr) {
      return arr.map(x => x.toLowerCase()).indexOf(txt.toLowerCase()) !== -1;
    };

    const hasText = arr => inArray(text, arr);

    if (hasText(['nom', 'name', 'firstname', 'lastname', 'nom', 'prenom'])) {
      await this.setInputValue(input, settings['order_billing_name']);
      return true;
    }
    if (hasText(['email', 'Eメール'])) {
      await this.setInputValue(input, settings['order_email']);
      return true;
    }
    if (hasText(['tel', 'phone', 'phone number', '電話番号'])) {
      await this.setInputValue(input, settings['order_tel']);
      return true;
    }
    if (hasText(['address', 'adresse', 'addresse', '住所'])) {
      await this.setInputValue(input, settings['bo']);
      return true;
    }
    if (hasText(['address 2'])) {
      await this.setInputValue(input, settings['oba3']);
      return true;
    }
    if (hasText(['city', 'ville', '区市町村'])) {
      await this.setInputValue(input, settings['order_billing_city']);
      return true;
    }
    if (hasText(['zip', 'code postal', 'codepostal', 'code_postal', 'postal code', 'postalcode', '郵便番号'])) {
      await this.setInputValue(input, settings['order_billing_zip']);
      return true;
    }
    if (hasText(['country', 'pays'])) {
      await this.setInputValue(input, settings['order_billing_country']);
      return true;
    }
    if (hasText(['state', 'état', 'etat', 'province', '都道府県'])) {
      await this.setInputValue(input, settings['order_billing_state']);
      return true;
    }
    if (hasText(['type', 'type de carte', 'credit card type', '支払い方法'])) {
      await this.setInputValue(input, settings['credit_card_type']);
      return true;
    }
    if (hasText(['numéro', 'number', 'numero', 'カード番号'])) {
      await this.setInputValue(input, settings['cnb']);
      return true;
    }
    if (hasText(['exp. date', 'exp date', 'expiry date', 'date d’exp.', 'date d\'exp.', 'date d\'expiration', '有効期限'])) {
      if (input.type === 'select-one') {
        const isMonth = input.options && input.options[0] && input.options[0].value[0] === '0';
        await this.setInputValue(input, settings[isMonth ? 'credit_card_month' : 'credit_card_year']);
        return true;
      }
    }
    if (hasText(['CVV', 'CVV番号'])) {
      await this.setInputValue(input, settings['vval']);
      return true;
    }
    return this.processByName(input, settings);
  }

  static async processByName(input, settings) {
    if (Object.keys(settings).indexOf(input.name) !== -1) {
      await this.setInputValue(input, settings[input.name]);
      return true;
    }
    return this.processByParent(input, settings);
  }

  static async processByParent(input, settings) {
    const parent = input.parentNode;
    if (!parent) {
      return false;
    }
    const classList = [...parent.classList];
    if (classList.indexOf('credit_card_verification_value') !== -1) {
      await this.setInputValue(input, settings['vval']);
      return true;
    }

    if (classList.indexOf('credit_card_number') !== -1) {
      await this.setInputValue(input, settings['cnb']);
      return true;
    }

    // probably a card detail input
    if(parent.parentNode && parent.parentNode.id === 'card_details') {
      // either month/year of expiry date
      if (input.type === 'select-one') {
        const isMonth = input.options && input.options[0] && input.options[0].value[0] === '0';
        await this.setInputValue(input, settings[isMonth ? 'credit_card_month' : 'credit_card_year']);
        return true;
      }

      // probably cvv
      if (input.attributes['maxlength']) {
        await this.setInputValue(input, settings['vval']);
        return true;
      }

      // otherwise its probably cc number
      await this.setInputValue(input, settings['cnb']);
    }
  }

  static async cleanup(inputs, settings) {
    const input = document.getElementById('order_billing_state') || document.querySelector('[name="order[billing_state]"]');
    if (input) {
      await this.setInputValue(input, settings['order_billing_state'], false);
      return true;
    }
    const stateLabel = document.querySelector('#state_label');
    if (stateLabel && stateLabel.parentNode) {
      const stateSelect = stateLabel.parentNode.querySelector('select');
      if (stateLabel) {
        await this.setInputValue(stateSelect, settings['order_billing_state'], false);
        return true;
      }
    }

    const stateInputParent = document.querySelector('.order_billing_state');
    if (stateInputParent) {
      const selector = stateInputParent.querySelector('select');
      if (selector) {
        await this.setInputValue(selector, settings['order_billing_state'], false);
        return true;
      }
    }
    return false;
  }

}
