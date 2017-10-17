import React, { Component } from 'react';
import DropsService from '../../../../../services/supreme/DropsService';
import ProductList from '../ProductList';

export default class DropProducts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      products: null,
    };

    DropsService.fetchProducts(props.params.slug).then(products => this.setState({ products }));
  }

  render() {
    return (
      <ProductList products={this.state.products} />
    );
  }
}
