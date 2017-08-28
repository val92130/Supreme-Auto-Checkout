const ignoredIds = ['g-recaptcha-response', 'number_v', 'oba3', 'order_billing_address_3'];

export function setInputValue(input, value, dispatchEvent=true) {
  input.value = value;
  if (dispatchEvent) {
    input.dispatchEvent(new Event('change'));
  }
  return input;
}

export function processField(input, settings) {
  const id = input.id;
  if (ignoredIds.indexOf(id) !== -1) {
    return true;
  }

  if (typeof (settings[id]) !== 'undefined') {
    setInputValue(input, settings[id]);
    return true;
  }
  return processUnknownField(input, settings);
}

export function processUnknownField(input, settings) {
  if (input.name === 'order[billing_name]') {
    setInputValue(input, settings['order_billing_name']);
    return true;
  }

  if (input.name === 'order[email]') {
    setInputValue(input, settings['order_email']);
    return true;
  }

  if (input.name === 'order[tel]') {
    setInputValue(input, settings['order_tel']);
    return true;
  }

  if (input.name === 'order[billing_address]') {
    setInputValue(input, settings['bo']);
    return true;
  }

  if (input.name === 'order[billing_city]') {
    setInputValue(input, settings['order_billing_city']);
    return true;
  }

  if (input.name === 'order[billing_zip]') {
    setInputValue(input, settings['order_billing_zip']);
    return true;
  }

  if (input.name === 'order[billing_state]') {
    setInputValue(input, settings['order_billing_state']);
    return true;
  }

  if (input.name === 'order[billing_country]') {
    setInputValue(input, settings['order_billing_country']);
    return true;
  }

  if (input.name === 'credit_card[type]') {
    setInputValue(input, settings['credit_card_type']);
    return true;
  }

  if (input.name === 'credit_card[month]') {
    setInputValue(input, settings['credit_card_month']);
    return true;
  }

  if (input.name === 'credit_card[year]') {
    setInputValue(input, settings['credit_card_year']);
    return true;
  }

  if (input.name === 'credit_card[nlb]' || input.name === 'credit_card[cnb]') {
    setInputValue(input, settings['cnb']);
    return true;
  }

  if (input.name === 'credit_card[rvv]' || input.name === 'credit_card[vval]') {
    setInputValue(input, settings['vval']);
    return true;
  }

  return processByLabel(input, settings);
}

export function processByLabel(input, settings) {
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
    setInputValue(input, settings['order_billing_name']);
    return true;
  }
  if (hasText(['email'])) {
    setInputValue(input, settings['order_email']);
    return true;
  }
  if (hasText(['tel', 'phone', 'phone number'])) {
    setInputValue(input, settings['order_tel']);
    return true;
  }
  if (hasText(['address', 'adresse', 'addresse'])) {
    setInputValue(input, settings['bo']);
    return true;
  }
  if (hasText(['city', 'ville'])) {
    setInputValue(input, settings['order_billing_city']);
    return true;
  }
  if (hasText(['zip', 'code postal', 'codepostal', 'code_postal', 'postal code', 'postalcode'])) {
    setInputValue(input, settings['order_billing_zip']);
    return true;
  }
  if (hasText(['country', 'pays'])) {
    setInputValue(input, settings['order_billing_country']);
    return true;
  }
  if (hasText(['state', 'état', 'etat', 'province'])) {
    setInputValue(input, settings['order_billing_state']);
    return true;
  }
  if (hasText(['type', 'type de carte', 'credit card type'])) {
    setInputValue(input, settings['credit_card_type']);
    return true;
  }
  if (hasText(['numéro', 'number', 'numero'])) {
    setInputValue(input, settings['cnb']);
    return true;
  }
  if (hasText(['exp. date', 'exp date', 'expiry date', 'date d’exp.', 'date d\'exp.', 'date d\'expiration'])) {
    if (input.type === 'select-one') {
      const isMonth = input.options && input.options[0] && input.options[0].value[0] === '0';
      setInputValue(input, settings[isMonth ? 'credit_card_month' : 'credit_card_year']);
      return true;
    }
  }
  if (hasText(['CVV'])) {
    setInputValue(input, settings['vval']);
    return true;
  }
  return processByName(input, settings);
}

export function processByName(input, settings) {
  if (Object.keys(settings).indexOf(input.name) !== -1) {
    setInputValue(input, settings[input.name]);
    return true;
  }
  return processByParent(input, settings);
}

export function processByParent(input, settings) {
  const parent = input.parentNode;
  if (!parent) {
    return false;
  }
  const classList = [...parent.classList];
  if (classList.indexOf('credit_card_verification_value') !== -1) {
    setInputValue(input, settings['vval']);
    return true;
  }

  if (classList.indexOf('credit_card_number') !== -1) {
    setInputValue(input, settings['cnb']);
    return true;
  }

  // probably a card detail input
  if(parent.parentNode && parent.parentNode.id === 'card_details') {
    // either month/year of expiry date
    if (input.type === 'select-one') {
      const isMonth = input.options && input.options[0] && input.options[0].value[0] === '0';
      setInputValue(input, settings[isMonth ? 'credit_card_month' : 'credit_card_year']);
      return true;
    }

    // probably cvv
    if (input.attributes['maxlength']) {
      setInputValue(input, settings['vval']);
      return true;
    }

    // otherwise its probably cc number
    setInputValue(input, settings['cnb']);
  }
}

export function cleanup(inputs, settings) {
  const input = document.getElementById('order_billing_state') || document.querySelector('[name="order[billing_state]"]');
  if (input) {
    setInputValue(input, settings['order_billing_state'], false);
    return true;
  }
  const stateLabel = document.querySelector('#state_label');
  if (stateLabel && stateLabel.parentNode) {
    const stateSelect = stateLabel.parentNode.querySelector('select');
    if (stateLabel) {
      setInputValue(stateSelect, settings['order_billing_state'], false);
      return true;
    }
  }

  const stateInputParent = document.querySelector('.order_billing_state');
  if (stateInputParent) {
    const selector = stateInputParent.querySelector('select');
    if (selector) {
      setInputValue(selector, settings['order_billing_state'], false);
      return true;
    }
  }
  return false;
}

export function processFields(inputs, settings) {
  const successes = [];
  for (let i = 0; i < inputs.length; i += 1) {
    const success = processField(inputs[i], settings);
    successes.push(success);
    if (!success) {
      console.info(`Unknown field id : ${inputs[i].id}`);
    }
  }
  cleanup(inputs, settings);
  return successes.every(x => x === true);
}

