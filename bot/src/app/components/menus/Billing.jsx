import React from 'react';
import { reduxForm, Field } from 'redux-form'
import MenuItem from 'material-ui/MenuItem'
import { RadioButton } from 'material-ui/RadioButton'
import { AutoComplete as MUIAutoComplete } from 'material-ui';
import {
  AutoComplete,
  Checkbox,
  RadioButtonGroup,
  SelectField,
  TextField,
  Toggle,
  DatePicker
} from 'redux-form-material-ui'
import Styles from '../../constants/Styles';
import * as Utils from '../../constants/Utils';
import * as Validators from '../../constants/FormValidators';

const Billing = props => {
  const { handleSubmit, pristine, reset, submitting } = props;
  return (
    <form>
      <div>
        <Field
          name="order_billing_name"
          validate={[Validators.required]}
          component={TextField}
          hintText="Firstname and Lastname"
          style={Styles.fields.text}
        />
      </div>

      <div>
        <Field
          name="order_email"
          component={TextField}
          hintText="Email"
          style={Styles.fields.text}
          validate={[Validators.required, Validators.email]}
        />
      </div>

      <div>
        <Field name="order_tel" component={TextField} hintText="Phone number" style={Styles.fields.text}/>
      </div>

      <div>
        <Field name="bo" component={TextField} hintText="Address" style={Styles.fields.text}/>
      </div>

      <div>
        <Field name="order_billing_city" component={TextField} hintText="City" style={Styles.fields.text}/>
      </div>

      <div>
        <Field name="order_billing_country" component={SelectField} hintText="Country" style={Styles.fields.text}>
          {
            Utils.countries.map(x => <MenuItem value={x.value} primaryText={x.text}/>)
          }
        </Field>
      </div>

      <div>
        <Field name="order_billing_zip" component={TextField} hintText="Zip" style={Styles.fields.text}/>
      </div>

      <div>
        <Field
          name="credit_card_type"
          component={SelectField}
          floatingLabelText="Credit card type"
          openOnFocus
          style={Styles.fields.text}
        >
          <MenuItem value="visa" primaryText="Visa"/>
          <MenuItem value="american_express" primaryText="American Express"/>
          <MenuItem value="master" primaryText="Mastercard"/>
          <MenuItem value="solo" primaryText="Solo"/>
        </Field>
      </div>

      <div>
        <Field name="cnb" component={TextField} hintText="Credit Card Number" style={Styles.fields.text}/>
      </div>

      <div>
        <Field
          name="credit_card_month"
          component={SelectField}
          floatingLabelText="Expiry month"
          openOnFocus
          style={Styles.fields.text}
        >
          {
            Array.apply(null, new Array(12)).map((x, i) => {
              const month = ++i < 10 ? `0${i}` : i;
              return <MenuItem value={month} primaryText={month}/>;
            })
          }
        </Field>
      </div>

      <div>
        <Field
          name="credit_card_year"
          component={SelectField}
          floatingLabelText="Expiry year"
          openOnFocus
          style={Styles.fields.text}
        >
          {
            Array.apply(null, new Array(5)).map((x, i) => {
              const year = new Date().getFullYear() + i;
              return <MenuItem value={year} primaryText={year}/>;
            })
          }
        </Field>
      </div>

      <div>
        <Field name="vval" component={TextField} hintText="CCV" style={Styles.fields.text}/>
      </div>
    </form>
  );
};

export default reduxForm({
  form: 'billing',
})(Billing);
