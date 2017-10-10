import request from 'browser-request';

export default class RestocksService {
  static fetchCurrentStock() {
    return new Promise((resolve, reject) => {
      request({ url: 'http://localhost:8081/stock' }, (error, response, body) => {
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
