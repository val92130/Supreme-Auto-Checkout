import request from 'browser-request';

export default class DropsService {
  static fetchDrops() {
    return new Promise((resolve, reject) => {
      request({ url: 'https://api.stormcop.cz/drops' }, (error, response, body) => {
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

  static async fetchLatestDrop() {
    const drops = await DropsService.fetchDrops();
    return drops.find(x => x.slug === 'latest');
  }

  static async fetchLatestDropProducts() {
    const drop = await DropsService.fetchLatestDrop();
    if (!drop) return [];
    return await DropsService.fetchProducts(drop.slug);
  }

  static fetchProducts(dropSlug) {
    return new Promise((resolve, reject) => {
      request({ url: `https://api.stormcop.cz/drops/${dropSlug}` }, (error, response, body) => {
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
