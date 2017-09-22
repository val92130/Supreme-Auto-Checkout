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


class ProfileCreateForm extends Component {
  render() {
    const { handleSubmit, pristine, submitting, onRequestClose, profiles } = this.props;
    const buttonStyle = {
      margin: 6,
      float: 'right',
    };

    return (
        <form onSubmit={handleSubmit} id="profile-form">
          <div>
            <Field
              name="name"
              validate={[Validators.required, Validators.unique(profiles.map(x => x.name))]}
              component={TextField}
              floatingLabelText="Name"
              hintText="Name"
              style={Styles.fields.text}
            />
          </div>

          <div>
            <Field
              name="description"
              component={TextField}
              floatingLabelText="Description"
              hintText="Description"
              style={Styles.fields.text}
              validate={[Validators.required]}
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

ProfileCreateForm.propTypes = {
  onRequestClose: PropTypes.function,
};

function mapStateToProps(state) {
  return {
    profiles: state.profiles.profiles,
    currentProfile: state.profiles.currentProfile,
  };
}

const Form = reduxForm({
  form: 'profile-form',
})(ProfileCreateForm);

export default connect(mapStateToProps)(Form);
