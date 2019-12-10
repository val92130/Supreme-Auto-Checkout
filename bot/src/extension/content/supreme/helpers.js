import { notify } from './notification';

/**
 * Helper timeout function to add a timer in the notification bar
 * @param  {Function} fn Function to be called after the delay
 * @param  {Number} ms Delay before calling the function
 * @param  {String} actionName Optional, an action name that will be displayed in the notification bar
*/
export function timeout(fn, ms, actionName, danger = false) {
  const now = new Date();
  let shouldAbort = false;
  const currentLocation = document.location.href;

  const interval = setInterval(() => {
    if (currentLocation !== document.location.href) {
      shouldAbort = true;
      clearInterval(interval);
      return;
    }
    const d = new Date();
    const diff = (d.getTime() - now.getTime());
    notify((actionName || 'Action') + ' in ' + ((ms - diff) / 1000), danger);
  }, 100);

  setTimeout(() => {
    clearInterval(interval);
    if (shouldAbort || currentLocation !== document.location.href) {
      return;
    }
    notify('Finished');
    fn();
  }, ms);
}

export function getQueryStringValue(key) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(key) || undefined;
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

export function isShopCategoryPage() {
  return hasStringInPath('shop') && hasStringInPath('all') && pathCount() === 3;
}

  /**
   * Check if the user is currently on a product page
   */
export function isProductPage() {
  return hasStringInPath('shop') && (pageHasNodeOfClass('styles')
    || pageHasNodeOfClass('price')
    || pageHasNodeOfClass('style'));
}

  /**
   * Check if the user is currently on the 'cart' page
   */
export function isCart() {
  return pageHasNodeOfClass('cart') && hasStringInPath('cart');
}

  /**
   * Check if the user is currently at the checkout page
   */
export function isCheckout() {
  return hasStringInPath('checkout');
}

export function getArticleName(articleNode) {
  const nameNode = articleNode.querySelector('h1') || articleNode.querySelector('a.nl') || articleNode.querySelector('a');
  return nameNode ? nameNode.innerText.toLowerCase().trim() : null;
}

export function getArticleColor(articleNode) {
  const colorNode = articleNode.querySelector('.sn') || articleNode.querySelector('.nl') || articleNode.querySelector('p .name-link');
  return colorNode ? colorNode.innerText.toLowerCase().trim() : null;
}

export function updateQueryStringParameter(uri, key, value) {
  const re = new RegExp(`([?&])${key}=.*?(&|$)`, 'i');
  const separator = uri.indexOf('?') !== -1 ? '&' : '?';
  if (uri.match(re)) {
    return uri.replace(re, `$1${key}=${value}$2`);
  }
  else {
    return `${uri + separator + key}=${value}`;
  }
}
