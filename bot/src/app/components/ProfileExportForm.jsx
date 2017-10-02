import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { reduxForm, Field } from 'redux-form';
import {
  TextField,
} from 'redux-form-material-ui';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import * as Validators from '../utils/FormValidators';
import Styles from '../constants/Styles';


class ProfileExportForm extends Component {
  render() {
    const { handleSubmit, pristine, submitting, onRequestClose } = this.props;
    const buttonStyle = {
      margin: 6,
      float: 'right',
    };

    return (
        <form onSubmit={handleSubmit} id="profile-export-form">
          <p>You must choose a password to encrypt your settings.</p>
          <p>You will be asked to enter this password when you later import this profile.</p>
          <div>
            <Field
              name="name"
              validate={[Validators.required]}
              component={TextField}
              floatingLabelText="Name"
              hintText="Name"
              style={Styles.fields.text}
            />
          </div>
          <div>
            <Field
              name="password"
              validate={[Validators.required]}
              component={TextField}
              floatingLabelText="Password"
              hintText="Password"
              style={Styles.fields.text}
              type="password"
            />
          </div>
          <div>
            <RaisedButton
              label="Export"
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

ProfileExportForm.propTypes = {
  onRequestClose: PropTypes.function,
};

const Form = reduxForm({
  form: 'profile-export-form',
})(ProfileExportForm);

export default Form;
