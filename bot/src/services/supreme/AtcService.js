import KeywordsService from '../KeywordsService';
import StorageService from '../StorageService';

export default class AtcService {
  static getAtcUrl(atcProduct, runAll = false) {
    const category = atcProduct.product.category === 'tops-sweaters' ? 'tops_sweaters' : atcProduct.product.category;
    let url = `http://supremenewyork.com/shop/all/${category}?atc-id=${atcProduct.id}`;
    if (runAll) {
      url = url + '&atc-run-all=true';
    }
    return url;
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

  static async openAtcTabMonitor(productList, product) {
    if (!product) return false;

    const bestMatch = KeywordsService.findBestMatch(productList, product.product.keywords, product.product.category);
    const atcColor = product.product.color || 'any';
    if (bestMatch) {
      chrome.tabs.create({ url: `http://supremenewyork.com/shop/${bestMatch.id}?atc-color=${atcColor}` });
      return true;
    }
    return false;
  }

  static async openAtcTabMonitorById(productList, atcId) {
    const product = await this.getAtcProductById(atcId);
    return this.openAtcTabMonitor(productList, product);
  }

  static async runAll() {
    const productList = await this.getEnabledAtcProducts();
    const firstProduct = productList.sort((a, b) => a.id - b.id)[0];
    if (!firstProduct) return false;

    await this.openAtcTab(firstProduct, true);
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
