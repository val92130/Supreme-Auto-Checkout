import React, { PropTypes, Component } from 'react';
import { reduxForm, Field, change } from 'redux-form';
import { connect } from 'react-redux';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import Divider from 'material-ui/Divider';
import {
  SelectField,
} from 'redux-form-material-ui';
import Styles from '../../../../constants/Styles';
import * as Utils from '../../../../constants/Utils';
import * as Validators from '../../../../utils/FormValidators';
import * as menus from '../../../../constants/Menus';

class Sizes extends Component {
  handleSetAny() {
    for (let field of ['accessories', 't-shirts', 'pants', 'shorts', 'sweatshirts', 'tops-sweaters', 'shirts', 'jackets', 'shoes', 'skate', 'hats']) {
      this.props.changeFieldValue(field, 'Any');
    }
  }

  render() {
    const { handleSubmit, pristine, submitting } = this.props;
    return (
      <div>
        <p style={{ textAlign: 'center', fontSize: '1.2em' }}>Configure your desired sizes</p>
        <div style={{ textAlign: 'center', marginBottom: 16 }}>
          <RaisedButton
            onTouchTap={() => this.handleSetAny()}
            label="Use any size for all"
          />
        </div>
        <Divider />
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
            <Field
              name="hats"
              component={SelectField}
              floatingLabelText="Hats"
              hintText="Hats"
              style={Styles.fields.text}
              validate={[Validators.required]}
            >
              {
                Utils.hatsSizes.map(x => <MenuItem key={x} value={x} primaryText={x} />)
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
      </div>
    );
  }

}

Sizes.propTypes = {
  shop: PropTypes.string.isRequired,
};

function mapStateToProps(state, ownProps) {
  const currentProfile = state.profiles.currentProfile;
  const settings = state.profiles.profiles.filter(x => x.name === currentProfile)[0].settings;
  return {
    form: 'sizings-form',
    initialValues: (settings[ownProps.shop] || {})[menus.MENU_SIZES] || {},
  };
}

function mapDispatchToProps(dispatch) {
  return {
    changeFieldValue: (field, value) => dispatch(change('sizings-form', field, value)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(reduxForm({
  form: 'sizes',
})(Sizes));
