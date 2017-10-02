import * as types from '../constants/ActionTypes';
import addNotification from '../actions/notification';

export function createProfile(name, description, settings = {}) {
  return function(dispatch) {
    dispatch(addNotification('Profile created'));
    dispatch({
      type: types.PROFILE_CREATE,
      name,
      description,
      settings,
    });
  };
}

export function setProfileEnabled(name) {
  return function(dispatch) {
    dispatch(addNotification(`Profile set to ${name}`));
    dispatch({
      type: types.PROFILE_SET_ENABLED,
      name,
    });
  };
}

export function removeProfile(name) {
  return function(dispatch) {
    dispatch(addNotification('Profile deleted'));
    dispatch({
      type: types.PROFILE_REMOVE,
      name,
    });
  };
}

export function updateProfileSettings(profileName, shop, key, value) {
  return function(dispatch) {
    dispatch(addNotification('Settings saved'));
    const obj = {};
    obj[key] = value;
    dispatch({
      type: types.PROFILE_UPDATE_SETTINGS,
      name: profileName,
      value: obj,
      shop,
    });
  };
}
