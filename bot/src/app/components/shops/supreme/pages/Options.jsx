import React, { PropTypes, Component } from 'react';
import { reduxForm, Field, formValueSelector } from 'redux-form';
import { connect } from 'react-redux';
import RaisedButton from 'material-ui/RaisedButton';
import IconButton from 'material-ui/IconButton';
import IconHelp from 'material-ui/svg-icons/action/help';
import Dialog from 'material-ui/Dialog';
import Divider from 'material-ui/Divider';
import {
  TextField,
  Toggle,
  DatePicker,
  SelectField,
  } from 'redux-form-material-ui';
import MenuItem from 'material-ui/MenuItem';
import Styles from '../../../../constants/Styles';
import * as Validators from '../../../../utils/FormValidators';
import * as menus from '../../../../constants/Menus';
import * as SupremeUtils from '../../../../utils/SupremeUtils';

const defaultValues = {
  autoCheckout: false,
  autoPay: false,
  strictSize: true,
  hideSoldOut: false,
  addToCartDelay: 200,
  checkoutDelay: 2000,
  showNotifications: false,
  disableImages: false,
};

class HelperField extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
    };
  }

  setOpen(val) {
    this.setState({ open: val });
  }

  render() {
    const { field, title, helperText } = this.props;
    return (
      <div>
        <Dialog
          title={title}
          modal={false}
          open={this.state.open}
          onRequestClose={() => this.setOpen(false)}
        >
          { helperText }
        </Dialog>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{ flex: 1 }}><IconButton onTouchTap={() => this.setOpen(true)} style={{ paddingLeft: 0 }} iconStyle={{ height: 16, width: 16 }}><IconHelp /></IconButton>{title}</span>
          { field }
        </div>
      </div>
    );
  }
}

const Options = props => {
  const { handleSubmit, pristine, submitting, atcEnabled } = props;
  return (
    <div>
      <p style={{ textAlign: 'center', fontSize: '1.2em' }}>Configure options and features of the bot</p>
      <Divider />
      <form onSubmit={handleSubmit} id="options-form">
        <div>
          <HelperField
            field={
              <Field
                name="autoCheckout"
                component={Toggle}
                style={{ width: 'auto' }}
              />
            }
            title="Enable Auto Checkout"
            helperText={
              <div>
                <p>
                  Autocheckout will automatically add to cart a product whenever you click on a product page and
                  automatically fill the checkout form using the informations in the "Billing" tab.
                  <br />
                  <br />
                  The product will be added to cart using the sizes you chose in the "Sizes" tab.
                </p>
              </div>
            }
          />
        </div>

        <div>
          <HelperField
            field={
              <Field
                name="autoPay"
                component={Toggle}
                style={{ width: 'auto' }}
              />
            }
            title="Enable Auto Payment"
            helperText={
              <div>
                <p>
                  Autopayment option will automatically click the "Process payment" button in the checkout form.
                  <br />
                  Autocheckout must be enabled otherwise this option will not have any effect.
                </p>
              </div>
            }
          />

        </div>
        <div>
          <HelperField
            field={
              <Field
                name="strictSize"
                component={Toggle}
                style={{ width: 'auto' }}
              />
            }
            title="Enable strict size checking"
            helperText={
              <div>
                <p>
                  If this option is enabled a product will not be added to the cart unless the selected size from the "Sizes" tab is available.
                </p>
              </div>
            }
          />
        </div>

        <div>
          <HelperField
            field={
              <Field
                name="hideSoldOut"
                component={Toggle}
                style={{ width: 'auto' }}
              />
            }
            title="Hide sold out products"
            helperText={
              <div>
                <p>
                  This option will hide sold out products from the Supreme online shop.
                </p>
              </div>
            }
          />
        </div>

        <div>
          <HelperField
            field={
              <Field
                name="showNotifications"
                component={Toggle}
                style={{ width: 'auto' }}
              />
            }
            title="Display restock notifications"
            helperText={
              <div>
                <p>
                  If this option is enabled you will receive a notification whenever a product restocks or land on the shop.
                </p>
              </div>
            }
          />
        </div>

        <div>
          <HelperField
            field={
              <Field
                name="atcUseMonitor"
                component={Toggle}
                style={{ width: 'auto' }}
              />
            }
            title="Use product monitor for AutoCop"
            helperText={
              <div>
                <p>
                  A process in the background periodically fetches products from the Supreme mobile api, if you use this option Autocop will try
                  to find products based on the products from this API.
                  <br />
                  <br />
                  This is required for countries where product's names aren't displayed on the Supreme website like Japan.
                </p>
              </div>
            }
          />
        </div>

        <div>
          <HelperField
            field={
              <Field
                name="disableImages"
                component={Toggle}
                style={{ width: 'auto' }}
              />
            }
            title="Disable images loading"
            helperText={
              <div>
                <p>
                  If enabled, images will not be loaded on the Supreme website, this can improve speed.
                </p>
              </div>
            }
          />
        </div>
        <div>
          <HelperField
            field={
              <Field
                name="atcEnabled"
                component={Toggle}
                style={{ width: 'auto' }}
              />
            }
            title="Enable AutoCop timer"
            helperText={
              <div>
                <p>
                  AutoCop is a feature that will automatically try to buy your desired products at a specific time.
                  <br /> <br/>
                  Once AutoCop is triggered at the end of the timer, a tab with the Supreme shop will be opened for every products you have defined in the "Autocop" page and automatically add them to
                  the cart if they are found.
                </p>
              </div>
            }
          />
        </div>

        {
          atcEnabled &&
            <div>
              <Field
                name="atcStartTime"
                component={TextField}
                floatingLabelText="ATC Start time (hh:mm:ss) 24hour format"
                hintText="ATC Start time"
                style={Styles.fields.text}
                validate={[Validators.required, Validators.time24]}
              />
              <Field
                name="atcStartDate"
                component={DatePicker}
                floatingLabelText="ATC Start date"
                hintText="ATC Start date"
                style={Styles.fields.text}
                textFieldStyle={Styles.fields.text}
                validate={[Validators.required]}
              />
            </div>
        }
        <div>
          <Field
            name="onCartSoldOut"
            component={SelectField}
            label="Action when out of stock in cart..."
            floatingLabelText="Action when out of stock in cart..."
            hintText="Action when out of stock in cart..."
            style={Styles.fields.text}
            validate={Validators.required}
          >
            <MenuItem key={SupremeUtils.OnSoldOutCartActions.REMOVE_SOLD_OUT_PRODUCTS} value={SupremeUtils.OnSoldOutCartActions.REMOVE_SOLD_OUT_PRODUCTS} primaryText={'Remove sold out products'} />
            <MenuItem key={SupremeUtils.OnSoldOutCartActions.STOP} value={SupremeUtils.OnSoldOutCartActions.STOP} primaryText={'Stop auto-checkout'} />
          </Field>
        </div>
        <div>
          <Field
            name="addToCartDelay"
            component={TextField}
            floatingLabelText="Add to cart delay (ms)"
            hintText="Add to cart delay (ms)"
            style={Styles.fields.text}
            validate={[Validators.required, Validators.number]}
          />
        </div>

        <div>
          <Field
            name="checkoutDelay"
            component={TextField}
            floatingLabelText="Checkout delay (ms)"
            hintText="Checkout delay (ms)"
            style={Styles.fields.text}
            validate={[Validators.required, Validators.number]}
          />
        </div>

        <div>
          <Field
            name="maxPrice"
            component={TextField}
            floatingLabelText="Maximum product price"
            hintText="Maximum product price"
            style={Styles.fields.text}
            validate={[Validators.required, Validators.number]}
          />
        </div>

        <div>
          <Field
            name="minPrice"
            component={TextField}
            floatingLabelText="Minimum product price"
            hintText="Minimum product price"
            style={Styles.fields.text}
            validate={[Validators.required, Validators.number]}
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

const OptionsForm = reduxForm({
  form: 'options',
})(Options);

const selector = formValueSelector('options');

function mapStateToProps(state, ownProps) {
  const currentProfile = state.profiles.currentProfile;
  const settings = state.profiles.profiles.filter(x => x.name === currentProfile)[0].settings;
  const initialValues = Object.assign({}, defaultValues, (settings[ownProps.shop] || {})[menus.MENU_OPTIONS] || {});
  if (initialValues['atcStartDate'] && initialValues['atcStartDate'] !== 'Invalid Date') {
    initialValues['atcStartDate'] = new Date(initialValues['atcStartDate']);
  }
  return {
    initialValues,
    atcEnabled: selector(state, 'atcEnabled'),
  };
}

Options.propTypes = {
  shop: PropTypes.string.isRequired,
};


export default connect(mapStateToProps)(OptionsForm);
