import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppDrawer from './AppDrawer';
import NotificationBar from '../components/NotificationBar';
import { getTheme } from '../constants/Styles';
import { setDrawerOpen } from '../actions/drawer';

class App extends Component {
  componentDidMount() {
    window.onresize = () => this.handleResize();
  }

  handleResize() {
    const { setDrawerOpen, drawerOpen } = this.props;
    if (window.innerWidth <= 1024) {
      setDrawerOpen(false);
    } else if (!drawerOpen) {
      setDrawerOpen(true);
    }
  }

  render() {
    const { children } = this.props;
    const drawerOpen = this.props.drawerOpen;
    return (
      <MuiThemeProvider muiTheme={getTheme()}>
        <div style={{ height: '100%' }}>
          <AppDrawer {...this.props} open={drawerOpen} />
          <div style={{ paddingLeft: drawerOpen ? 256 : 0, height: '100%' }}>{children}</div>
          <NotificationBar />
        </div>
      </MuiThemeProvider>
    );
  }
}

App.propTypes = {
  children: PropTypes.element,
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

export default connect(mapStateToProps, mapDispatchToProps)(App);
