import React, { Component } from 'react';
import { connect } from 'react-redux';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import { green300, red300 } from 'material-ui/styles/colors';
import { List, ListItem } from 'material-ui/List';
import RestockAction from 'material-ui/svg-icons/action/restore';
import NewAction from 'material-ui/svg-icons/alert/add-alert';
import ClearAction from 'material-ui/svg-icons/action/delete';
import moment from 'moment';
import Avatar from 'material-ui/Avatar';
import RaisedButton from 'material-ui/RaisedButton';
import Layout from '../../../../containers/Layout';
import StorageService from '../../../../../services/StorageService';
import ChromeService from '../../../../../services/ChromeService';


class Restocks extends Component {
  constructor(props) {
    super(props);
    this.state = {
      restocks: [],
      locale: 'eu',
    };

    StorageService.getItem('restocks').then(restocks => this.setState({ restocks }));
    StorageService.getItem('locale').then(locale => this.setState({ locale }));
  }

  handleLocaleChange(newLocale) {
    StorageService.setItem('locale', newLocale).then(() => this.setState({ locale: newLocale }));
  }

  handleClearAll() {
    StorageService.setItem('restocks', []).then(() => this.setState({ restocks: [] }));
  }

  render() {
    const items = this.state.restocks.sort(function(a, b) {
      return new Date(b.timestamp) - new Date(a.timestamp);
    }).map((x, i) => {
      const icon = x.type === 'new' ? <NewAction /> : <RestockAction />;
      const color = x.type === 'new' ? red300 : green300;
      const text = x.type === 'new' ? `${x.product.name} in ${x.product.color} dropped` : `${x.product.name} in ${x.product.color} restocked`;
      return (
        <ListItem
          onClick={() => window.open(`http://supremenewyork.com/${x.product.url}`)}
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
        <div style={{ textAlign: 'center' }}>
          <SelectField
            floatingLabelText="Country"
            value={this.state.locale}
            style={{ textAlign: 'justify' }}
            onChange={(e, i, v) => this.handleLocaleChange(v)}
          >
            <MenuItem value={'us'} primaryText="US" />
            <MenuItem value={'eu'} primaryText="EU" />
          </SelectField>
          <br />
          <RaisedButton label="Clear all" onTouchTap={() => this.handleClearAll()} primary />
        </div>
        <div style={style}>
          <List>
            {items}
          </List>
        </div>
      </Layout>
    );
  }
}

function mapStateToProps() {

}

function mapDispatchToProps() {

}

export default connect()(Restocks);
