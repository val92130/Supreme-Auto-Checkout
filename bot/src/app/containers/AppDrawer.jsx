import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';
import { List, ListItem, makeSelectable } from 'material-ui/List';
import Drawer from 'material-ui/Drawer';
import Subheader from 'material-ui/Subheader';
import ListIcon from 'material-ui/svg-icons/action/list';
import Styles from '../constants/Styles';

const SelectableList = makeSelectable(List);

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
          leftIcon={<ListIcon />}
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
