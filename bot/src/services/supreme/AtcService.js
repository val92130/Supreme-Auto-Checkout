import KeywordsService from '../KeywordsService';
import StorageService from '../StorageService';
import ProductsService from './ProductsService';

export default class AtcService {
  static getAtcUrl(atcProduct, runAll = false) {
    const category = atcProduct.product.category === 'tops-sweaters' ? 'tops_sweaters' : atcProduct.product.category;
    let url = `https://www.supremenewyork.com/shop/all/${category}?atc-id=${atcProduct.id}`;
    if (runAll) {
      url = `${url}&atc-run-all=true`;
    }
    return url;
  }

  static async getAtcMonitorUrl(atcProduct, runAll = false) {
    const productList = await ProductsService.fetchProducts();
    if (!atcProduct || !productList) return null;

    const bestMatch = KeywordsService.findBestMatch(productList, atcProduct.product.keywords, atcProduct.product.category);
    const atcColor = atcProduct.product.color || 'any';
    if (bestMatch) {
      let url = `https://www.supremenewyork.com/shop/${bestMatch.id}?atc-color=${atcColor}&atc-id=${atcProduct.id}&atc-monitor=true`;
      if (runAll) {
        url = `${url}&atc-run-all=true`;
      }
      return url;
    }
    return null;
  }

  static async getNextAtcMonitorProduct(atcId) {
    const product = await this.getAtcProductById(atcId);
    const monitoredProducts = await ProductsService.fetchProducts();
    if (!monitoredProducts || !product) return null;

    let products = await this.getEnabledAtcProducts();
    products = products.sort((a, b) => a.id - b.id).filter(x => x.id > product.id && x.id !== product.id);
    for (let i = 0; i < products.length; i += 1) {
      const atcProduct = products[i];
      const bestMatch = KeywordsService.findBestMatch(monitoredProducts, atcProduct.product.keywords, atcProduct.product.category);
      if (bestMatch) {
        return atcProduct;
      }
    }
    return null;
  }

  static async openAtcTab(product, runAll = false) {
    if (!product) return false;
    const url = this.getAtcUrl(product, runAll);
    const win = window.open(url, '_blank');
    win.focus();
  }

  static async openAtcTabById(atcId, runAll = false) {
    const product = await this.getAtcProductById(atcId);
    return await this.openAtcTab(product, runAll);
  }

  static async openAtcTabMonitor(product, runAll = false) {
    const url = await this.getAtcMonitorUrl(product, runAll);
    if (!product || !url) return false;

    chrome.tabs.create({ url });
    return true;
  }

  static async openAtcTabMonitorById(productList, atcId) {
    const product = await this.getAtcProductById(atcId);
    return this.openAtcTabMonitor(productList, product);
  }

  static async runAll() {
    const productList = await this.getEnabledAtcProducts();
    const firstProduct = productList.sort((a, b) => a.id - b.id)[0];
    if (!firstProduct) return false;

    return await this.openAtcTab(firstProduct, true);
  }

  static async runAllMonitor() {
    const enabledAtcProducts = await this.getEnabledAtcProducts();
    const products = enabledAtcProducts.sort((a, b) => a.id - b.id);
    if (!enabledAtcProducts) return false;
    let found = false;
    for (let i = 0; i < products.length; i += 1) {
      const product = products[i];
      if (product && await this.openAtcTabMonitor(product, true)) {
        found = true;
        break;
      }
    }
    return found;
  }

  static async getAtcProductById(id) {
    const products = await this.getAtcProducts();
    return products.atcProducts.find(x => x.id === id);
  }

  static async getNextEnabledAtcProduct(atcId) {
    let products = await this.getEnabledAtcProducts();
    products = products.sort((a, b) => a.id - b.id);
    return products.find(x => x.id > atcId && x.id !== atcId);
  }

  static async getAtcProducts() {
    const state = await StorageService.loadSavedState();
    if (state && state.atc) {
      return state.atc;
    }
    return null;
  }

  static async getEnabledAtcProducts() {
    const products = await this.getAtcProducts();
    return products.atcProducts.filter(x => x.product.enabled);
  }
}
