import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { List, ListItem, makeSelectable } from 'material-ui/List';
import Drawer from 'material-ui/Drawer';
import Subheader from 'material-ui/Subheader';
import CodeIcon from 'material-ui/svg-icons/action/code';
import ShopIcon from 'material-ui/svg-icons/action/shop';
import AccountIcon from 'material-ui/svg-icons/action/account-circle';
import IncompleteIcon from 'material-ui/svg-icons/alert/error';
import Styles from '../constants/Styles';
import { SHOP_NAME as SupremeShopName } from '../components/shops/Supreme';
import * as Menus from '../constants/Menus';

const SelectableList = makeSelectable(List);

function openUrlInNewTab(url) {
  const win = window.open(url, '_blank');
  win.focus();
}

function getIconForShop(settings, shopName) {
  const menus = Object.keys(Menus).map(x => Menus[x]);
  const isIncomplete = !settings[shopName] || menus.some(x => !settings[shopName][x]);
  if (isIncomplete) {
    return <IncompleteIcon />;
  }
  return <ShopIcon />;
}

class AppDrawer extends Component {

  render() {
    const { location, currentProfile, settings, open } = this.props;
    const paths = location.pathname.split('/').filter(x => !!x);
    const currentPage = paths[0];
    return (
      <Drawer open={open}>
        <div style={Styles.logo}>
          Supreme Auto Checkout
        </div>
        <SelectableList value={currentPage}>
          <Subheader>Shops</Subheader>
          <ListItem
            value="supreme"
            primaryText="Supreme"
            containerElement={<Link to={'/supreme/'} />}
            leftIcon={getIconForShop(settings, SupremeShopName)}
          />
          <Subheader>Settings</Subheader>
          <ListItem
            value="profiles"
            primaryText={`Profiles (${currentProfile})`}
            containerElement={<Link to={'/profiles/'} />}
            leftIcon={<AccountIcon />}
          />
          <Subheader>Other</Subheader>
          <ListItem
            value="about"
            primaryText="Github"
            onTouchTap={() => openUrlInNewTab('https://github.com/val92130/Supreme-Auto-Checkout')}
            leftIcon={<CodeIcon />}
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
