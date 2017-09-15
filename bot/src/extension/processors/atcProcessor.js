import BaseProcessor from './baseProcessor';
import * as Helpers from '../helpers';


export default class CheckoutProcessor extends BaseProcessor {
  static start(preferences, sizings, billing) {
    const processor = new CheckoutProcessor(preferences, sizings, billing);
    processor.beginProcess();
    return processor;
  }

  beginProcess() {
    this.processAtc();
  }

  processAtc() {
    const queryString = Helpers.getQueryStringValue('atc-kw');
    if (!queryString) {
      return;
    }
    const keywords = queryString.split(';');
    const kwColor = Helpers.getQueryStringValue('atc-color');
    const innerArticles = Helpers.findArticles();
    const products = [];
    for (let i = 0; i < innerArticles.length; i += 1) {
      const name = Helpers.getArticleName(innerArticles[i]);
      const a = innerArticles[i].querySelector('a');
      const color = Helpers.getArticleColor(innerArticles[i]);
      const soldOut = innerArticles[i].getElementsByClassName('sold_out_tag');
      if (soldOut.length) {
        continue;
      }
      if (name && a.href) {
        const product = {
          matches: 0,
          url: a.href,
        };
        for (let j = 0; j < keywords.length; j += 1) {
          const keyword = keywords[j].toLowerCase().trim();
          const regexp = new RegExp(keyword);
          // name matches
          if (regexp.test(name)) {
            if (kwColor && color) {
              const regexColor = new RegExp(color);
              if (regexColor.test(kwColor.toLowerCase().trim())) {
                product.matches += 1;
              }
            }
            product.matches += 1;
          }
        }

        products.push(product);
      }
    }
    const bestMatch = products.filter(x => x.matches > 0).sort((a, b) => b.matches - a.matches)[0];
    if (bestMatch) {
      window.location.href = bestMatch.url;
    } else {
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  }
}
