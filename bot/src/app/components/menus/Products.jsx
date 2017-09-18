import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import Divider from 'material-ui/Divider';
import CircularProgress from 'material-ui/CircularProgress';
import { Card, CardActions, CardMedia, CardText } from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import Dialog from 'material-ui/Dialog';
import { fetchProductInfo } from '../../utils/SupremeUtils';
import * as StorageManager from '../../utils/StorageManager';

async function getProducts() {
  return await StorageManager.getItem('products') || {};
}

class Products extends Component {
  constructor(props) {
    super(props);
    const interval = setInterval(async () => {
      const products = await getProducts();
      this.setState({
        products,
      });
    }, 1500);
    this.state = {
      products: {},
      filter: '',
      interval,
      buyModalOpen: false,
      selectedProduct: null,
    };
  }

  onChange(value) {
    this.setState({
      filter: value,
    });
  }

  handleClickBuyNow(product) {
    fetchProductInfo(product.id)
    .then(prod => {
      this.setState({
        buyModalOpen: true,
        selectedProduct: prod,
      });
    });
  }

  handleBuyItem(productId, styleId) {
    chrome.tabs.create({ url: `http://supremenewyork.com/shop/${productId}?atc-style-id=${styleId}` });
  }

  handleRequestClose() {
    this.setState({
      buyModalOpen: false,
    });
  }

  componentWillUnmount() {
    clearInterval(this.state.interval);
  }

  getProductCard(product, onTouchTap, soldOut) {
    const style = {
      width: 200,
      minWidth: 250,
      flex: 1,
      margin: 20,
    };

    const imgStyle = {
      width: 81,
      height: 81,
      maxWidth: 81,
      minWidth: 81,
    }

    return (
      <Card style={style} onTouchTap={onTouchTap}>
        <div style={{ textAlign: 'center' }}>
          <h4>
            {product.name}
          </h4>
          <CardMedia>
            <img style={imgStyle} src={product.image_url_hi.replace('//', 'https://')} alt={product.name} />
          </CardMedia>
          <CardText>
            {product.price && <p>Price: {product.price}</p>}
          </CardText>
          { soldOut && <p>SOLD OUT</p> }
        </div>
        <Divider />
      </Card>
    );
  }

  render() {
    const actions = [
      <FlatButton
        label="Cancel"
        primary
        onClick={() => this.handleRequestClose()}
      />,
    ];
    const categories = Object.keys(this.state.products);
    let allProducts = [];
    for (let i = 0; i < categories.length; i += 1) {
      const products = this.state.products[categories[i]];
      for (let j = 0; j < products.length; j += 1) {
        allProducts.push(products[j]);
      }
    }
    allProducts = allProducts.filter(x => x.name.toLowerCase().indexOf(this.state.filter.toLowerCase()) !== -1);
    const cards = allProducts.map(x => this.getProductCard(x, () => this.handleClickBuyNow(x)));
    const style = {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-evenly',
      flexWrap: 'wrap',
      cursor: 'pointer',
    };
    if (!cards.length && !this.state.filter) {
      return (
        <div style={{ textAlign: 'center' }}>
          <p>Loading...</p>
          <CircularProgress />
        </div>
      )
    }
    return (
      <div>
        <Dialog
          title="Buy now"
          actions={actions}
          onRequestClose={() => this.handleRequestClose()}
          open={this.state.buyModalOpen}
          autoScrollBodyContent
        >
          {
            (() => {
              if (this.state.selectedProduct) {
                const product = this.state.selectedProduct;
                const productCards = product.styles.map(x => {
                  const soldOut = !x.sizes.some(s => s.stock_level >= 1);
                  return this.getProductCard(x, soldOut ? null : () => this.handleBuyItem(product.id, x.id), soldOut);
                })
                return (
                  <div style={style}>
                    {productCards}
                  </div>
                );
              }
              return (<div>loading...</div>);
            })()
          }
        </Dialog>
        <div style={{ textAlign: 'center' }}>
          <TextField
            hintText="filter..."
            floatingLabelText="Filter"
            onChange={(e, val) => this.onChange(val)}
            style={{ width: 512 }}
          />
        </div>
        <div style={style}>
          {cards}
        </div>
      </div>
    );
  }
}
Products.propTypes = {
  shop: PropTypes.string.isRequired,
};

function mapStateToProps(state, ownProps) {
  return {

  };
}

export default connect(mapStateToProps)(Products);
