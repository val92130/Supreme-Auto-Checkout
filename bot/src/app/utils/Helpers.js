import moment from 'moment';

export function isObjectEmpty(obj) {
  return Object.keys(obj).length === 0 && obj.constructor === Object;
}

export function openAtcTab(category, keywords, color) {
  let url = `http://supremenewyork.com/shop/all/${category}?atc-kw=${keywords.join(';')}`;
  if (color) {
    url = `${url}&atc-color=${color}`;
  }
  const win = window.open(url, '_blank');
  win.focus();
}

export function timeToDate(time) {
  const d = moment(time, 'hh:mm:ss');
  if (!d.isValid()) {
    return null;
  }
  return d.toDate();
}

export function isValidTime(time) {
  return timeToDate(time) !== null;
}

export function sameDay(d1, d2) {
  return d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate();
}
