import Fuse from 'fuse.js';

export default class FuzzyStringMatcher {
  constructor(arr, options = {}) {
    this.fuse = new Fuse(arr, Object.assign({
      tokenize: true,
    }, options));
  }

  search(str) {
    return this.fuse.search(str);
  }
}
