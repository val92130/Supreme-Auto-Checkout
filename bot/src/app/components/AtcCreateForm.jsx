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
import * as Validators from '../constants/FormValidators';
import Styles from '../constants/Styles';
import { categories } from '../constants/Utils';

class AtcCreateForm extends Component {
  render() {
    const { handleSubmit, pristine, submitting, onRequestClose, atcProducts } = this.props;
    const renderChip = ({input, hintText, floatingLabelText}) => (
      <ChipInput
        {...input}
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
      />
    );
    const buttonStyle = {
      margin: 6,
      float: 'right',
    };

    return (
        <form onSubmit={handleSubmit} id="atc-form">
          <div>
            <Field
              name="name"
              validate={[Validators.required, Validators.unique(atcProducts.map(x => x.name))]}
              component={TextField}
              floatingLabelText="Name"
              hintText="Name"
              style={Styles.fields.text}
            />
          </div>

          <div>
            <Field
              name="keywords"
              component={renderChip}
              floatingLabelText="Product keywords"
              hintText="Product keywords"
              style={Styles.fields.text}
              labelStyle={Styles.fields.text}
              validate={[Validators.required]}
              chipContainerStyle={Styles.fields.text}
              fullWidth
              fullWidthInput
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
    );
  }
}

AtcCreateForm.propTypes = {
  onRequestClose: PropTypes.function,
};

const Form = reduxForm({
  form: 'atc-form',
})(AtcCreateForm);

function mapStateToProps(state) {
  return {
    atcProducts: state.atc.atcProducts,
  };
}

export default connect(mapStateToProps)(Form);
