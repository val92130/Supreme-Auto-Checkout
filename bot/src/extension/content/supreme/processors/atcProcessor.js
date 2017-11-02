import BaseProcessor from './baseProcessor';
import * as Helpers from '../helpers';
import FuzzyStringMatcher from '../../../../app/utils/FuzzyStringMatcher';
import AtcService from '../../../../services/supreme/AtcService';

export default class AtcProcessor extends BaseProcessor {
  static start(preferences, sizings, billing) {
    const processor = new AtcProcessor(preferences, sizings, billing);
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

  async handleRetry(atcId, maxRetry, currentRetryCount) {
    if (maxRetry === 'inf') {
      Helpers.timeout(() => window.location.reload(), 500, 'Product is not available, refreshing...', true);
      return;
    }
    if (!currentRetryCount && maxRetry > 0) {
      window.location.href = `${window.location.href}&atc-retry-count=1`;
      return;
    } else if (currentRetryCount < maxRetry) {
      setTimeout(() => {
        window.location.href = Helpers.updateQueryStringParameter(window.location.href, 'atc-retry-count', currentRetryCount + 1);
      }, 600);
      return;
    }
    const nextProduct = await AtcService.getNextEnabledAtcProduct(atcId);
    if (nextProduct) {
      window.location.href = AtcService.getAtcUrl(nextProduct, true);
    } else {
      window.location.href = this.preferences.autoCheckout ? '/checkout' : '/shop/cart';
    }
  }

  async processAtc() {
    const queryString = Helpers.getQueryStringValue('atc-id');
    const atcRetryCount = Math.abs(Number(Helpers.getQueryStringValue('atc-retry-count')));
    if (!queryString || isNaN(Number(queryString))) {
      return;
    }
    const atcId = Number(queryString);
    const atcProduct = await AtcService.getAtcProductById(atcId);
    if (!atcProduct) return;

    let match = null;
    const keywords = atcProduct.product.keywords;
    const kwColor = atcProduct.product.color;
    const innerArticles = AtcProcessor.findArticles();
    const fuse = new FuzzyStringMatcher(innerArticles, { key: 'name' });
    const bestMatches = fuse.search(keywords.join(' '));
    const maxRetryCount = atcProduct.product.retryCount;
    if (kwColor) {
      const fuseColor = new FuzzyStringMatcher(bestMatches, { key: 'color' });
      const matchesColor = fuseColor.search(kwColor);
      if (matchesColor.length) {
        match = matchesColor[0];
      }
    } else if (bestMatches) {
      match = bestMatches.find(x => !x.soldOut) || bestMatches[0];
    }
    const atcRunAll = Helpers.getQueryStringValue('atc-run-all');
    if (!match) {
      if (!isNaN(atcId) && atcRunAll) {
        return await this.handleRetry(atcId, maxRetryCount, atcRetryCount);
      }
      setTimeout(() => {
        window.location.reload();
      }, 600);
    } else if (match.soldOut) {
      if (!isNaN(atcId) && atcRunAll) {
        const soldOutAction = atcProduct.product.soldOutAction;
        return await this.handleRetry(atcId, soldOutAction, atcRetryCount);
      }
      setTimeout(() => {
        window.location.reload();
      }, 600);
    } else {
      if (atcRunAll) {
        match.url = `${match.url}?atc-run-all=true&atc-id=${atcId}`;
      } else {
        match.url = `${match.url}?atc-id=${atcId}`;
      }
      window.location.href = match.url;
    }
  }
}
