import { notify } from '../notification';

export default class AdidasManager {
  constructor(preferences, sizings, billing) {
    this.preferences = preferences;
    this.sizings = sizings;
    this.billing = billing;
  }

  start() {
    notify('Hey');
  }
}
