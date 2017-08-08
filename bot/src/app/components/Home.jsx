import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';
import DrawerMenuList from './DrawerMenuList';
import * as menus from '../constants/Menus';
import Billing from './menus/Billing';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      drawerOpen: false,
    };
  }

  static getContainerForMenu(menu) {
    switch (menu) {
      case menus.MENU_BILLING:
        return (<Billing />);
      default:
        return null;
    }
  }

  setDrawerStatus(open) {
    this.setState({
      drawerOpen: open,
    });
  }

  render() {
    const menu = this.props.menu;
    return (
      <div>
        <AppBar
          title={`Supreme - ${menu}`}
          onLeftIconButtonTouchTap={() => this.setDrawerStatus(true)}
        />
        <Drawer
          docked={false}
          width={300}
          open={this.state.drawerOpen}
          onRequestChange={open => this.setDrawerStatus(open)}
        >
          <DrawerMenuList onSelected={() => this.setDrawerStatus(false)} />
        </Drawer>
        { Home.getContainerForMenu(menu) }
      </div>
    );
  }
}

Home.propTypes = {
  menu: PropTypes.string.isRequired,
};

function mapStateToProps(state) {
  return {
    menu: state.menu.currentMenu,
  };
}

export default connect(mapStateToProps)(Home);
