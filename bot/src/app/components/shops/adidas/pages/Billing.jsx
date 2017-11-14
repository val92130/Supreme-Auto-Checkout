import React, { PropTypes } from 'react';
import { reduxForm, Field, formValueSelector } from 'redux-form';
import { connect } from 'react-redux';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import Divider from 'material-ui/Divider';
import {
  SelectField,
  TextField,
} from 'redux-form-material-ui';
import Styles from '../../../../constants/Styles';
import * as Utils from '../../../../constants/Utils';
import * as Validators from '../../../../utils/FormValidators';
import * as menus from '../../../../constants/Menus';

const Billing = props => {
  const { handleSubmit, pristine, submitting, country } = props;
  return (
    <div>
      <p style={{ textAlign: 'center', fontSize: '1.2em' }}>Configure your billing infos</p>
      <Divider />
      <form onSubmit={handleSubmit} id="biling-form">
        <div>
          <Field
            name="fullName"
            validate={Validators.fullName}
            component={TextField}
            floatingLabelText="Firstname and Lastname"
            hintText="Firstname and Lastname"
            style={Styles.fields.text}
          />
        </div>

        <div>
          <Field
            name="email"
            component={TextField}
            floatingLabelText="Email"
            hintText="Email"
            style={Styles.fields.text}
            validate={[Validators.email]}
          />
        </div>

        <div>
          <Field
            name="tel"
            component={TextField}
            floatingLabelText="Phone number"
            hintText="Phone number"
            style={Styles.fields.text}
          />
        </div>

        <div>
          <Field
            name="address"
            component={TextField}
            floatingLabelText="Address"
            hintText="Address"
            style={Styles.fields.text}
          />
        </div>

        <div>
          <Field
            name="address2"
            component={TextField}
            floatingLabelText="Address 2"
            hintText="Address 2"
            style={Styles.fields.text}
          />
        </div>

        <div>
          <Field
            name="city"
            component={TextField}
            floatingLabelText="City"
            hintText="City"
            style={Styles.fields.text}
          />
        </div>

        <div>
          <Field
            name="zip"
            component={TextField}
            floatingLabelText="Zip"
            style={Styles.fields.text}
          />
        </div>

        <div>
          <Field
            name="cardNumber"
            component={TextField}
            floatingLabelText="Credit Card Number"
            hintText="Credit Card Number"
            style={Styles.fields.text}
          />
        </div>

        <div>
          <Field
            name="cardMonth"
            component={SelectField}
            floatingLabelText="Expiry month"
            hintText="Expiry month"
            style={Styles.fields.text}
          >
            {
              Array.apply(null, new Array(12)).map((x, i) => {
                const month = ++i < 10 ? `0${i}` : i;
                return <MenuItem key={month} value={month} primaryText={month}/>;
              })
            }
          </Field>
        </div>

        <div>
          <Field
            name="cardYear"
            component={SelectField}
            floatingLabelText="Expiry year"
            hintText="Expiry year"
            style={Styles.fields.text}
          >
            {
              Array.apply(null, new Array(10)).map((x, i) => {
                const year = new Date().getFullYear() + i;
                return <MenuItem key={year} value={year} primaryText={year} />;
              })
            }
          </Field>
        </div>

        <div>
          <Field
            name="ccv"
            component={TextField}
            hintText="CCV"
            floatingLabelText="CCV"
            style={Styles.fields.text}
          />
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
};

const BillingForm = reduxForm({
  form: 'adidas-billing-form',
})(Billing);

Billing.propTypes = {
  shop: PropTypes.string.isRequired,
};
const selector = formValueSelector('adidas-billing-form');

function mapStateToProps(state, ownProps) {
  const currentProfile = state.profiles.currentProfile;
  const settings = state.profiles.profiles.filter(x => x.name === currentProfile)[0].settings;
  return {
    initialValues: (settings[ownProps.shop] || {})[menus.MENU_BILLING] || {},
    country: selector(state, 'order_billing_country'),
  };
}

export default connect(mapStateToProps)(BillingForm);
