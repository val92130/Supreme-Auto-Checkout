import React, { PropTypes } from 'react';
import AppBar from 'material-ui/AppBar';
import Tabs from 'material-ui/Tabs/Tabs';
import Paper from 'material-ui/Paper';
import Styles from '../constants/Styles';

export default function Layout(props) {
  const { children, title, contentStyle, tabs, currentTab } = props;

  const appBarStyles = Object.assign({}, Styles.appBar);

  if (tabs) {
    appBarStyles.marginBottom = 64;
  }

  return (
    <div style={Styles.container}>
      <AppBar title={title} showMenuIconButton={false} style={appBarStyles}>
        {tabs &&
        <div style={{ width: '100%' }}>
          <Tabs style={Styles.tabs} value={currentTab}>
            {tabs}
          </Tabs>
        </div>
        }
      </AppBar>
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

Layout.propTypes = {
  children: PropTypes.node,
  title: PropTypes.string.isRequired,
  contentStyle: PropTypes.object,
  tabs: PropTypes.arrayOf(PropTypes.node),
  currentTab: PropTypes.any,
};
