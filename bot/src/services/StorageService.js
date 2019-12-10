import * as Helpers from '../app/utils/Helpers';
import version from '../app/version';

export default class StorageService {
  static getItem(key) {
    return new Promise((resolve) => {
      chrome.storage.local.get(key, async (settings) => {
        resolve(Helpers.isObjectEmpty(settings) ? null : settings[key]);
      });
    });
  }

  static setItem(key, value) {
    return new Promise((resolve) => {
      const obj = {};
      obj[key] = value;
      chrome.storage.local.set(obj, () => {
        resolve();
      });
    });
  }

  static setCookie(cookieObj) {
    return new Promise((res, rej) => {
      chrome.cookies.set(cookieObj, (cookie) => {
        if (!cookie) {
          return rej(new Error('Couldnt set cookie'));
        }

        return res(cookie);
      });
    });
  }

  static initializeStorageState(initialState) {
    return this.setItem('state', { value: initialState || {}, version });
  }

  static async getOrCreateState() {
    try {
      const state = await this.loadSavedState();
      if (!state) {
        await this.initializeStorageState({});
        return {};
      }
      return state;
    } catch (err) {
      await this.initializeStorageState({});
      return {};
    }
  }

  static async loadSavedState() {
    const state = await this.getItem('state') || {};
    return state.value || null;
  }

  static async saveState(state) {
    try {
      // If no state is saved, we create it using the current version number
      if (!await this.getItem('state')) {
        await this.initializeStorageState(state);
      } else {
        let currentState = await this.getItem('state');
        // If a state for the current version already exists, we update it
        if (currentState.version === version) {
          currentState.value = state;
        } else {
          currentState = { value: state, version };
        }
        await this.setItem('state', currentState);
      }
    } catch (err) {
      console.info(err);
      console.info('Possible corrupted or incompatible state found in the localstorage, reinitializing the state...');
      await this.initializeStorageState({});
    }
  }

  static async getCurrentProfileSettings() {
    const state = await this.getOrCreateState();
    if (!state || !state.profiles) {
      return null;
    }
    const currentProfile = state.profiles.currentProfile;
    return state.profiles.profiles.filter(x => x.name === currentProfile)[0].settings;
  }
}
