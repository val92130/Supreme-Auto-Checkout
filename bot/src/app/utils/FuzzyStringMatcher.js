import string_score from 'string_score';

export default class FuzzyStringMatcher {
  constructor(arr, options = {}) {
    this.data = arr;
    this.key = options.key;
  }

  search(str) {
    const keywords = str.split(' ');
    const matches = [];
    for (let i = 0; i < this.data.length; i += 1) {
      const match = {
        name: this.key ? this.data[i][this.key] : this.data[i],
        obj: this.data[i],
        score: 0,
      };
      for (let j = 0; j < keywords.length; j += 1) {
        match.score += match.name.score(keywords[j], 0.1);
      }
      matches.push(match);
    }
    const bestMatches = matches.filter(x => x.score > 0.3).sort((a, b) => b.score - a.score);
    if (this.key) {
      return bestMatches.map(x => x.obj);
    }
    return bestMatches.map(x => this.data.indexOf(x.name));
  }
}
