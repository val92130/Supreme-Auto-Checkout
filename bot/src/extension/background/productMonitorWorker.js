import request from 'browser-request';
import * as StorageManager from '../../app/utils/StorageManager';
import { fetchProducts } from '../../app/utils/SupremeUtils';


export default class ProductWatcher {
  constructor() {
    this.products = {};
    this.lastUpdate = new Date();
    this.interval = null;
  }

  async start() {
    const products = await this.updateProducts(true);
    this.interval = setInterval(() => this.updateProducts(true), 1500);
    console.log(products);
  }

  stop() {
    clearInterval(this.interval);
  }

  async updateProducts(force = false) {
    const now = new Date();
    const diff = (now.getTime() - this.lastUpdate.getTime()) / 1000;

    if (diff >= 10 || !Object.keys(this.products).length || force) {
      this.lastUpdate = now;
      try {
        this.products = await fetchProducts();
      } catch (e) {
        return e;
      }
    }
    StorageManager.setItem('products', this.products);
    return this.products;
  }

  getProducts() {
    return this.products;
  }
}

chrome.webRequest.onBeforeSendHeaders.addListener(
  function (details) {
    const userAgent = details.requestHeaders.filter(x => x.name === 'User-Agent')[0];
    if (userAgent) {
      userAgent.value = 'Mozilla/5.0 (iPhone; CPU iPhone OS 9_3_3 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Mobile/13G34';
    }
    return { requestHeaders: details.requestHeaders };
  },
  { urls: ['*://*.supremenewyork.com/mobile/*', '*://*.supremenewyork.com/mobile_stock.json*', 'http://www.supremenewyork.com/shop/*.json'] },
  ['blocking', 'requestHeaders'],
);
