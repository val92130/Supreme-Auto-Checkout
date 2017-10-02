import FuzzyStringMatcher from '../app/utils/FuzzyStringMatcher';

export default class KeywordsService {
  static findBestMatch(products, keywords, category) {
    const keys = Object.keys(products);
    const bestMatchingCategory = (new FuzzyStringMatcher(keys)).search(category)[0];
    if (bestMatchingCategory === undefined) {
      return null;
    }
    const productsCategory = products[keys[bestMatchingCategory]];
    const fuse = new FuzzyStringMatcher(productsCategory, { key: 'name' });
    const matches = fuse.search(keywords.join(' '));
    return matches[0];
  }
}
