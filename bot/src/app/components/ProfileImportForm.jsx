import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { reduxForm, Field } from 'redux-form';
import RaisedButton from 'material-ui/RaisedButton';
import {
  TextField,
} from 'redux-form-material-ui';
import FlatButton from 'material-ui/FlatButton';
import FileInput from './FileInput';
import * as Validators from '../utils/FormValidators';
import Styles from '../constants/Styles';


class ProfileImportForm extends Component {
  render() {
    const { handleSubmit, pristine, submitting, onRequestClose } = this.props;
    const buttonStyle = {
      margin: 6,
      float: 'right',
    };

    return (
        <form onSubmit={handleSubmit} id="profile-export-form">
          <div>
            <Field
              name="file"
              component={FileInput}
              floatingLabelText="File"
              hintText="File"
              accept=".pfl"
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
              label="Import"
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

ProfileImportForm.propTypes = {
  onRequestClose: PropTypes.function,
};

const Form = reduxForm({
  form: 'profile-export-form',
})(ProfileImportForm);

export default Form;
