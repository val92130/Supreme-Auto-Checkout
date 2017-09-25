import React, { PropTypes } from 'react';
import { reduxForm, Field, formValueSelector } from 'redux-form';
import { connect } from 'react-redux';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import {
  SelectField,
  TextField,
} from 'redux-form-material-ui';
import Styles from '../../../../constants/Styles';
import * as Utils from '../../../../constants/Utils';
import * as Validators from '../../../../utils/FormValidators';
import * as menus from '../../../../constants/Menus';

function getStatesForCountry(country) {
  switch (country) {
    case 'USA':
      return Utils.usaRegions;
    case 'JAPAN':
      return Utils.japanRegions;
    case 'CANADA':
      return Utils.canadaRegions;
    default:
      return [];
  }
}

const Billing = props => {
  const { handleSubmit, pristine, submitting, country } = props;
  return (
    <form onSubmit={handleSubmit} id="biling-form">
      <div>
        <Field
          name="order_billing_name"
          validate={Validators.fullName}
          component={TextField}
          floatingLabelText="Firstname and Lastname"
          hintText="Firstname and Lastname"
          style={Styles.fields.text}
        />
      </div>

      <div>
        <Field
          name="order_email"
          component={TextField}
          floatingLabelText="Email"
          hintText="Email"
          style={Styles.fields.text}
          validate={[Validators.required, Validators.email]}
        />
      </div>

      <div>
        <Field
          name="order_tel"
          component={TextField}
          floatingLabelText="Phone number"
          hintText="Phone number"
          style={Styles.fields.text}
          validate={[Validators.required]}
        />
      </div>

      <div>
        <Field
          name="bo"
          component={TextField}
          floatingLabelText="Address"
          hintText="Address"
          style={Styles.fields.text}
          validate={[Validators.required]}
        />
      </div>

      <div>
        <Field
          name="order_billing_city"
          component={TextField}
          floatingLabelText="City"
          hintText="City"
          style={Styles.fields.text}
          validate={[Validators.required]}
        />
      </div>

      <div>
        <Field
          name="order_billing_country"
          component={SelectField}
          floatingLabelText="Country"
          hintText="Country"
          style={Styles.fields.text}
          validate={[Validators.required]}
        >
          {
            Utils.countries.map(x => <MenuItem key={x.value} value={x.value} primaryText={x.text} />)
          }
        </Field>
      </div>
      {
        ['JAPAN', 'USA', 'CANADA'].indexOf(country) !== -1 &&
        <Field
          name="order_billing_state"
          component={SelectField}
          floatingLabelText="State"
          hintText="State"
          style={Styles.fields.text}
          validate={[Validators.required]}
        >
          {
            getStatesForCountry(country).map(x => <MenuItem key={x.value} value={x.value} primaryText={x.text} />)
          }
        </Field>
      }

      <div>
        <Field
          name="order_billing_zip"
          component={TextField}
          floatingLabelText="Zip"
          style={Styles.fields.text}
        />
      </div>

      <div>
        <Field
          name="credit_card_type"
          component={SelectField}
          floatingLabelText="Credit card type"
          style={Styles.fields.text}
          validate={[Validators.required]}
        >
          {
            (country === 'JAPAN' ? Utils.japanCreditCards : Utils.creditCards).map(x =>
              <MenuItem value={x.value} primaryText={x.text} key={x.value} />,
            )
          }
        </Field>
      </div>

      <div>
        <Field
          name="cnb"
          component={TextField}
          floatingLabelText="Credit Card Number"
          hintText="Credit Card Number"
          style={Styles.fields.text}
          validate={[Validators.required]}
        />
      </div>

      <div>
        <Field
          name="credit_card_month"
          component={SelectField}
          floatingLabelText="Expiry month"
          hintText="Expiry month"
          validate={[Validators.required]}
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
          name="credit_card_year"
          component={SelectField}
          floatingLabelText="Expiry year"
          hintText="Expiry year"
          style={Styles.fields.text}
          validate={[Validators.required]}
        >
          {
            Array.apply(null, new Array(10)).map((x, i) => {
              const year = new Date().getFullYear() + i;
              return <MenuItem key={year} value={year} primaryText={year}/>;
            })
          }
        </Field>
      </div>

      <div>
        <Field
          name="vval"
          component={TextField}
          hintText="CCV"
          floatingLabelText="CCV"
          style={Styles.fields.text}
          validate={[Validators.required]}
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
  );
};

const BillingForm = reduxForm({
  form: 'billing',
})(Billing);

Billing.propTypes = {
  shop: PropTypes.string.isRequired,
};
const selector = formValueSelector('billing');

function mapStateToProps(state, ownProps) {
  const currentProfile = state.profiles.currentProfile;
  const settings = state.profiles.profiles.filter(x => x.name === currentProfile)[0].settings;
  return {
    initialValues: (settings[ownProps.shop] || {})[menus.MENU_BILLING] || {},
    country: selector(state, 'order_billing_country'),
  };
}

export default connect(mapStateToProps)(BillingForm);
