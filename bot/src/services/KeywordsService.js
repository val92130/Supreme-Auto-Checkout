export default class KeywordsService {
  static findBestMatch(products, keywords, category) {
    const matches = [];
    const keys = Object.keys(products);
    const productsCategory = products[keys.filter(x => x.toLowerCase() === category.toLowerCase())[0]];
    if (!productsCategory) {
      return null;
    }
    for (let i = 0; i < productsCategory.length; i += 1) {
      const name = productsCategory[i].name.toLowerCase().trim() ;
      if (name) {
        const product = {
          matches: 0,
          value: productsCategory[i],
        };
        for (let j = 0; j < keywords.length; j += 1) {
          const keyword = keywords[j].toLowerCase().trim();
          const regexp = new RegExp(keyword);
          // name matches
          if (regexp.test(name)) {
            product.matches += 1;
          }
        }

        matches.push(product);
      }
    }
    const bestMatch = matches.filter(x => x.matches > 0).sort((a, b) => b.matches - a.matches)[0];
    if (bestMatch && bestMatch.matches > 0) return bestMatch.value;
    return null;
  }
}
