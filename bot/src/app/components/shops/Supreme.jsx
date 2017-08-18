import React, { Component, PropTypes } from 'react';
import Tab from 'material-ui/Tabs/Tab';
import { connect } from 'react-redux';
import FontIcon from 'material-ui/FontIcon';
import IconButton from 'material-ui/IconButton';
import { red300 } from 'material-ui/styles/colors';
import * as menus from '../../constants/Menus';
import Billing from './../menus/Billing';
import Options from './../menus/Options';
import Sizes from './../menus/Sizes';
import Layout from '../../containers/Layout.jsx';
import { changeMenu } from '../../actions/menu';
import { updateSettings } from '../../actions/settings';

export const SHOP_NAME = 'Supreme';

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
    if (typeof value === 'string' && !isNaN(value)) {
      return +(value);
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
    this.props.updateSettings(SHOP_NAME, menu, newObj);
  }

  componentWillMount() {
    if (this.props.menu == null) {
      this.props.changeMenu(Supreme.getDefaultMenu());
    }
  }

  getIconForTabMenu(menu) {
    const isIncomplete = !this.props.settings[SHOP_NAME] || !this.props.settings[SHOP_NAME][menu];
    const color = isIncomplete ? red300 : 'white';
    const tip = isIncomplete ? 'This tab hasn\'t been configured yet' : '';
    return (<IconButton iconStyle={{ color }} tooltip={tip} tooltipPosition="top-center" tooltipStyles={{color: 'white'}}>
        <FontIcon style={{ color }} className="material-icons" >{isIncomplete ? 'error' : 'done'}</FontIcon>
    </IconButton>
    );
  }

  static getDefaultMenu() {
    return menus.MENU_BILLING;
  }

  getTabs() {
    return [
      <Tab
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
      <Layout title={menu || 'Loading...'} tabs={this.getTabs()} currentTab={menu}>
        { this.getContainerForMenu(menu) }
      </Layout>
    );
  }
}

function mapStateToProps(state) {
  return {
    menu: state.menu.currentMenu,
    settings: state.settings.values,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    changeMenu: menu => dispatch(changeMenu(menu)),
    updateSettings: (shop, key, value) => dispatch(updateSettings(shop, key, value))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Supreme);
