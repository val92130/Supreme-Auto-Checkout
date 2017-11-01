import React, { Component } from 'react';
import StorageService from '../../../../../services/StorageService';
import ChromeService from '../../../../../services/ChromeService';
import ProductList from '../ProductList';
import LocalChangeSelect from '../LocalChangeSelect';


export default class Products extends Component {
  constructor(props) {
    super(props);
    this.state = {
      products: [],
      filter: '',
      buyModalOpen: false,
      selectedProduct: null,
    };
    StorageService.getItem('stock').then((products) => {
      if (products) {
        this.setState({ products });
      }
    });
    ChromeService.addMessageListener('stockUpdated', (stock) => {
      this.setState({ products: stock.data });
    });
  }

  handleBuyProduct(product) {
    chrome.tabs.create({ url: product.url });
  }

  render() {
    return (
      <div>
        <ProductList
          products={this.state.products.map(x => Object.assign(x, {
          keywords: x.name.split(' ').filter(z => !!z),
          category: x.category === 'tops_sweaters' ? 'tops-sweaters' : x.category,
        }))}
          title={(
            <div>
              <LocalChangeSelect />
              <p>Click on a product to buy</p>
            </div>
            )
          }
          onProductClick={this.handleBuyProduct}
        />
      </div>

    );
  }
}
