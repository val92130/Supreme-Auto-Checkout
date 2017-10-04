import request from 'browser-request';

export default class DropsService {
  static fetchDrops() {
    return new Promise((resolve, reject) => {
      request({ url: 'https://api.openaio.com/drops/' }, (error, response, body) => {
        if (!error && response.statusCode === 200) {
          try {
            resolve(JSON.parse(body));
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

  static fetchProducts(dropSlug) {
    return new Promise((resolve, reject) => {
      request({ url: `https://api.openaio.com/drops/${dropSlug}/products/` }, (error, response, body) => {
        if (!error && response.statusCode === 200) {
          try {
            resolve(JSON.parse(body));
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
