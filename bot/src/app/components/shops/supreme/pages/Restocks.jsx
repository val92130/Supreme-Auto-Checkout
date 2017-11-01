import React, { Component } from 'react';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import { connect } from 'react-redux';
import { green300, red300 } from 'material-ui/styles/colors';
import { List, ListItem } from 'material-ui/List';
import RestockAction from 'material-ui/svg-icons/action/restore';
import NewAction from 'material-ui/svg-icons/alert/add-alert';
import moment from 'moment';
import Avatar from 'material-ui/Avatar';
import RaisedButton from 'material-ui/RaisedButton';
import Layout from '../../../../containers/Layout';
import StorageService from '../../../../../services/StorageService';
import ChromeService from '../../../../../services/ChromeService';
import addNotification from '../../../../actions/notification';
import LocalChangeSelect from '../LocalChangeSelect';


class Restocks extends Component {
  constructor(props) {
    super(props);
    this.state = {
      restocks: [],
    };

    this.updateRestockList();

    ChromeService.addMessageListener('productRestocked', () => {
      this.updateRestockList();
    });
    ChromeService.addMessageListener('productsAdded', () => {
      this.updateRestockList();
    });
  }

  updateRestockList() {
    StorageService.getItem('restocks').then((restocks) => {
      if (restocks) {
        this.setState({ restocks });
      }
    });
  }

  handleClearAll() {
    this.props.notify('Restock list cleared');
    StorageService.setItem('restocks', []).then(() => this.setState({ restocks: [] }));
  }

  render() {
    if (!this.state.restocks) return (<div>loading...</div>);
    const items = this.state.restocks.map((x, i) => {
      const icon = x.type === 'new' ? <NewAction /> : <RestockAction />;
      const color = x.type === 'new' ? red300 : green300;
      const text = x.type === 'new' ? `${x.product.name} in ${x.product.color} dropped` : `${x.product.name} in ${x.product.color} restocked`;
      return (
        <ListItem
          onClick={() => window.open(x.product.url)}
          key={i}
          leftAvatar={<Avatar icon={icon} backgroundColor={color} />}
          primaryText={text}
          secondaryText={moment(new Date(x.timestamp)).fromNow()}
        />
      );
    });
    const style = ChromeService.isPopup() ? { maxWidth: '350px', marginLeft: 'auto', marginRight: 'auto' } : {};
    return (
      <Layout>
        <LocalChangeSelect />
        <br />
        {
          !items.length && <p style={{ textAlign: 'center', fontSize: '1.5em' }}>No restocks yet</p>
        }
        {items.length > 0 && (
          <div>
            <div style={{ textAlign: 'center' }}>
              <RaisedButton label="Clear all" onTouchTap={() => this.handleClearAll()} primary />
            </div>
            <div style={style}>
              <List>
                {items}
              </List>
            </div>
          </div>
        )}
      </Layout>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    notify: msg => dispatch(addNotification(msg)),
  };
}

export default connect(undefined, mapDispatchToProps)(Restocks);

