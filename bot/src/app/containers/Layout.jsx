import React, { PropTypes, Component } from 'react';
import AppBar from 'material-ui/AppBar';
import Tabs from 'material-ui/Tabs/Tabs';
import Paper from 'material-ui/Paper';
import { connect } from 'react-redux';
import Styles from '../constants/Styles';
import { setDrawerOpen } from '../actions/drawer';

class Layout extends Component {
  toggleMenu() {
    this.props.setDrawerOpen(!this.props.drawerOpen);
  }

  render() {
    const { children, title, contentStyle, tabs, currentTab } = this.props;
    const appBarStyles = Object.assign({}, Styles.appBar);
    const tabContainer = (
      <div style={{ display: 'flex' }}>
        <Tabs value={currentTab} style={Styles.tabs} tabItemContainerStyle={Styles.tab}>
          { tabs }
        </Tabs>
      </div>
    );
    return (
      <div style={Styles.container}>
        <AppBar title={tabs ? tabContainer : title} style={appBarStyles} onLeftIconButtonTouchTap={() => this.toggleMenu()} />
        <div style={{ width: '100%' }}>
          <div style={Object.assign({}, Styles.content, contentStyle)}>
            <Paper style={Styles.paper}>
              {children}
            </Paper>
          </div>
        </div>
      </div>
    );
  }
}

Layout.propTypes = {
  children: PropTypes.element,
  title: PropTypes.string,
  contentStyle: PropTypes.object,
  tabs: PropTypes.arrayOf(PropTypes.node),
  currentTab: PropTypes.any,
  drawerOpen: PropTypes.bool,
  setDrawerOpen: PropTypes.func,
};

function mapStateToProps(state) {
  return {
    drawerOpen: state.drawer.open,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setDrawerOpen: open => dispatch(setDrawerOpen(open)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Layout);
