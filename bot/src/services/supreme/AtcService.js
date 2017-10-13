import KeywordsService from '../KeywordsService';
import StorageService from '../StorageService';

export default class AtcService {
  static openAtcTab(category, keywords, color) {
    if (category === 'tops-sweaters') {
      category = 'tops_sweaters';
    }
    let url = `http://supremenewyork.com/shop/all/${category}?atc-kw=${keywords.join(';')}`;
    if (color) {
      url = `${url}&atc-color=${color}`;
    }
    const win = window.open(url, '_blank');
    win.focus();
  }

  static openAtcTabMonitor(monitorProducts, category, keywords, color) {
    const bestMatch = KeywordsService.findBestMatch(monitorProducts, keywords, category);
    const atcColor = color || 'any';
    if (bestMatch) {
      chrome.tabs.create({ url: `http://supremenewyork.com/shop/${bestMatch.id}?atc-color=${atcColor}` });
      return true;
    }
    return false;
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
    return products.atcProducts.filter(x => x.product.enabled)
  }
}
