import React, { PropTypes } from 'react';
import { reduxForm, Field } from 'redux-form';
import { connect } from 'react-redux';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import {
  SelectField,
  TextField,
} from 'redux-form-material-ui';
import Styles from '../../constants/Styles';
import * as Utils from '../../constants/Utils';
import * as Validators from '../../constants/FormValidators';
import * as menus from '../../constants/Menus';

const Billing = props => {
  const { handleSubmit, pristine, submitting } = props;
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

      <div>
        <Field name="order_billing_zip" component={TextField} hintText="Zip" style={Styles.fields.text} />
      </div>

      <div>
        <Field
          name="credit_card_type"
          component={SelectField}
          floatingLabelText="Credit card type"
          style={Styles.fields.text}
          validate={[Validators.required]}
        >
          <MenuItem value="visa" primaryText="Visa"/>
          <MenuItem value="american_express" primaryText="American Express"/>
          <MenuItem value="master" primaryText="Mastercard"/>
          <MenuItem value="solo" primaryText="Solo"/>
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
            Array.apply(null, new Array(5)).map((x, i) => {
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

function mapStateToProps(state) {
  return {
    initialValues: state.settings.values[menus.MENU_BILLING] || {},
  };
}

export default connect(mapStateToProps)(reduxForm({
  form: 'billing',
})(Billing));
