import React, { PropTypes } from 'react';
import { grey50 } from 'material-ui/styles/colors';
import AppBar from 'material-ui/AppBar';
import Tabs from 'material-ui/Tabs/Tabs';

const styles = {
  container: {
    display: 'flex',
    flexFlow: 'column',
    alignItems: 'center',
    minHeight: '100%',
    backgroundColor: grey50,
  },
  content: {
    maxWidth: 1200,
    margin: '0 auto',
    zIndex: 101,
  },
  tabs: {
    marginLeft: -24,
    marginRight: -24,
  },
};

export default function Layout(props) {
  const { children, title, contentStyle, tabs, currentTab } = props;

  const appBarStyles = {
    flex: 'none',
    display: 'block',
    flexWrap: 'wrap',
    zIndex: 100,
    height: 64,
  };

  if (tabs) {
    appBarStyles.marginBottom = 64;
  }
  const contentBaseStyles = Object.assign({}, styles.content);

  return (
    <div style={styles.container}>
      <AppBar title={title} showMenuIconButton={false} style={appBarStyles}>
        {tabs &&
        <div style={{ width: '100%' }}>
          <Tabs style={styles.tabs} value={currentTab}>
            {tabs}
          </Tabs>
        </div>
        }
      </AppBar>
      <div style={{ width: '100%' }}>
        <div style={Object.assign({}, contentBaseStyles, contentStyle)}>
          {children}
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
