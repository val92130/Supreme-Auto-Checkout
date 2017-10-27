import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import StorageService from '../../../../services/StorageService';
import addNotification from '../../../actions/notification';

class LocalChangeSelect extends Component {

  constructor() {
    super();
    this.state = {
      locale: 'eu',
    };

    StorageService.getItem('locale').then((locale) => {
      if (locale) {
        this.setState({ locale });
      }
    });
  }

  handleLocaleChange(newLocale) {
    if (this.state.locale === newLocale) return;
    this.props.notify(`Store location changed to ${newLocale}`);
    StorageService.setItem('locale', newLocale).then(() => StorageService.setItem('stock', [])).then(() => this.setState({ locale: newLocale }));
  }

  render() {
    const { style } = this.props;
    return (
      <div style={style}>
        <SelectField
          floatingLabelText="Supreme shop location"
          value={this.state.locale}
          style={{ textAlign: 'justify' }}
          onChange={(e, i, v) => this.handleLocaleChange(v)}
        >
          <MenuItem value={'us'} primaryText="US" />
          <MenuItem value={'eu'} primaryText="EU" />
        </SelectField>
      </div>
    );
  }
}

LocalChangeSelect.defaultProps = {
  style: {
    textAlign: 'center',
  },
};

LocalChangeSelect.propTypes = {
  style: PropTypes.object,
};

function mapDispatchToProps(dispatch) {
  return {
    notify: m => dispatch(addNotification(m)),
  };
}

export default connect(undefined, mapDispatchToProps)(LocalChangeSelect);
