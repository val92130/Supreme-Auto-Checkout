import { expect } from 'chai';
import { describe, it } from 'mocha';
import FuzzyStringMatcher from '../src/app/utils/FuzzyStringMatcher';

describe('Keyword matcher tests', () => {
  it('should match correct keywords with Polartec', () => {
    const testData = ['Hooded Stripe Denim Zip Up Shirt', 'Polartec Pullover Shirt', '100 Dollar Bill Overalls'];
    const matcher = new FuzzyStringMatcher(testData);
    const result = matcher.search('polartec');
    expect(result).to.have.length(1);
    expect(testData[result[0]]).to.equal('Polartec Pullover Shirt');
  });

  it('should match with invalid keywords', () => {
    const testData = ['Hooded Stripe Denim Zip Up Shirt', 'Polartec Pullover Shirt', '100 Dollar Bill Overalls'];
    const matcher = new FuzzyStringMatcher(testData);
    const result = matcher.search('this doesnt exists polartec');
    expect(result).to.have.length(1);
  });

  it('should match multiple products with the same keywords', () => {
    const testData = ['Hooded Stripe Denim Zip Up Shirt', 'Polartec Pullover Shirt', '100 Dollar Bill Overalls'];
    const matcher = new FuzzyStringMatcher(testData);
    const result = matcher.search('shirt');
    expect(result).to.have.length(2);
  });

  it('shouldnt return a result with non matching keywords', () => {
    const testData = ['Hooded Stripe Denim Zip Up Shirt', 'Polartec Pullover Shirt', '100 Dollar Bill Overalls'];
    const matcher = new FuzzyStringMatcher(testData);
    const result = matcher.search('this doesnt exist');
    expect(result).to.have.length(0);
  });

  it('should match small mistakes in keywords', () => {
    const testData = ['Hooded Stripe Denim Zip Up Shirt', 'Polartec Pullover Shirt', '100 Dollar Bill Overalls'];
    const matcher = new FuzzyStringMatcher(testData);
    const result = matcher.search('polatec');
    expect(result).to.have.length(1);
    expect(testData[result[0]]).to.equal('Polartec Pullover Shirt');
  });

  it('should match the correct category with tops/sweaters', () => {
    const category = 'Tops/Sweaters';
    const categories = ['accessories', 't-shirts', 'pants', 'shorts', 'sweatshirts', 'tops-sweaters', 'shirts', 'jackets', 'shoes', 'skate', 'hats', 'bags'];
    const matcher = new FuzzyStringMatcher(categories);
    const result = matcher.search(category);
    expect(result).to.have.length(1);
    expect(categories[result[0]]).to.equal('tops-sweaters');
  });

  it('should work with a list of objects', () => {
    const data = [{ name: 'Tops/Sweaters' }, { name: 'accessories' }, { name: 'shirts' }];
    const matcher = new FuzzyStringMatcher(data, { key: 'name' });
    const result = matcher.search('tops_sweaters');
    expect(result).to.have.length(1);
    expect(result[0]).to.equal(data[0]);
  });

  it('should work with negative keywords', () => {
    const testData = ['Hooded Stripe Denim Zip Up Shirt', 'Polartec Pullover Shirt', '100 Dollar Bill Overalls', 'Hanes Boxer Briefs', 'Hanes Tagless Tees', 'Hanes Socks'];
    const matcher = new FuzzyStringMatcher(testData);
    const result = matcher.search('hanes !boxer !tee');
    expect(result).to.have.length(1);
    expect(testData[result[0]]).to.equal('Hanes Socks');
  });

  it('should return no result with negative keywords', () => {
    const testData = ['Hooded Stripe Denim Zip Up Shirt', 'Polartec Pullover Shirt', '100 Dollar Bill Overalls', 'Hanes Boxer Briefs', 'Hanes Tagless Tees', 'Hanes Socks'];
    const matcher = new FuzzyStringMatcher(testData);
    const result = matcher.search('hanes !boxer !tee !socks');
    expect(result).to.have.length(0);
  });
});
