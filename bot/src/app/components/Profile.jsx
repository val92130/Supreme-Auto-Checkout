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
import DownloadButton from 'material-ui/svg-icons/action/backup';
import DuplicateButton from 'material-ui/svg-icons/content/content-copy';
import RaisedButton from 'material-ui/RaisedButton';
import { createProfile, setProfileEnabled, removeProfile } from '../actions/profiles';
import addNotification from '../actions/notification';
import Layout from '../containers/Layout';
import ProfileCreateForm from './ProfileCreateForm';
import ProfileExportForm from './ProfileExportForm';
import ProfileImportForm from './ProfileImportForm';
import ProfileToggle from './ProfileToggle';
import CryptoService from '../../services/CryptoService';
import ChromeService from '../../services/ChromeService';
import { slugify } from '../utils/Helpers';

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      createModalOpen: false,
      exportModalOpen: false,
      importModalOpen: false,
      exportingProfile: null,
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

  requestExportModalOpen(profile) {
    this.setState({
      exportModalOpen: true,
      exportingProfile: profile,
    });
  }

  requestCloseExportModal() {
    this.setState({
      exportModalOpen: false,
      exportingProfile: null,
    });
  }

  requestImportModalOpen() {
    if (ChromeService.isPopup()) {
      ChromeService.openOptionsPage('profiles');
      return;
    }
    this.setState({
      importModalOpen: true,
    });
  }

  requestCloseImportModal() {
    this.setState({
      importModalOpen: false,
    });
  }

  onRequestDeleteProfile(name) {
    this.props.removeProfile(name);
  }

  handleSubmit(data) {
    this.props.createProfile(data.name, data.description);
    this.requestCloseModal();
  }

  handleExport(data) {
    this.exportProfile(data.password, data.name);
    this.requestCloseExportModal();
  }

  async handleImport(data) {
    const { file, password } = data;
    const { notify, profiles } = this.props;
    try {
      const promise = new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = e => resolve(e.target.result);
        reader.onerror = reject;
        reader.readAsText(file);
      });
      const result = await promise;
      const decrypted = CryptoService.decrypt(result, password);
      const json = JSON.parse(decrypted);
      if (!json.name || !json.profile) throw new Error('Malformed json data');
      const existingNames = profiles.filter(x => x.name === json.name);
      if (existingNames.length) {
        json.name = `${json.name}(${existingNames.length})`;
      }
      this.props.createProfile(json.name, json.profile.description, json.profile.settings);
      notify('Profile successfully imported');
    } catch (e) {
      console.error(e);
      notify('Error while importing profile, corrupted data or invalid password');
    } finally {
      this.requestCloseImportModal();
    }
  }

  exportProfile(password, name) {
    const { exportingProfile } = this.state;
    const data = {
      name,
      profile: exportingProfile,
    };
    const result = CryptoService.encrypt(JSON.stringify(data), password);
    // Save as file
    const url = `data:application/json,${result}`;
    chrome.downloads.download({
      url,
      filename: slugify(name) + '.pfl',
    });
  }

  duplicateProfile(profile) {
    const { notify, profiles, createProfile } = this.props;
    let profileName = `${profile.name} - copy`;
    const existingNames = profiles.filter(x => x.name === profileName);
    if (existingNames.length) {
      profileName = `${profileName}(${existingNames.length})`;
    }
    createProfile(profileName, profile.description, profile.settings);
    notify('Profile duplicated');
  }

  render() {
    const { profiles } = this.props;

    return (
      <Layout title="Profiles">
        <Dialog
          open={this.state.createModalOpen}
          title="Create a new profile"
          modal={false}
          onRequestClose={() => this.requestCloseModal()}
        >
          <ProfileCreateForm
            onSubmit={data => this.handleSubmit(data)}
            onRequestClose={() => this.requestCloseModal()}
          />
        </Dialog>
        <Dialog
          open={this.state.exportModalOpen}
          title="Export your profile"
          modal={false}
          onRequestClose={() => this.requestCloseExportModal()}
        >
          <ProfileExportForm
            onSubmit={data => this.handleExport(data)}
            onRequestClose={() => this.requestCloseExportModal()}
          />
        </Dialog>
        <Dialog
          open={this.state.importModalOpen}
          title="Import a profile"
          modal={false}
          onRequestClose={() => this.requestCloseImportModal()}
        >
          <ProfileImportForm
            onSubmit={async data => await this.handleImport(data)}
            onRequestClose={() => this.requestCloseImportModal()}
          />
        </Dialog>
        <div style={{ textAlign: 'center', marginLeft: 'auto', marginRight: 'auto', width: '100%' }}>
          <p>Create, import or export profiles to manage your different configurations.</p>
          <p>Note: AutoCop products are independent of profiles.</p>
          <RaisedButton label="Add new" onTouchTap={() => this.requestModalOpen()} primary />
          <RaisedButton label="Import" onTouchTap={() => this.requestImportModalOpen()} />
        </div>
        <Table selectable={false}>
          <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
            <TableRow>
              <TableHeaderColumn>Name</TableHeaderColumn>
              {!ChromeService.isPopup() && <TableHeaderColumn>Description</TableHeaderColumn>}
              <TableHeaderColumn>Enabled</TableHeaderColumn>
              <TableHeaderColumn>Export</TableHeaderColumn>
              <TableHeaderColumn>Duplicate</TableHeaderColumn>
              <TableHeaderColumn>Delete</TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody displayRowCheckbox={false} stripedRows>
            {
              profiles.map((x, i) => {
                return (
                  <TableRow key={i}>
                    <TableRowColumn>{x.name}</TableRowColumn>
                    {!ChromeService.isPopup() && <TableRowColumn>{x.description}</TableRowColumn>}
                    <TableRowColumn>
                      <ProfileToggle profile={x} />
                    </TableRowColumn>
                    <TableRowColumn>
                      <IconButton onTouchTap={() => this.requestExportModalOpen(x)}>
                        <DownloadButton color={red300} />
                      </IconButton>
                    </TableRowColumn>
                    <TableRowColumn>
                      <IconButton onTouchTap={() => this.duplicateProfile(x)}>
                        <DuplicateButton color={red300} />
                      </IconButton>
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
    createProfile: (name, description, settings) => dispatch(createProfile(name, description, settings)),
    setProfileEnabled: name => dispatch(setProfileEnabled(name)),
    removeProfile: name => dispatch(removeProfile(name)),
    notify: e => dispatch(addNotification(e)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
