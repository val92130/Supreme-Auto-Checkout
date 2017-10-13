import React, { Component } from 'react';
import { connect } from 'react-redux';
import Divider from 'material-ui/Divider';
import CircularProgress from 'material-ui/CircularProgress';
import { Card, CardMedia, CardText } from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import Layout from '../../../../containers/Layout';
import DropsService from '../../../../../services/supreme/DropsService';
import FuzzyStringMatcher from '../../../../utils/FuzzyStringMatcher';
import addNotification from '../../../../actions/notification';
import { addAtcProduct } from '../../../../actions/atc';
import AtcCreateForm from '../AtcCreateForm';
import { categories } from '../../../../constants/Utils';

class DropProducts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      products: null,
      selectedProduct: null,
      modalOpen: false,
    };

    DropsService.fetchProducts(props.params.slug).then(products => this.setState({ products }));
  }

  handleSubmit(data) {
    this.props.addAtcProduct(data);
    this.handleRequestClose();
  }

  handleClickProduct(product) {
    this.setState({
      modalOpen: true,
      selectedProduct: product,
    });
  }

  handleRequestClose() {
    this.setState({
      modalOpen: false,
      selectedProduct: null,
    });
  }

  productToAtc(product) {
    if (!product) return {};
    const matcher = new FuzzyStringMatcher(categories);
    const category = matcher.search(product.category)[0];
    return {
      name: product.name,
      keywords: product.keywords,
      category
    };
  }

  getProductCard(product, onTouchTap) {
    const style = {
      width: 200,
      minWidth: 250,
      flex: 1,
      margin: 20
    };

    const imgStyle = {
    };

    return (
      <Card style={style} onTouchTap={onTouchTap}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '0.9em' }}>
            {product.name}
          </p>
          <CardMedia>
            <img style={imgStyle} src={product.imageUrl} alt={product.name} />
          </CardMedia>
          <CardText>
            {product.price && <p>Est price: {product.price}</p>}
          </CardText>
        </div>
        <Divider />
      </Card>
    );
  }

  render() {
    const products = this.state.products;
    if (!products) {
      return (
        <Layout>
          <div style={{ textAlign: 'center' }}>
            <p>Loading...</p>
            <CircularProgress />
          </div>
        </Layout>
      );
    }
    const cards = products.map(x => this.getProductCard(x, () => this.handleClickProduct(x)));
    const style = {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-evenly',
      flexWrap: 'wrap',
      cursor: 'pointer',
    };
    return (
      <Layout>
        <Dialog
          title="Buy now"
          onRequestClose={() => this.handleRequestClose()}
          open={this.state.modalOpen}
          autoScrollBodyContent
        >
          <AtcCreateForm onRequestClose={() => this.handleRequestClose()} onSubmit={data => this.handleSubmit(data)} initialValues={this.productToAtc(this.state.selectedProduct)} />
        </Dialog>
        <div style={{ textAlign: 'center' }}>
          <p>Click on a product to add to AutoCop</p>
        </div>
        <div style={style}>
          {cards}
        </div>
      </Layout>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    addAtcProduct: data => dispatch(addAtcProduct(data)),
    notify: msg => dispatch(addNotification(msg)),
  };
}

export default connect(undefined, mapDispatchToProps)(DropProducts);
