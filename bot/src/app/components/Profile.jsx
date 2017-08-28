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
import Toggle from 'material-ui/Toggle';
import IconButton from 'material-ui/IconButton';
import DeleteButton from 'material-ui/svg-icons/action/delete';
import RaisedButton from 'material-ui/RaisedButton';
import { createProfile, setProfileEnabled, removeProfile } from '../actions/profiles';
import Layout from '../containers/Layout.jsx';
import ProfileCreateForm from './ProfileCreateForm';
import ProfileToggle from './ProfileToggle';

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      createModalOpen: false,
    };
  }

  onSetProfile(profileName) {
    this.props.setProfileEnabled(profileName);
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

  onRequestDeleteProfile(name) {
    this.props.removeProfile(name);
  }

  handleSubmit(data) {
    this.props.createProfile(data.name, data.description);
    this.requestCloseModal();
  }

  render() {
    const { profiles, currentProfile } = this.props;

    return (
      <Layout title="Profiles">
        <Dialog
          open={this.state.createModalOpen}
          title="Create a new profile"
          modal={false}
          onRequestClose={this.handleClose}
        >
          <ProfileCreateForm
            onSubmit={data => this.handleSubmit(data)}
            onRequestClose={() => this.requestCloseModal()}
          />
        </Dialog>
        <RaisedButton label="Add new" onTouchTap={() => this.requestModalOpen()} primary />
        <Table selectable={false}>
          <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
            <TableRow>
              <TableHeaderColumn>Name</TableHeaderColumn>
              <TableHeaderColumn>Description</TableHeaderColumn>
              <TableHeaderColumn>Enabled</TableHeaderColumn>
              <TableHeaderColumn>Delete</TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody displayRowCheckbox={false} stripedRows>
            {
              profiles.map((x, i) => {
                return (
                  <TableRow key={i}>
                    <TableRowColumn>{x.name}</TableRowColumn>
                    <TableRowColumn>{x.description}</TableRowColumn>
                    <TableRowColumn>
                      <ProfileToggle profile={x} />
                    </TableRowColumn>
                    <TableRowColumn>
                      <IconButton onTouchTap={() => this.onRequestDeleteProfile(x.name)} disabled={x.name === 'default'}>
                        <DeleteButton color={red300} />
                      </IconButton>
                    </TableRowColumn>
                  </TableRow>
                );
              })
            }
          </TableBody>
        </Table>
      </Layout>
    );
  }
}

function mapStateToProps(state) {
  return {
    profiles: state.profiles.profiles,
    currentProfile: state.profiles.currentProfile,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    createProfile: (name, description) => dispatch(createProfile(name, description)),
    setProfileEnabled: name => dispatch(setProfileEnabled(name)),
    removeProfile: name => dispatch(removeProfile(name)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
