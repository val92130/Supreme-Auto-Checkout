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
import IconButton from 'material-ui/IconButton';
import ActionDelete from 'material-ui/svg-icons/action/delete';
import { orange400, blue400, green400, red400 } from 'material-ui/styles/colors';
import * as Validators from '../../../utils/FormValidators';
import Styles from '../../../constants/Styles';
import * as Utils from '../../../constants/Utils';
import ProductsService from '../../../../services/supreme/ProductsService';
import KeywordsService from '../../../../services/KeywordsService';
import DropsService from '../../../../services/supreme/DropsService';
import FuzzyStringMatcher from '../../../utils/FuzzyStringMatcher';


function getSizeForCategory(category) {
  switch (category) {
    case 'accessories':
    case 't-shirts':
    case 'sweatshirts':
    case 'tops-sweaters':
    case 'shirts':
    case 'jackets':
      return Utils.sizes;
    case 'pants':
    case 'shorts':
      return Utils.sizesPants;
    case 'shoes':
      return Utils.shoeSizes;
    case 'skate':
      return Utils.skateSizes;
    case 'hats':
      return Utils.hatsSizes;
    default:
      return [];
  }
}

class AtcCreateForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      keywords: props.initialValues.keywords || [],
      category: props.initialValues.category,
      matchedProducts: [],
      matchedDropProducts: [],
    };
    if (props.initialValues && props.initialValues.category) {
      this.onKeywordChange(props.initialValues.keywords);
    }
  }

  async onKeywordChange(keywords) {
    if (!this.state.category || !this.state.keywords.length) {
      return;
    }
    const monitoredProducts = await ProductsService.fetchProducts();
    const matches = KeywordsService.findMatches(monitoredProducts, keywords, this.state.category) || [];
    this.setState({
      matchedProducts: matches.map(x => x.name),
    });
    const dropProducts = (await DropsService.fetchLatestDropProducts()).filter(x => x.category === this.state.category);
    const matcher = new FuzzyStringMatcher(dropProducts, { key: 'name' });
    const dropMatches = matcher.search(keywords.join(' '));
    this.setState({
      matchedDropProducts: dropMatches.map(x => x.name),
    });
  }

  addIgnoreKeyword(productName) {
    const productKeywords = productName.split(' ').map(x => x.toLowerCase());
    const keywords = this.state.keywords.map(x => x.toLowerCase());
    const ignoringKeyword = productKeywords.find(x => keywords.indexOf(x) === -1);
    if (ignoringKeyword) {
      const newKeywords = [`!${ignoringKeyword}`, ...this.state.keywords];
      this.props.change('keywords', newKeywords);
      this.setState({
        keywords: newKeywords,
      });
      this.onKeywordChange(newKeywords);
    }
  }

  render() {
    const { handleSubmit, pristine, submitting, onRequestClose, atcProducts, initialValues, editing } = this.props;
    const renderChip = ({input, hintText, floatingLabelText, meta: {touched, error} }) => (
      <ChipInput
        {...input}
        chipContainerStyle={Styles.fields.text}
        fullWidth
        value={input.value || []}
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
      formValidators.push(Validators.unique(atcProducts.map(x => x.product.name)));
    } else {
      formValidators.push(Validators.unique(atcProducts.filter(x => x.product.name !== initialAtcName).map(x => x.product.name)));
    }
    const deleteIconStyle = {
      width: 16,
      height: 16,
      color: red400,
    };

    const deleteStyle = {
      width: 32,
      height: 32,
    };
    return (
      <div>
        <p style={{ fontSize: '0.8em' }}>ATC Product description is only used to differentiate different ATC products, it doesn't have any effect on the Autocop process.</p>
        <p style={{ fontSize: '0.8em' }}>Keywords is the most important information to find a product for Autocop, make sure to add detailed keywords. For example for a Box Logo add the following keywords: box, logo, hoodie.</p>
        <p style={{ fontSize: '0.8em' }}>You can also add negative keywords by prepending a <b>"!"</b> to a keyword, for example the keywords "<b>box logo !longsleeve tee</b>" will match a product like <b>"Box Logo Tee"</b> but not <b>"Box Logo Longsleeve tee"</b></p>
        <p style={{ fontSize: '0.8em' }}>If you do not select a size, AutoCop will choose the size you selected in the <b>"Sizings"</b> tab.</p>
        {this.state.matchedProducts.length > 0 && (<p style={{ color: orange400, fontSize: '0.9em' }}>
          Warning! Your keywords already matches with the following products from the store, click on the bin to ignore unwanted products:
          <ul>
          {this.state.matchedProducts.map(x => {
            return (
              <li>{x}
                <IconButton
                  style={deleteStyle}
                  iconStyle={deleteIconStyle}
                  onTouchTap={() => this.addIgnoreKeyword(x)}
                  tooltip="Add negative keywords to ignore"
                >
                  <ActionDelete />
                </IconButton>
              </li>
            );
          })}
          </ul>
        </p>)}
        {this.state.matchedDropProducts.length > 1 && (<p style={{ color: blue400, fontSize: '0.9em' }}>
          Warning! Your keywords matches with multiple products from the incoming drop, click on the bin to ignore unwanted products:
          <ul>
          {this.state.matchedDropProducts.map(x => {
            return (
              <li>{x}
                <IconButton
                  style={deleteStyle}
                  iconStyle={deleteIconStyle}
                  onTouchTap={() => this.addIgnoreKeyword(x)}
                  tooltip="Add negative keywords to ignore"
                >
                  <ActionDelete />
                </IconButton>
              </li>
            );
          })}
          </ul>
        </p>)}
        {this.state.matchedDropProducts.length === 1 && (
          <div style={{ color: green400 }}>
            <p>The keywords will match the following product from the incoming drop:</p>
            <ul>
              <li>{this.state.matchedDropProducts[0]}</li>
            </ul>
          </div>

        )}
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
              onChange={(v) => {
                const keywords = Object.values(v).filter(x => typeof x === 'string');
                this.setState({ keywords }, () => {
                  this.onKeywordChange(keywords);
                });
              }}
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
              onChange={(i, v) => {
                this.setState({ category: v }, () => {
                  this.onKeywordChange(this.state.keywords);
                });
              }}
            >
              {
                Utils.categories.map((x) => {
                  return (
                    <MenuItem key={x} value={x} primaryText={x} />
                  );
                })
              }
            </Field>
          </div>

          <div>
            <Field
              name="size"
              component={SelectField}
              floatingLabelText="Product size"
              style={Styles.fields.text}
            >
              {
                [<MenuItem value={null} primaryText="" />, ...getSizeForCategory(this.state.category || initialValues.category).map((x) => {
                  return (
                    <MenuItem key={x} value={x} primaryText={x} />
                  );
                })]
              }
            </Field>
          </div>

          <div>
            <Field
              name="retryCount"
              validate={[Validators.required]}
              component={SelectField}
              floatingLabelText="Action if the product is not found"
              hintText="Action if the product is not found"
              style={Styles.fields.text}
            >
              <MenuItem value="inf" primaryText="Keep refreshing until the product is found" />
              <MenuItem value="skip" primaryText="Skip to next Autocop product" />
              {
                Array.apply(null, new Array(5)).map((x, i) => {
                  return <MenuItem key={(i + 1) * 5} value={(i + 1) * 5} primaryText={`Refresh ${(i + 1) * 5} times`} />;
                })
              }
            </Field>
          </div>

          <div>
            <Field
              name="soldOutAction"
              validate={[Validators.required]}
              component={SelectField}
              floatingLabelText="Action if the product is sold out"
              hintText="Action if the product is sold out"
              style={Styles.fields.text}
            >
              <MenuItem value="skip" primaryText="Skip to next Autocop product" />
              <MenuItem value="inf" primaryText="Keep refreshing until the product restocks" />
              {
                Array.apply(null, new Array(5)).map((x, i) => {
                  return <MenuItem key={(i + 1) * 5} value={(i + 1) * 5} primaryText={`Refresh ${(i + 1) * 5} times`} />;
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
      retryCount: 'inf',
      soldOutAction: 'skip',
    }, ownProps.initialValues),
  };
}

export default connect(mapStateToProps)(Form);
