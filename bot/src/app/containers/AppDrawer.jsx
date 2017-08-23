import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';
import { List, ListItem, makeSelectable } from 'material-ui/List';
import Drawer from 'material-ui/Drawer';
import Subheader from 'material-ui/Subheader';
import CodeIcon from 'material-ui/svg-icons/action/code';
import ShopIcon from 'material-ui/svg-icons/action/shop';
import Styles from '../constants/Styles';

const SelectableList = makeSelectable(List);

function openUrlInNewTab(url) {
  const win = window.open(url, '_blank');
  win.focus();
}

export default function AppDrawer(props) {
  const { location } = props;
  const paths = location.pathname.split('/').filter(x => !!x);
  const currentPage = paths[0];
  return (
    <Drawer open>
      <div style={Styles.logo}>Supreme Auto Checkout</div>
      <SelectableList value={currentPage}>
        <Subheader>Shops</Subheader>
        <ListItem
          value="supreme"
          primaryText="Supreme"
          containerElement={<Link to={'/supreme/'} />}
          leftIcon={<ShopIcon />}
        />
        <Subheader>Other</Subheader>
        <ListItem
          value="about"
          primaryText="Github"
          onTouchTap={() => openUrlInNewTab('https://github.com/val92130/Supreme-Auto-Checkout')}
          leftIcon={<CodeIcon />}
        />
      </SelectableList>
    </Drawer>
  );
}

AppDrawer.propTypes = {
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired,
  }),
};
