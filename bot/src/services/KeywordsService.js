import FuzzyStringMatcher from '../app/utils/FuzzyStringMatcher';

export default class KeywordsService {
  static findBestMatch(products, keywords, category) {
    return KeywordsService.findMatches(products, keywords, category)[0];
  }

  static findMatches(products, keywords, category) {
    const keys = Object.keys(products);
    const bestMatchingCategory = (new FuzzyStringMatcher(keys)).search(category)[0];
    if (bestMatchingCategory === undefined) {
      return [];
    }
    const productsCategory = products[keys[bestMatchingCategory]];
    const fuse = new FuzzyStringMatcher(productsCategory, { key: 'name' });
    return fuse.search(keywords.join(' '));
  }
}
