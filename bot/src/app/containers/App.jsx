import React, { PropTypes, Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppDrawer from './AppDrawer';
import NotificationBar from '../components/NotificationBar';
import { getTheme } from '../constants/Styles';

class App extends Component {
  render() {
    const { children } = this.props;
    return (
      <MuiThemeProvider muiTheme={getTheme()}>
        <div style={{ height: '100%' }}>
          <AppDrawer {...this.props} />
          <div style={{ paddingLeft: 256, height: '100%' }}>{children}</div>
          <NotificationBar />
        </div>
      </MuiThemeProvider>
    );
  }
}

App.propTypes = {
  children: PropTypes.element,
};

export default App;
