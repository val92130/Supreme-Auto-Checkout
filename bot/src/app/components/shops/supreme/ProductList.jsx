import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Divider from 'material-ui/Divider';
import CircularProgress from 'material-ui/CircularProgress';
import { Card, CardMedia, CardText } from 'material-ui/Card';
import TextField from 'material-ui/TextField';
import Dialog from 'material-ui/Dialog';
import Layout from '../../../containers/Layout';
import addNotification from '../../../actions/notification';
import { addAtcProduct } from '../../../actions/atc';
import AtcCreateForm from './AtcCreateForm';
import FuzzyStringMatcher from '../../../utils/FuzzyStringMatcher';

class ProductList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedProduct: null,
      modalOpen: false,
      filter: '',
    };
  }

  handleSubmit(data) {
    this.props.addAtcProduct(data);
    this.handleRequestClose();
  }

  handleClickProduct(product) {
    if (this.props.onProductClick) {
      this.props.onProductClick(product);
      return;
    }
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
    return {
      name: product.name,
      keywords: product.keywords,
      category: product.category,
    };
  }

  getProductCard(product, onTouchTap) {
    const style = {
      width: 200,
      minWidth: 250,
      flex: 1,
      margin: 20,
    };

    const imgStyle = {};

    if (product.soldOut) {
      imgStyle.filter = 'grayscale(100%)';
    }

    return (
      <Card style={style} onTouchTap={onTouchTap}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '0.9em' }}>
            {product.name}
            {product.color && <p>{product.color}</p>}
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
    const products = this.props.products;
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
    let allProducts = [...products];
    if (this.state.filter) {
      const fuse = new FuzzyStringMatcher(allProducts, { key: 'name' });
      allProducts = fuse.search(this.state.filter);
    }
    allProducts = allProducts.sort((a, b) => a.soldOut - b.soldOut);
    const cards = allProducts.map(x => this.getProductCard(x, () => this.handleClickProduct(x)));
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
          {this.props.title || <p>Click on a product to add to AutoCop</p>}
        </div>
        <div style={{ textAlign: 'center' }}>
          <TextField
            hintText="filter..."
            floatingLabelText="Filter"
            onChange={(e, val) => this.setState({ filter: val })}
          />
        </div>
        <div style={style}>
          {cards}
        </div>
      </Layout>
    );
  }
}

ProductList.propTypes = {
  products: PropTypes.arrayOf(PropTypes.object),
  onProductClick: PropTypes.func,
  title: PropTypes.string,
};

function mapDispatchToProps(dispatch) {
  return {
    addAtcProduct: data => dispatch(addAtcProduct(data)),
    notify: msg => dispatch(addNotification(msg)),
  };
}

export default connect(undefined, mapDispatchToProps)(ProductList);
