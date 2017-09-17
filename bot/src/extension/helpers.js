import { notify } from './notification';

/**
 * Helper timeout function to add a timer in the notification bar
 * @param  {Function} fn Function to be called after the delay
 * @param  {Number} ms Delay before calling the function
 * @param  {String} actionName Optional, an action name that will be displayed in the notification bar
*/
export function timeout(fn, ms, actionName) {
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
    notify((actionName || 'Action') + ' in : ' + ((ms - diff) / 1000));
  }, 100);

  setTimeout(() => {
    clearInterval(interval);
    if (shouldAbort || currentLocation !== document.location.href) {
      return;
    }
    notify('Done');
    fn();
  }, ms);
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


export function findArticles() {
  let articles = document.querySelectorAll('.inner-article');
  if (!articles.length) {
    articles = document.querySelectorAll('.inner-item');
  }
  return [...articles];
}

export function getArticleName(articleNode) {
  const nameNode = articleNode.querySelector('h1') || articleNode.querySelector('a.nl') || articleNode.querySelector('a');
  return nameNode ? nameNode.innerText.toLowerCase().trim() : null;
}

export function getArticleColor(articleNode) {
  const colorNode = articleNode.querySelector('.sn') || articleNode.querySelector('.nl') || articleNode.querySelector('p .name-link');
  return colorNode ? colorNode.innerText.toLowerCase().trim() : null;
}

export function findBestMatch(products, keywords, category) {
  const matches = [];
  const keys = Object.keys(products);
  const productsCategory = products[keys.filter(x => x.toLowerCase() === category)[0]];
  if (!productsCategory) {
    return null;
  }
  for (let i = 0; i < productsCategory.length; i += 1) {
    const name = productsCategory[i].name.toLowerCase().trim() ;
    if (name) {
      const product = {
        matches: 0,
        value: productsCategory[i],
      };
      for (let j = 0; j < keywords.length; j += 1) {
        const keyword = keywords[j].toLowerCase().trim();
        const regexp = new RegExp(keyword);
        // name matches
        if (regexp.test(name)) {
          product.matches += 1;
        }
      }

      matches.push(product);
    }
  }
  const bestMatch = matches.filter(x => x.matches > 0).sort((a, b) => b.matches - a.matches)[0];
  if (bestMatch && bestMatch.matches > 0) return bestMatch.value;
  return null;
}
