import React, {PropTypes} from 'react';
import {reduxForm, Field} from 'redux-form';
import {connect} from 'react-redux';
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

const Sizes = props => {
  const {handleSubmit, pristine, submitting} = props;
  return (
    <form onSubmit={handleSubmit} id="biling-form">
      <div>
        <Field
          name="accessories"
          component={SelectField}
          floatingLabelText="Accessories"
          hintText="Accessories"
          style={Styles.fields.text}
          validate={[Validators.required]}
        >
          {
            Utils.sizes.map(x => <MenuItem key={x} value={x} primaryText={x}/>)
          }
        </Field>
      </div>

      <div>
        <Field
          name="t-shirts"
          component={SelectField}
          floatingLabelText="T-Shirts"
          hintText="T-Shirts"
          style={Styles.fields.text}
          validate={[Validators.required]}
        >
          {
            Utils.sizes.map(x => <MenuItem key={x} value={x} primaryText={x}/>)
          }
        </Field>
      </div>

      <div>
        <Field
          name="pants"
          component={SelectField}
          floatingLabelText="Pants"
          hintText="Pants"
          style={Styles.fields.text}
          validate={[Validators.required]}
        >
          {
            Utils.sizesPants.map(x => <MenuItem key={x} value={x} primaryText={x}/>)
          }
        </Field>
      </div>

      <div>
        <Field
          name="shorts"
          component={SelectField}
          floatingLabelText="Shorts"
          hintText="Shorts"
          style={Styles.fields.text}
          validate={[Validators.required]}
        >
          {
            Utils.sizesPants.map(x => <MenuItem key={x} value={x} primaryText={x}/>)
          }
        </Field>
      </div>

      <div>
        <Field
          name="sweatshirts"
          component={SelectField}
          floatingLabelText="Sweatshirts"
          hintText="Sweatshirts"
          style={Styles.fields.text}
          validate={[Validators.required]}
        >
          {
            Utils.sizes.map(x => <MenuItem key={x} value={x} primaryText={x}/>)
          }
        </Field>
      </div>

      <div>
        <Field
          name="tops-sweaters"
          component={SelectField}
          floatingLabelText="Tops/Sweaters"
          hintText="Tops/Sweaters"
          style={Styles.fields.text}
          validate={[Validators.required]}
        >
          {
            Utils.sizes.map(x => <MenuItem key={x} value={x} primaryText={x}/>)
          }
        </Field>
      </div>

      <div>
        <Field
          name="shirts"
          component={SelectField}
          floatingLabelText="Shirts"
          hintText="Shirts"
          style={Styles.fields.text}
          validate={[Validators.required]}
        >
          {
            Utils.sizes.map(x => <MenuItem key={x} value={x} primaryText={x}/>)
          }
        </Field>
      </div>

      <div>
        <Field
          name="jackets"
          component={SelectField}
          floatingLabelText="Jackets"
          hintText="Jackets"
          style={Styles.fields.text}
          validate={[Validators.required]}
        >
          {
            Utils.sizes.map(x => <MenuItem key={x} value={x} primaryText={x}/>)
          }
        </Field>
      </div>

      <div>
        <Field
          name="shoes"
          component={SelectField}
          floatingLabelText="Shoes"
          hintText="Shoes"
          style={Styles.fields.text}
          validate={[Validators.required]}
        >
          {
            Utils.shoeSizes.map(x => <MenuItem key={x} value={x} primaryText={x}/>)
          }
        </Field>
      </div>

      <div>
        <Field
          name="skate"
          component={SelectField}
          floatingLabelText="Skate"
          hintText="Skate"
          style={Styles.fields.text}
          validate={[Validators.required]}
        >
          {
            Utils.skateSizes.map(x => <MenuItem key={x} value={x} primaryText={x} />)
          }
        </Field>
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

Sizes.propTypes = {
  shop: PropTypes.string.isRequired,
};

function mapStateToProps(state, ownProps) {
  const currentProfile = state.profiles.currentProfile;
  const settings = state.profiles.profiles.filter(x => x.name === currentProfile)[0].settings;
  return {
    initialValues: (settings[ownProps.shop] || {})[menus.MENU_SIZES] || {},
  };
}

export default connect(mapStateToProps)(reduxForm({
  form: 'sizes',
})(Sizes));
