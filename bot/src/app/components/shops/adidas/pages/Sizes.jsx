import React, { PropTypes, Component } from 'react';
import { reduxForm, Field, change } from 'redux-form';
import { connect } from 'react-redux';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import Divider from 'material-ui/Divider';
import {
  SelectField,
} from 'redux-form-material-ui';
import Styles from '../../../../constants/Styles';
import * as Utils from '../../../../constants/Utils';
import * as Validators from '../../../../utils/FormValidators';
import * as menus from '../../../../constants/Menus';

class Sizes extends Component {
  handleSetAny() {
    for (let field of ['shoes']) {
      this.props.changeFieldValue(field, 'Any');
    }
  }

  render() {
    const { handleSubmit, pristine, submitting } = this.props;
    return (
      <div>
        <p style={{ textAlign: 'center', fontSize: '1.2em' }}>Configure your desired sizes</p>
        <div style={{ textAlign: 'center', marginBottom: 16 }}>
          <RaisedButton
            onTouchTap={() => this.handleSetAny()}
            label="Use any size for all"
          />
        </div>
        <Divider />
        <form onSubmit={handleSubmit} id="biling-form">
          <div>
            <Field
              name="shoes"
              component={SelectField}
              floatingLabelText="Shoes"
              hintText="Shoes"
              style={Styles.fields.text}
              validate={[Validators.required]}
            >
              {
                Utils.shoeSizes.map(x => <MenuItem key={x} value={x} primaryText={x}/>)
              }
            </Field>
          </div>
          <div>
            <RaisedButton
              label="Save"
              disabled={pristine || submitting}
              type="submit"
            />
          </div>
        </form>
      </div>
    );
  }

}

Sizes.propTypes = {
  shop: PropTypes.string.isRequired,
};

function mapStateToProps(state, ownProps) {
  const currentProfile = state.profiles.currentProfile;
  const settings = state.profiles.profiles.filter(x => x.name === currentProfile)[0].settings;
  return {
    form: 'adidas-sizings-form',
    initialValues: (settings[ownProps.shop] || {})[menus.MENU_SIZES] || {},
  };
}

function mapDispatchToProps(dispatch) {
  return {
    changeFieldValue: (field, value) => dispatch(change('adidas-sizings-form', field, value)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(reduxForm({
  form: 'sizes',
})(Sizes));
