import * as Helpers from '../utils/Helpers';

export const initializeLocalStorageState = (initialState, version) => {
  localStorage.setItem('state', JSON.stringify([{ value: initialState || {}, version }]));
};

export const loadSavedState = (version) => {
  try {
    const items = JSON.parse(localStorage.getItem('state')) || [];
    const state = items.filter(x => x.version === version)[0];
    if (state) {
      return state.value;
    }
    return {};
  } catch (err) {
    initializeLocalStorageState({}, version);
    return {};
  }
};

export const saveState = (state, version) => {
  try {
    // If no state is saved, we create it using the current version number
    if (!localStorage.getItem('state')) {
      initializeLocalStorageState(state, version);
    } else {
      const currentState = JSON.parse(localStorage.getItem('state'));
      const currentVersionState = currentState.filter(x => x.version === version)[0];
      // If a state for the current version already exists, we update it
      if (currentVersionState) {
        currentVersionState.value = state;
      } else {
        currentState.push({ value: state, version });
      }
      localStorage.setItem('state', JSON.stringify(currentState));
    }
  } catch (err) {
    console.info('Possible corrupted or incompatible state found in the localstorage, reinitializing the state...');
    initializeLocalStorageState({}, version);
  }
};

export function saveToChromeStorage(key, value) {
  return new Promise((resolve) => {
    const obj = {};
    obj[key] = value;
    chrome.storage.local.set(obj, () => {
      resolve();
    });
  });
}

export function getFromChromeStorage(key) {
  return new Promise((resolve) => {
    chrome.storage.local.get(key, async (settings) => {
      console.log(settings);
      resolve(Helpers.isObjectEmpty(settings) ? {} : settings[key]);
    });
  });
}
