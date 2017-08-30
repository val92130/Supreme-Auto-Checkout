export function isObjectEmpty(obj) {
  return Object.keys(obj).length === 0 && obj.constructor === Object;
}

export function getQueryStringValue(key) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(key);
}

export function pageHasNodeOfClass(className) {
  return document.getElementsByClassName(className).length > 0;
}

export function hasStringInPath(value) {
  return location.pathname.substring(1).split('/').filter(x => !!x && x === value).length > 0;
}

export function pathCount() {
  return location.pathname.substring(1).split('/').length;
}

export function setTimeForToday(time) {
  const d = new Date();
  const split = time.split(':');
  if (!split.length || split.length > 3) {
    return null;
  }
  const hour = +split[0];
  const minute = +split[1];
  const seconds = +split[2];
  if (isNaN(hour) || hour > 24) {
    return null;
  }

  if (isNaN(minute) || minute > 60 || (hour === 24 && minute > 0)) {
    return null;
  }

  if (isNaN(seconds) || seconds > 60) {
    return null;
  }
  if (hour < 0 || minute < 0 || seconds < 0) return null;
  d.setHours(hour);
  d.setMinutes(minute);
  d.setSeconds(seconds);
  return d;
}
