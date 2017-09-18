import moment from 'moment';
import { findBestMatch } from '../../extension/helpers';

export function isObjectEmpty(obj) {
  return Object.keys(obj).length === 0 && obj.constructor === Object;
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
