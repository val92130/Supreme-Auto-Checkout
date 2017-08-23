export function isObjectEmpty(obj) {
  return Object.keys(obj).length === 0 && obj.constructor === Object;
}

export function getQueryStringValue(key) {
  return decodeURIComponent(window.location.search.replace(new RegExp("^(?:.*[&\\?]" + encodeURIComponent(key).replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));
}

export function pageHasNodeOfClass(className) {
  return document.querySelectorAll('.' + className).length > 0;
}

export function hasStringInPath(value) {
  return location.pathname.substring(1).split('/').filter(x => !!x && x === value).length > 0;
}
