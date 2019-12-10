import request from 'browser-request';

export default class ProductsService {
  static fetchProducts() {
    return new Promise((resolve, reject) => {
      const time = (new Date()).getTime();
      request({ url: `https://www.supremenewyork.com/mobile_stock.json?_=${time}` }, (error, response, body) => {
        if (!error && response.statusCode === 200) {
          try {
            const data = JSON.parse(body);
            resolve(data.products_and_categories);
          } catch (e) {
            console.error(e);
            reject(e);
          }
        } else {
          reject({ error });
        }
      });
    });
  }

  static fetchProductInfo(id) {
    return new Promise((resolve, reject) => {
      const time = (new Date()).getTime();
      const url = `https://www.supremenewyork.com/shop/${id}.json`;
      request({ url: `${url}?_=${time}` }, (error, response, body) => {
        if (!error && response.statusCode === 200) {
          try {
            const data = JSON.parse(body);
            resolve(Object.assign({ id }, data));
          } catch (e) {
            console.error(e);
            reject(e);
          }
        } else {
          reject({ error });
        }
      });
    });
  }
}

if (chrome && chrome.webRequest) {
  chrome.webRequest.onBeforeSendHeaders.addListener(
    function (details) {
      const userAgent = details.requestHeaders.filter(x => x.name === 'User-Agent')[0];
      if (userAgent) {
        userAgent.value = 'Mozilla/5.0 (iPhone; CPU iPhone OS 9_3_3 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Mobile/13G34';
      }
      return { requestHeaders: details.requestHeaders };
    },
    { urls: ['*://*.supremenewyork.com/mobile/*', '*://*.supremenewyork.com/mobile_stock.json*', '*://*.supremenewyork.com/shop/*.json'] },
    ['blocking', 'requestHeaders'],
  );
}
