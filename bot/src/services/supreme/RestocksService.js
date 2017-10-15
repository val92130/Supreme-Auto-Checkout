import request from 'browser-request';
import StorageService from '../StorageService';

export default class RestocksService {
  static async fetchCurrentStock() {
    const locale = await StorageService.getItem('locale') || 'eu';
    return new Promise((resolve, reject) => {
      const url = locale === 'us' ? 'https://api.openaio.com/us/stock' : 'https://api.openaio.com/stock';
      request({ url }, (error, response, body) => {
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
