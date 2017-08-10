import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';
import { List, ListItem, makeSelectable } from 'material-ui/List';
import Drawer from 'material-ui/Drawer';
import Subheader from 'material-ui/Subheader';
import { cyan500 } from 'material-ui/styles/colors';
import { spacing, typography } from 'material-ui/styles';
import ListIcon from 'material-ui/svg-icons/action/list';

const SelectableList = makeSelectable(List);

const styles = {
  logo: {
    fontSize: 16,
    color: typography.textFullWhite,
    lineHeight: `${spacing.desktopKeylineIncrement}px`,
    fontWeight: typography.fontWeightLight,
    backgroundColor: cyan500,
    marginBottom: 8,
    height: 64,
    textAlign: 'center',
  },
};

export default function AppDrawer(props) {
  const { location } = props;
  const paths = location.pathname.split('/').filter(x => !!x);
  const currentPage = paths[0];
  return (
    <Drawer open>
      <div style={styles.logo}>Supreme Auto Checkout</div>
      <SelectableList value={currentPage}>
        <Subheader>Shops</Subheader>
        <ListItem
          value="supreme"
          primaryText="Supreme"
          containerElement={<Link to={'/supreme/'}/>}
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
