import React, { Component, PropTypes } from 'react';
import Tab from 'material-ui/Tabs/Tab';
import { connect } from 'react-redux';
import * as menus from '../../constants/Menus';
import Billing from './../menus/Billing';
import Layout from '../../containers/Layout.jsx';
import { changeMenu } from '../../actions/menu';
import { updateSettings } from '../../actions/settings';

class Supreme extends Component {
  getContainerForMenu(menu) {
    switch (menu) {
      case menus.MENU_BILLING:
        return (<Billing onSubmit={data => this.onSubmit(menu, data)} />);
      default:
        return null;
    }
  }

  onSubmit(menu, data) {
    this.props.updateSettings(menu, data);
  }

  componentWillMount() {
    if (this.props.menu == null) {
      this.props.changeMenu(Supreme.getDefaultMenu());
    }
  }

  static getDefaultMenu() {
    return menus.MENU_OPTIONS;
  }

  getTabs() {
    return [
      <Tab
        label="Billing"
        key={1}
        value={menus.MENU_BILLING}
        onClick={() => this.props.changeMenu(menus.MENU_BILLING)}
      />,
      <Tab
        label="Options"
        key={2}
        value={menus.MENU_OPTIONS}
        onClick={() => this.props.changeMenu(menus.MENU_OPTIONS)}
      />,
      <Tab
        label="Sizes"
        key={3}
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
    updateSettings: (key, value) => dispatch(updateSettings(key, value))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Supreme);
