import Fuse from 'fuse.js';

export default class KeywordsService {
  static findBestMatch(products, keywords, category) {
    const keys = Object.keys(products);
    const bestMatchingCategory = (new Fuse(keys, {})).search(category)[0];
    if (bestMatchingCategory === undefined) {
      return null;
    }
    const productsCategory = products[keys[bestMatchingCategory]];
    const fuse = new Fuse(productsCategory, { keys: ['name'] });
    const matches = fuse.search(keywords.join(' '));
    return matches[0];
  }
}
