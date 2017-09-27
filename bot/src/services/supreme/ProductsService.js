import request from 'browser-request';

export default class ProductsService {
  static fetchProducts() {
    return new Promise((resolve, reject) => {
      const time = (new Date()).getTime();
      request({ url: `http://www.supremenewyork.com/mobile_stock.json?_=${time}` }, (error, response, body) => {
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
      const url = `http://www.supremenewyork.com/shop/${id}.json`;
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
