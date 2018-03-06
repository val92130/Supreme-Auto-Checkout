import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Toggle from 'material-ui/Toggle';
import { setProfileEnabled } from '../actions/profiles';

class ProfileToggle extends Component {
  onSetProfile(profileName) {
    const { currentProfile } = this.props; 
    if (currentProfile === profileName) {
      this.props.notify("Atleast 1 profile must be enabled");
      return;
    }

    this.props.setProfileEnabled(profileName);
  }

  render() {
    const { profile, currentProfile } = this.props;
    return (<Toggle toggled={profile.name === currentProfile} onToggle={() => this.onSetProfile(profile.name)} />);
  }
}

function mapStateToProps(state) {
  return {
    currentProfile: state.profiles.currentProfile,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setProfileEnabled: name => dispatch(setProfileEnabled(name)),
  };
}

ProfileToggle.PropTypes = {
  profile: PropTypes.object.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(ProfileToggle);
