import React, { Component } from 'react';
import FontIcon from 'material-ui/FontIcon';
import { BottomNavigation, BottomNavigationItem } from 'material-ui/BottomNavigation';
import IconLocationOn from 'material-ui/svg-icons/communication/location-on';
import { connect } from 'react-redux';
import * as menus from '../constants/Menus';
import { changeMenu } from '../actions/menu';

const nearbyIcon = <IconLocationOn />;


class Navigation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedIndex: [...menus].indexOf(props.menu),
    };
  }

  select(menu, index) {
    this.setState({ selectedIndex: index });
    this.props.changeMenu(menu);
  }

  render() {
    return (
      <div>
        <BottomNavigation selectedIndex={this.state.selectedIndex}>
          {(() => {
            return Object.keys(menus).map((x, i) => <BottomNavigationItem
              key={i}
              label={x}
              icon={nearbyIcon}
              onTouchTap={() => this.select(x, i)}
            />);
          })()}
        </BottomNavigation>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return { menu: state.menu.currentMenu };
}

function mapDispatchToProps(dispatch) {
  return {
    changeMenu: menu => dispatch(changeMenu(menu)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Navigation);
