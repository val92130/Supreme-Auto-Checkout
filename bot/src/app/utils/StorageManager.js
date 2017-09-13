import * as Helpers from '../utils/Helpers';

export function getItem(key) {
  return new Promise((resolve) => {
    chrome.storage.local.get(key, async (settings) => {
      resolve(Helpers.isObjectEmpty(settings) ? null : settings[key]);
    });
  });
}

export function setItem(key, value) {
  return new Promise((resolve) => {
    const obj = {};
    obj[key] = value;
    chrome.storage.local.set(obj, () => {
      resolve();
    });
  });
}

export const initializeStorageState = async (initialState, version) => {
  return setItem('state', { value: initialState || {}, version });
};

export const loadSavedState = async (version) => {
  try {
    const state = await getItem('state') || {};
    if (state.version === version) {
      return state.value;
    }
    await initializeStorageState({}, version);
    return {};
  } catch (err) {
    await initializeStorageState({}, version);
    return {};
  }
};

export const saveState = async (state, version) => {
  try {
    // If no state is saved, we create it using the current version number
    if (!await getItem('state')) {
      await initializeStorageState(state, version);
    } else {
      let currentState = await getItem('state');
      // If a state for the current version already exists, we update it
      if (currentState.version === version) {
        currentState.value = state;
      } else {
        currentState = { value: state, version };
      }
      await setItem('state', currentState);
    }
  } catch (err) {
    console.info('Possible corrupted or incompatible state found in the localstorage, reinitializing the state...');
    await initializeStorageState({}, version);
  }
};

export async function getCurrentProfileSettings(version) {
  const state = await loadSavedState(version);
  if (!state || !state.profiles) {
    return null;
  }
  const currentProfile = state.profiles.currentProfile;
  return state.profiles.profiles.filter(x => x.name === currentProfile)[0].settings;
}
