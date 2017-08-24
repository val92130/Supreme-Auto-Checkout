const ignoredIds = ['g-recaptcha-response', 'number_v'];

export function processField(input, settings) {
  const id = input.id;
  if (ignoredIds.indexOf(id) !== -1) {
    return true;
  }

  if (typeof (settings[id]) !== 'undefined') {
    input.value = settings[id];
    input.dispatchEvent(new Event('change'));
    return true;
  }
  console.info(`Unknown field id : ${id}`);
  return processUnknownField(id, input, settings);
}

export function processUnknownField(id, input, settings) {
  if (input.name === 'credit_card[nlb]' || input.name === 'credit_card[cnb]') {
    input.value = settings['cnb'];
    input.dispatchEvent(new Event('change'));
    return true;
  }

  if (input.name === 'credit_card[rvv]' || input.name === 'credit_card[vval]') {
    input.value = settings['vval'];
    input.dispatchEvent(new Event('change'));
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
    input.value = settings['vval'];
    input.dispatchEvent(new Event('change'));
    return true;
  }

  if (classList.indexOf('credit_card_number') !== -1) {
    input.value = settings['cnb'];
    input.dispatchEvent(new Event('change'));
    return true;
  }

  // probably a card detail input
  if(parent.parentNode && parent.parentNode.id === 'card_details') {
    // either month/year of expiry date
    if (input.type === 'select-one') {
      const isMonth = input.options && input.options[0] && input.options[0].value[0] === '0';
      input.value = settings[isMonth ? 'credit_card_month' : 'credit_card_year'];
      input.dispatchEvent(new Event('change'));
      return true;
    }

    // probably cvv
    if (input.attributes['maxlength']) {
      input.value = settings['vval'];
      input.dispatchEvent(new Event('change'));
      return true;
    }

    // otherwise its probably cc number
    input.value = settings['cnb'];
    input.dispatchEvent(new Event('change'));
  }
}

export function cleanup(inputs, settings) {
  const input = document.getElementById('order_billing_state');
  if (input) {
    input.value = settings['order_billing_state'];
  }
}
export function processFields(inputs, settings) {
  const successes = [];
  for (let i = 0; i < inputs.length; i += 1) {
    successes.push(processField(inputs[i], settings));
  }
  cleanup(inputs, settings);
  return successes.every(x => x === true);
}

