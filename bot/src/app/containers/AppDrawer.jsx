import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { List, ListItem, makeSelectable } from 'material-ui/List';
import Drawer from 'material-ui/Drawer';
import Subheader from 'material-ui/Subheader';
import ShopIcon from 'material-ui/svg-icons/action/shop';
import SettingsIcon from 'material-ui/svg-icons/action/add-shopping-cart';
import CartIcon from 'material-ui/svg-icons/action/settings';
import ShoppingCartIcon from 'material-ui/svg-icons/action/shopping-cart';
import AlarmIcon from 'material-ui/svg-icons/action/alarm';
import ListIcon from 'material-ui/svg-icons/action/view-list';
import AccountIcon from 'material-ui/svg-icons/action/account-circle';
import PaymentIcon from 'material-ui/svg-icons/action/payment';
import NewIcon from 'material-ui/svg-icons/av/new-releases';
import IncompleteIcon from 'material-ui/svg-icons/alert/error';
import Styles from '../constants/Styles';
import * as Menus from '../constants/Menus';
import version from '../version';

const SelectableList = makeSelectable(List);

function openUrlInNewTab(url) {
  const win = window.open(url, '_blank');
  win.focus();
}

function isIncomplete(settings, shopName) {
  const menus = Object.keys(Menus).map(x => Menus[x]).filter(x => x !== 'AutoCop' && x !== 'Products');
  return !settings[shopName] || menus.some(x => settings[shopName][x] === undefined);
}

function getIconForShop(settings, shopName) {
  if (isIncomplete(settings, shopName)) {
    return <IncompleteIcon />;
  }
  return <ShopIcon />;
}

class AppDrawer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      supremeMenuOpen: true,
    };
  }

  toggleSupremeMenu() {
    this.setState({
      supremeMenuOpen: !this.state.supremeMenuOpen,
    });
  }

  render() {
    const { location, currentProfile, settings, open } = this.props;
    const paths = location.pathname.split('/').filter(x => !!x);
    const currentPage = paths[0];
    const subPage = paths[1];
    const page = subPage ? `${currentPage}/${subPage}` : currentPage;
    return (
      <Drawer open={open}>
        <div style={Styles.logo} onClick={() => openUrlInNewTab('https://github.com/val92130/Supreme-Auto-Checkout')}>
          Supreme Auto Checkout
          <span> { version }</span>
        </div>
        <SelectableList value={page}>
          <Subheader>Shops</Subheader>
          <ListItem
            value="supreme"
            primaryText="Supreme"
            containerElement={<Link to={'/supreme/configuration'} />}
            leftIcon={getIconForShop(settings, 'Supreme')}
            open={this.state.supremeMenuOpen}
            onTouchTap={() => this.toggleSupremeMenu()}
            onNestedListToggle={() => this.toggleSupremeMenu()}
            nestedItems={[
              <ListItem
                key={1}
                containerElement={<Link to={'/supreme/configuration'} />}
                value="supreme/configuration"
                primaryText="Configuration"
                leftIcon={isIncomplete(settings, 'Supreme') ? <IncompleteIcon /> : <CartIcon />}
              />,
              <ListItem
                key={2}
                value="supreme/autocop"
                containerElement={<Link to={'/supreme/autocop'} />}
                primaryText="AutoCop"
                leftIcon={<SettingsIcon />}
              />,
              <ListItem
                key={3}
                value="supreme/products"
                containerElement={<Link to={'/supreme/products'} />}
                primaryText="Product listing"
                leftIcon={<ListIcon />}
              />,
              <ListItem
                key={4}
                value="supreme/drops"
                containerElement={<Link to={'/supreme/drops'} />}
                primaryText="Drops"
                leftIcon={<ShoppingCartIcon />}
              />,
              <ListItem
                key={5}
                value="supreme/restocks"
                containerElement={<Link to={'/supreme/restocks'} />}
                primaryText="Restocks"
                leftIcon={<AlarmIcon />}
              />,
            ]}
          />
          <Subheader>Other</Subheader>
          <ListItem
            value="profiles"
            primaryText={`Profiles (${currentProfile})`}
            containerElement={<Link to={'/profiles/'} />}
            leftIcon={<AccountIcon />}
          />
          <ListItem
            value="donation"
            primaryText="Donation"
            onTouchTap={() => openUrlInNewTab('https://www.paypal.me/vchatelain')}
            leftIcon={<PaymentIcon />}
          />
          <ListItem
            value="new"
            primaryText={<div style={{ color: 'red' }}>NEW! AIO Bot</div>}
            onTouchTap={() => openUrlInNewTab('https://rocketcop.io')}
            leftIcon={<NewIcon />}
          />
        </SelectableList>
      </Drawer>
    );
  }
}

AppDrawer.propTypes = {
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired,
  }),
  currentProfile: PropTypes.string,
  open: PropTypes.bool.isRequired,
};

function mapStateToProps(state) {
  const currentProfile = state.profiles.currentProfile;
  return {
    settings: state.profiles.profiles.filter(x => x.name === currentProfile)[0].settings,
    currentProfile,
  };
}

export default connect(mapStateToProps)(AppDrawer);
