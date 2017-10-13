import BaseProcessor from './baseProcessor';
import * as Helpers from '../helpers';
import FuzzyStringMatcher from '../../../../app/utils/FuzzyStringMatcher';
import AtcService from '../../../../services/supreme/AtcService';


export default class CheckoutProcessor extends BaseProcessor {
  static start(preferences, sizings, billing) {
    const processor = new CheckoutProcessor(preferences, sizings, billing);
    processor.beginProcess();
    return processor;
  }

  beginProcess() {
    this.processAtc();
  }

  static findArticles() {
    let articles = document.querySelectorAll('.inner-article');
    if (!articles.length) {
      articles = document.querySelectorAll('.inner-item');
    }
    return [...articles].map(x => ({
      name: Helpers.getArticleName(x),
      color: Helpers.getArticleColor(x),
      soldOut: !!x.getElementsByClassName('sold_out_tag').length,
      url: x.querySelector('a').href,
    }));
  }

  async processAtc() {
    const queryString = Helpers.getQueryStringValue('atc-id');
    if (!queryString || isNaN(Number(queryString))) {
      return;
    }
    const atcId = Number(queryString);
    const atcProduct = await AtcService.getAtcProductById(atcId);
    if (!atcProduct) return;

    let match = null;
    const keywords = atcProduct.product.keywords;
    const kwColor = atcProduct.product.color;
    const innerArticles = CheckoutProcessor.findArticles().filter(x => !x.soldOut);
    const fuse = new FuzzyStringMatcher(innerArticles, { key: 'name' });
    const bestMatches = fuse.search(keywords.join(' '));
    if (kwColor) {
      const fuseColor = new FuzzyStringMatcher(bestMatches, { key: 'color' });
      const matchesColor = fuseColor.search(kwColor);
      if (matchesColor.length) {
        match = matchesColor[0];
      }
    } else if (bestMatches) {
      match = bestMatches[0];
    }
    const atcRunAll = Helpers.getQueryStringValue('atc-run-all');

    if (match && !match.soldOut) {
      if (atcRunAll) {
        match.url = `${match.url}?atc-run-all=true&atc-id=${atcId}`;
      }
      window.location.href = match.url;
    } else {
      if (!isNaN(atcId) && atcRunAll) {
        const nextProduct = await AtcService.getNextEnabledAtcProduct(atcId);
        if (nextProduct) {
          window.location.href = AtcService.getAtcUrl(nextProduct, true);
        } else {
          window.location.href = '/checkout';
        }
        return;
      }
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  }
}
