import BaseProcessor from './baseProcessor';
import * as Helpers from '../helpers';
import FuzzyStringMatcher from '../../../../app/utils/FuzzyStringMatcher';


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

  processAtc() {
    const queryString = Helpers.getQueryStringValue('atc-kw');
    if (!queryString) {
      return;
    }
    let match = null;
    const keywords = queryString.split(';');
    const kwColor = Helpers.getQueryStringValue('atc-color');
    const innerArticles = CheckoutProcessor.findArticles().filter(x => !x.soldOut);
    const fuse = new FuzzyStringMatcher(innerArticles, { keys: ['name'] });
    const bestMatches = fuse.search(keywords.join(' '));
    if (kwColor) {
      const fuseColor = new FuzzyStringMatcher(bestMatches, { keys: ['color'] });
      const matchesColor = fuseColor.search(kwColor);
      if (matchesColor.length) {
        match = matchesColor[0];
      }
    } else if (bestMatches) {
      match = bestMatches[0];
    }

    if (match && !match.soldOut) {
      window.location.href = match.url;
    } else {
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  }
}
