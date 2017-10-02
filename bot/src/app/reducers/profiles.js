import * as types from '../constants/ActionTypes';

export default function profiles(state = {
  currentProfile: 'default',
  profiles: [{
    name: 'default',
    description: 'Default profile',
    settings: {},
  }],
}, action) {
  if (action.type === types.PROFILE_CREATE) {
    const list = state.profiles.map(x => Object.assign({}, x));
    list.push({
      name: action.name,
      description: action.description,
      settings: action.settings || {},
    });
    return Object.assign({}, state, { profiles: list });
  } else if (action.type === types.PROFILE_SET_ENABLED) {
    if (!state.profiles.filter(x => x.name === action.name)) {
      return state;
    }
    return Object.assign({}, state, { currentProfile: action.name });
  } else if (action.type === types.PROFILE_REMOVE) {
    if (action.name === 'default') {
      return state;
    }
    return Object.assign({}, state, {
      profiles: state.profiles.filter(x => x.name !== action.name),
      currentProfile: state.currentProfile === action.name ? 'default' : state.currentProfile,
    });
  } else if (action.type === types.PROFILE_UPDATE_SETTINGS) {
    const profile = state.profiles.filter(x => x.name === action.name)[0];
    if (!profile) {
      return state;
    }

    const settingsObj = Object.assign({}, profile.settings);
    settingsObj[action.shop] = Object.assign({}, profile.settings[action.shop], action.value);
    const profileList = state.profiles.map(x => {
      if (x.name === action.name) {
        return Object.assign({}, x, { settings: settingsObj });
      }
      return x;
    });
    return Object.assign({}, state, { profiles: profileList });
  }
  return state;
}
