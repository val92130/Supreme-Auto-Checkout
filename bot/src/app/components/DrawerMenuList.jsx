import React, { Component, PropTypes } from 'react';
import MenuItem from 'material-ui/MenuItem';
import { connect } from 'react-redux';
import * as menus from '../constants/Menus';
import { changeMenu } from '../actions/menu';

class DrawerMenuList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedIndex: Object.keys(menus).map(x => menus[x]).indexOf(props.menu),
    };
  }

  select(menu, index) {
    this.setState({ selectedIndex: index });
    this.props.changeMenu(menu);
    if (this.props.onSelected) {
      this.props.onSelected(menu, index);
    }
  }

  render() {
    const items = Object.keys(menus).map((x, i) => <MenuItem
      key={i}
      onTouchTap={() => this.select(menus[x], i)}
    >
      { menus[x] }
    </MenuItem>);
    return (
      <div>
        { items }
      </div>
    );
  }
}

DrawerMenuList.propTypes = {
  changeMenu: PropTypes.func.isRequired,
  menu: PropTypes.string.isRequired,
  onSelected: PropTypes.func,
};

function mapStateToProps(state) {
  return { menu: state.menu.currentMenu };
}

function mapDispatchToProps(dispatch) {
  return {
    changeMenu: menu => dispatch(changeMenu(menu)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(DrawerMenuList);
