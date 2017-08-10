import React, { PropTypes, Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppDrawer from './AppDrawer';

class App extends Component {
  render() {
    const { children } = this.props;
    return (
      <MuiThemeProvider>
        <div style={{ height: '100%' }}>
          <AppDrawer {...this.props} />
          <div style={{ paddingLeft: 256, height: '100%' }}>{children}</div>
        </div>
      </MuiThemeProvider>
    );
  }
}

App.propTypes = {
  children: PropTypes.element,
};

export default App;