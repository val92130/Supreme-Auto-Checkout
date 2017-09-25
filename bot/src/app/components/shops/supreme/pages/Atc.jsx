import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';
import RaisedButton from 'material-ui/RaisedButton';
import { red300 } from 'material-ui/styles/colors';
import Dialog from 'material-ui/Dialog';
import IconButton from 'material-ui/IconButton';
import EditIcon from 'material-ui/svg-icons/image/edit';
import DeleteButton from 'material-ui/svg-icons/action/delete';
import Toggle from 'material-ui/Toggle';
import LaunchIcon from 'material-ui/svg-icons/action/launch';
import Layout from '../../../../containers/Layout';
import { addAtcProduct, removeAtcProduct, setAtcProductEnabled, editAtcProduct } from '../../../../actions/atc';
import AtcCreateForm from '../AtcCreateForm';
import StorageService from '../../../../../services/StorageService';
import AtcService from '../../../../../services/supreme/AtcService';
import ProductWatcherService from '../../../../../services/supreme/ProductWatcherService';
import version from '../../../../version';
import addNotification from '../../../../actions/notification';

class Atc extends Component {
  constructor(props) {
    super(props);
    this.state = {
      createModalOpen: false,
      editingAtc: null,
    };
  }

  requestCloseModal() {
    this.setState({
      createModalOpen: false,
      editingAtc: null,
    });
  }

  requestModalOpen(editingAtc = null) {
    this.setState({
      createModalOpen: true,
      editingAtc,
    });
  }

  onRequestDeleteAtc(atcName) {
    this.props.removeAtcProduct(atcName);
  }

  handleSubmit(data) {
    if (this.state.editingAtc) {
      this.props.editAtcProduct(this.state.editingAtc.name, data);
    } else {
      this.props.addAtcProduct(data);
    }
    this.requestCloseModal();
  }

  toggleAtc(name, enabled) {
    this.props.setAtcProductEnabled(name, enabled);
  }

  async runNow(category, keywords, color) {
    let atcCategory = category;
    const profile = await StorageService.getCurrentProfileSettings(version);
    if (!profile || !profile.Supreme) {
      this.props.notify('Please configure your bot before running ATC');
      return false;
    }
    const useMonitor = profile.Supreme.Options.atcUseMonitor;
    if (!useMonitor) {
      return AtcService.openAtcTab(atcCategory, keywords, color);
    }
    const monitorProducts = await ProductWatcherService.getProducts();
    if (!monitorProducts) {
      return false;
    }
    const hasFound = AtcService.openAtcTabMonitor(monitorProducts, atcCategory, keywords, color);
    if (!hasFound) {
      this.props.notify('No matching product found');
    }
  }

  render() {
    const { atcProducts } = this.props;
    const isEditing = this.state.editingAtc !== null;
    const title = isEditing ? `Edit ${this.state.editingAtc.name}` : 'Add a new product';
    return (
      <Layout>
        <Dialog
          open={this.state.createModalOpen}
          title={title}
          modal={false}
          onRequestClose={() => this.requestCloseModal()}
          autoScrollBodyContent
        >
          <AtcCreateForm onRequestClose={() => this.requestCloseModal()} onSubmit={data => this.handleSubmit(data)} initialValues={this.state.editingAtc} />
        </Dialog>
        <RaisedButton label="Add new" onTouchTap={() => this.requestModalOpen()} primary />
        <Table selectable={false}>
          <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
            <TableRow>
              <TableHeaderColumn>Name</TableHeaderColumn>
              <TableHeaderColumn>Enabled</TableHeaderColumn>
              <TableHeaderColumn>Run now</TableHeaderColumn>
              <TableHeaderColumn>Edit</TableHeaderColumn>
              <TableHeaderColumn>Delete</TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody displayRowCheckbox={false} stripedRows>
            {
              (() => {
                if (!atcProducts.length) {
                  return (<p style={{ textAlign: 'center' }}>Click "Add new" to add a new Autocop Product"</p>);
                }
                return atcProducts.map((x) => {
                  return (
                    <TableRow key={x.name}>
                      <TableRowColumn>{x.name}</TableRowColumn>
                      <TableRowColumn>
                        <Toggle toggled={x.enabled} onToggle={() => this.toggleAtc(x.name, !x.enabled)} />
                      </TableRowColumn>
                      <TableRowColumn>
                        <IconButton onTouchTap={async () => await this.runNow(x.category, x.keywords, x.color)}>
                          <LaunchIcon />
                        </IconButton>
                      </TableRowColumn>
                      <TableRowColumn>
                        <IconButton onTouchTap={() => this.requestModalOpen(x)}>
                          <EditIcon />
                        </IconButton>
                      </TableRowColumn>
                      <TableRowColumn>
                        <IconButton onTouchTap={() => this.onRequestDeleteAtc(x.name)}>
                          <DeleteButton color={red300} />
                        </IconButton>
                      </TableRowColumn>
                    </TableRow>
                  );
                });
              })()
            }
          </TableBody>
        </Table>
      </Layout>
    );
  }
}

function mapStateToProps(state) {
  return {
    atcProducts: state.atc.atcProducts,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    addAtcProduct: data => dispatch(addAtcProduct(data)),
    editAtcProduct: (name, data) => dispatch(editAtcProduct(name, data)),
    removeAtcProduct: data => dispatch(removeAtcProduct(data)),
    setAtcProductEnabled: (name, enabled) => dispatch(setAtcProductEnabled(name, enabled)),
    notify: msg => dispatch(addNotification(msg)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Atc);
