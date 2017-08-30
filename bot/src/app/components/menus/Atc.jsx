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
import { red300 } from 'material-ui/styles/colors';
import Dialog from 'material-ui/Dialog';
import IconButton from 'material-ui/IconButton';
import DeleteButton from 'material-ui/svg-icons/action/delete';
import RaisedButton from 'material-ui/RaisedButton';
import Toggle from 'material-ui/Toggle';
import { addAtcProduct, removeAtcProduct, setAtcProductEnabled } from '../../actions/atc';
import AtcCreateForm from '../AtcCreateForm';

class Atc extends Component {
  constructor(props) {
    super(props);
    this.state = {
      createModalOpen: false,
    };
  }

  requestCloseModal() {
    this.setState({
      createModalOpen: false,
    });
  }

  requestModalOpen() {
    this.setState({
      createModalOpen: true,
    });
  }

  onRequestDeleteAtc(atcName) {
    this.props.removeAtcProduct(atcName);
  }

  handleSubmit(data) {
    this.requestCloseModal();
    this.props.addAtcProduct(data);
  }

  toggleAtc(name, enabled) {
    this.props.setAtcProductEnabled(name, enabled);
  }

  render() {
    const { atcProducts } = this.props;

    return (
      <div>
        <Dialog
          open={this.state.createModalOpen}
          title="Add a new atc product"
          modal={false}
          onRequestClose={() => this.requestCloseModal()}
        >
          <AtcCreateForm onRequestClose={() => this.requestCloseModal()} onSubmit={data => this.handleSubmit(data)} />
        </Dialog>
        <RaisedButton label="Add new" onTouchTap={() => this.requestModalOpen()} primary />
        <Table selectable={false}>
          <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
            <TableRow>
              <TableHeaderColumn>Name</TableHeaderColumn>
              <TableHeaderColumn>Keywords</TableHeaderColumn>
              <TableHeaderColumn>Color</TableHeaderColumn>
              <TableHeaderColumn>Category</TableHeaderColumn>
              <TableHeaderColumn>Enabled</TableHeaderColumn>
              <TableHeaderColumn>Delete</TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody displayRowCheckbox={false} stripedRows>
            {
              atcProducts.map((x) => {
                return (
                  <TableRow key={x.name}>
                    <TableRowColumn>{x.name}</TableRowColumn>
                    <TableRowColumn>{x.keywords.join(', ')}</TableRowColumn>
                    <TableRowColumn>{x.color || 'ANY'}</TableRowColumn>
                    <TableRowColumn>{x.category}</TableRowColumn>
                    <TableRowColumn>
                      <Toggle toggled={x.enabled} onToggle={() => this.toggleAtc(x.name, !x.enabled)} />
                    </TableRowColumn>
                    <TableRowColumn>
                      <IconButton onTouchTap={() => this.onRequestDeleteAtc(x.name)}>
                        <DeleteButton color={red300} />
                      </IconButton>
                    </TableRowColumn>
                  </TableRow>
                );
              })
            }
          </TableBody>
        </Table>
      </div>
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
    removeAtcProduct: data => dispatch(removeAtcProduct(data)),
    setAtcProductEnabled: (name, enabled) => dispatch(setAtcProductEnabled(name, enabled)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Atc);
