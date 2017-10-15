import string_score from 'string_score';

export default class FuzzyStringMatcher {
  constructor(arr, options = {}) {
    this.data = arr;
    this.key = options.key;
  }

  search(str) {
    const keywords = str.split(' ').filter(x => !!x);
    const matches = [];
    for (let i = 0; i < this.data.length; i += 1) {
      const match = {
        name: this.key ? this.data[i][this.key] : this.data[i],
        obj: this.data[i],
        matches: 0,
        valid: true,
      };
      for (let j = 0; j < keywords.length; j += 1) {
        let keyword = keywords[j].toLowerCase().trim();
        const isNegative = keyword[0] === '!';
        if (isNegative) {
          keyword = keyword.substr(1);
        }
        const regexp = new RegExp(keyword);
        const productName = match.name.toLowerCase().trim();
        const splitted = productName.split(' ').filter(x => !!x);

        if (regexp.test(productName)) {
          match.matches += 1;
          if (isNegative) {
            match.valid = false;
          }
        }
        for (let k = 0; k < splitted.length; k += 1) {
          if (splitted[k].score(keyword, 0.1) >= 0.5) {
            match.matches += 1;
            if (isNegative) {
              match.valid = false;
            }
          }
        }
      }
      matches.push(match);
    }
    const bestMatches = matches.filter(x => x.matches >= 1 && x.valid).sort((a, b) => b.matches - a.matches);
    if (this.key) {
      return bestMatches.map(x => x.obj);
    }
    return bestMatches.map(x => this.data.indexOf(x.name));
  }
}
