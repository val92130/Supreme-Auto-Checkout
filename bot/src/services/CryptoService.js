import CryptoJs from 'crypto-js';

export default class CryptoService {
  static encrypt(message, passphrase) {
    return CryptoJs.AES.encrypt(message, passphrase);
  }

  static decrypt(message, password) {
    return CryptoJs.AES.decrypt(message, password).toString(CryptoJs.enc.Utf8);
  }
}
