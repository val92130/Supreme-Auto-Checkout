import React, { Component, PropTypes } from 'react';
import { reduxForm, Field } from 'redux-form';
import { connect } from 'react-redux';
import ChipInput from 'material-ui-chip-input';
import MenuItem from 'material-ui/MenuItem';
import {
  TextField,
  SelectField,
  Toggle,
} from 'redux-form-material-ui';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import * as Validators from '../../../utils/FormValidators';
import Styles from '../../../constants/Styles';
import { categories } from '../../../constants/Utils';

class AtcCreateForm extends Component {
  render() {
    const { handleSubmit, pristine, submitting, onRequestClose, atcProducts, initialValues, editing } = this.props;
    const renderChip = ({input, hintText, floatingLabelText, meta: {touched, error} }) => (
      <ChipInput
        {...input}
        chipContainerStyle={Styles.fields.text}
        fullWidth
        value = { input.value || []}
        onRequestAdd={(addedChip) => {
          let values = input.value || [];
          values = values.slice();
          values.push(addedChip);
          input.onChange(values);
        }}
        onRequestDelete={(deletedChip) => {
          let values = input.value || [];
          values = values.filter(v => v !== deletedChip);
          input.onChange(values);
        }}
        onBlur={() => input.onBlur()}
        hintText={hintText}
        floatingLabelText={floatingLabelText}
        errorText={(touched && error) ? error : ''}
      />
    );
    const buttonStyle = {
      margin: 6,
      float: 'right',
    };

    const initialAtcName = initialValues.name;
    const formValidators = [Validators.required];
    if (!editing) {
      formValidators.push(Validators.unique(atcProducts.map(x => x.name)));
    } else {
      formValidators.push(Validators.unique(atcProducts.filter(x => x.name !== initialAtcName).map(x => x.name)));
    }
    return (
      <div>
        <p style={{ fontSize: '0.8em' }}>ATC Product description is only used to differentiate different ATC products, it doesn't have any effect on the Autocop process.</p>
        <p style={{ fontSize: '0.8em' }}>Keywords is the most important information to find a product for Autocop, make sure to add detailed keywords. For example for a Box Logo add the following keywords: box, logo, hoodie.</p>
        <p style={{ fontSize: '0.8em' }}>You can also add negative keywords by prepending a <b>"!"</b> to a keyword, for example the keywords "<b>box logo !longsleeve tee</b>" will match a product like <b>"Box Logo Tee"</b> but not <b>"Box Logo Longsleeve tee"</b></p>
        <form onSubmit={handleSubmit} id="atc-form">
          <div>
            <Field
              name="name"
              validate={formValidators}
              component={TextField}
              floatingLabelText="ATC Product description"
              hintText="ATC Product description"
              style={Styles.fields.text}
            />
          </div>

          <div>
            <Field
              name="keywords"
              component={renderChip}
              floatingLabelText="Product keywords, press enter to validate a keyword"
              hintText="Product keywords"
              style={Styles.fields.text}
              labelStyle={Styles.fields.text}
              validate={[Validators.required, Validators.notEmpty]}
            />
          </div>

          <div>
            <Field
              name="color"
              component={TextField}
              floatingLabelText="Color"
              hintText="Color"
              style={Styles.fields.text}
            />
          </div>

          <div>
            <Field
              name="category"
              component={SelectField}
              floatingLabelText="Product category"
              style={Styles.fields.text}
              validate={[Validators.required]}
            >
              {
                categories.map((x) => {
                  return (
                    <MenuItem key={x} value={x} primaryText={x} />
                  );
                })
              }
            </Field>
          </div>
          <br />
          <div>
            <Field
              name="enabled"
              component={Toggle}
              label="Enabled"
              style={Styles.fields.text}
            />
          </div>

          <div>
            <RaisedButton
              label="Add"
              style={buttonStyle}
              disabled={pristine || submitting}
              type="submit"
            />
            <FlatButton
              label="Cancel"
              style={buttonStyle}
              onTouchTap={() => {
                if (onRequestClose) {
                  onRequestClose();
                }
              }}
            />
          </div>
        </form>
      </div>
    );
  }
}

AtcCreateForm.propTypes = {
  onRequestClose: PropTypes.function,
};

const Form = reduxForm({
  form: 'atc-form',
})(AtcCreateForm);

function mapStateToProps(state, ownProps) {
  return {
    atcProducts: state.atc.atcProducts,
    initialValues: Object.assign({
      enabled: true,
    }, ownProps.initialValues),
  };
}

export default connect(mapStateToProps)(Form);
