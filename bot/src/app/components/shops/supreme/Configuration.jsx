import React, { Component } from 'react';
import Tab from 'material-ui/Tabs/Tab';
import { connect } from 'react-redux';
import FontIcon from 'material-ui/FontIcon';
import * as menus from '../../../constants/Menus';
import Billing from './pages/Billing';
import Options from './pages/Options';
import Sizes from './pages/Sizes';
import Layout from '../../../containers/Layout';
import { changeMenu } from '../../../actions/menu';
import { updateProfileSettings } from '../../../actions/profiles';
import * as Styles from '../../../constants/Styles';

const SHOP_NAME = 'Supreme';

class Supreme extends Component {
  getContainerForMenu(menu) {
    switch (menu) {
      case menus.MENU_BILLING:
        return (<Billing onSubmit={data => this.onSubmit(menu, data)} shop={SHOP_NAME} />);
      case menus.MENU_OPTIONS:
        return (<Options onSubmit={data => this.onSubmit(menu, data)} shop={SHOP_NAME} />);
      case menus.MENU_SIZES:
        return (<Sizes onSubmit={data => this.onSubmit(menu, data)} shop={SHOP_NAME} />);
      default:
        return null;
    }
  }

  strToNumberReducer(menu, key, value) {
    // Don't process values for billing
    if (typeof value === 'string' && !isNaN(value) && menu !== menus.MENU_BILLING) {
      return +(value);
    }
    if (value instanceof Date) {
      return value.toString();
    }
    return value;
  }

  transform(menu, obj, reducer) {
    const keys = Object.keys(obj);
    const newObj = {};
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      const value = obj[key];
      newObj[key] = reducer(menu, key, value);
    }
    return newObj;
  }

  onSubmit(menu, data) {
    const newObj = this.transform(menu, data, this.strToNumberReducer);
    this.props.updateSettings(this.props.currentProfile, SHOP_NAME, menu, newObj);
  }

  componentWillMount() {
    if (this.props.menu === null) {
      this.props.changeMenu(Supreme.getDefaultMenu());
    }
  }

  getIconForTabMenu(menu) {
    const isIncomplete = (!this.props.settings[SHOP_NAME] || !this.props.settings[SHOP_NAME][menu]);
    return (<FontIcon className="material-icons" >{isIncomplete ? 'error' : 'done'}</FontIcon>);
  }

  static getDefaultMenu() {
    return menus.MENU_BILLING;
  }

  getTabs() {
    return [
      <Tab
        style={Styles.tab}
        label="Billing"
        key={1}
        icon={this.getIconForTabMenu(menus.MENU_BILLING)}
        value={menus.MENU_BILLING}
        onClick={() => this.props.changeMenu(menus.MENU_BILLING)}
      />,
      <Tab
        label="Options"
        key={2}
        icon={this.getIconForTabMenu(menus.MENU_OPTIONS)}
        value={menus.MENU_OPTIONS}
        onClick={() => this.props.changeMenu(menus.MENU_OPTIONS)}
      />,
      <Tab
        label="Sizes"
        key={3}
        icon={this.getIconForTabMenu(menus.MENU_SIZES)}
        value={menus.MENU_SIZES}
        onClick={() => this.props.changeMenu(menus.MENU_SIZES)}
      />,
    ];
  }

  render() {
    const { menu } = this.props;
    return (
      <Layout title={menu || 'Loading...'} tabs={this.getTabs()} currentTab={menu || menus.MENU_BILLING}>
        { this.getContainerForMenu(menu) }
      </Layout>
    );
  }
}

function mapStateToProps(state) {
  const currentProfile = state.profiles.currentProfile;
  const settings = state.profiles.profiles.filter(x => x.name === currentProfile)[0].settings;
  return {
    menu: state.menu.currentMenu,
    settings: settings,
    currentProfile,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    changeMenu: menu => dispatch(changeMenu(menu)),
    updateSettings: (currentProfile, shop, key, value) => dispatch(updateProfileSettings(currentProfile, shop, key, value)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Supreme);
