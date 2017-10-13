import KeywordsService from '../KeywordsService';
import StorageService from '../StorageService';

export default class AtcService {
  static async openAtcTabById(atcId) {
    const product = await this.getAtcProductById(atcId);
    if (!product) return false;
    const category = product.product.category === 'tops-sweaters' ? 'tops_sweaters' : product.product.category;
    const url = `http://supremenewyork.com/shop/all/${category}?atc-id=${atcId}`;
    const win = window.open(url, '_blank');
    win.focus();
  }

  static async openAtcTabMonitorById(productList, atcId) {
    const product = await this.getAtcProductById(atcId);
    if (!product) return false;

    const bestMatch = KeywordsService.findBestMatch(productList, product.product.keywords, product.product.category);
    const atcColor = product.product.color || 'any';
    if (bestMatch) {
      chrome.tabs.create({ url: `http://supremenewyork.com/shop/${bestMatch.id}?atc-color=${atcColor}` });
      return true;
    }
    return false;
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
