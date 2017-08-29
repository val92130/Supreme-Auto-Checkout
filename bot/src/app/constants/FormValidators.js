export function email(input) {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(input) ? undefined : 'Please enter a valid email';
}

export function required(value) {
  const empty = typeof value !== 'number' && !value;
  return empty ? 'Required field' : undefined;
}

export function simpleText(value) {
  return value && !value.match(/^[0-9a-zA-Z_]{1,64}$/) ? 'Only use characters (a-z, A-Z, 0-9, _)' : undefined;
}

export function number(value) {
  return value && (isNaN(Number(value)) || +value < 0) ? 'This field must be a positive number' : undefined;
}

export function minValue(min) {
  return value => (value && value < min ? `The value must be greater than ${min}` : undefined);
}

export function maxValue(max) {
  return value => (value && value > max ? `The value must be less than ${max}` : undefined);
}

export function fullName(value) {
  return !value || value.split(' ').filter(x => x !== "").length < 2 ? 'Please enter a valid full name (firstname + lastname)' : undefined;
}

export function unique(candidates) {
  return value => {
    if (candidates.indexOf(value) !== -1) {
      return 'This value already exists and must be unique';
    }
    return undefined;
  };
}

export function date(val) {
  const d = new Date(val);
  return isNaN(d.getTime()) ? 'Required date' : undefined;
}

export function time24(val) {
  const msg = 'Invalid time';
  if (!val) {
    return msg;
  }
  const split = val.split(':');
  if (!split.length || split.length > 2) {
    return msg;
  }
  const hour = +split[0];
  const minute = +split[1];
  if (isNaN(hour) || hour > 24) {
    return msg;
  }

  if (isNaN(minute) || minute > 60 || (hour === 24 && minute > 0)) {
    return msg;
  }
  if (hour < 0 || minute < 0) return msg;
}
