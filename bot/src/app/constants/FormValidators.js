export function email(input) {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(input) ? undefined : 'Please enter a valid email';
}

export function required(value) {
  return (value === '' || value === null || value === undefined) ? 'Required field' : undefined;
}

export function simpleText(value) {
  return value && !value.match(/^[0-9a-zA-Z_]{1,64}$/) ? 'Only use characters (a-z, A-Z, 0-9, _)' : undefined;
}

export function number(value) {
  return value && isNaN(Number(value)) ? 'This field must be a number' : undefined;
}

export function minValue(min) {
  return value => (value && value < min ? `The value must be greater than ${min}` : undefined);
}

export function maxValue(max) {
  return value => (value && value > max ? `The value must be less than ${max}` : undefined);
}
